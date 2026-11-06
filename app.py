from flask import Flask, render_template, request, jsonify, send_from_directory, abort
import httpx
from dotenv import load_dotenv
import os
import resend
from urllib.parse import quote

from treatments import (
    TREATMENTS,
    TREATMENTS_HI,
    TREATMENT_PRICES,
    CATEGORIES,
    featured_treatments,
    results_for,
)

load_dotenv()

app = Flask(__name__, static_url_path='/static')

# ---- AI chatbot provider -------------------------------------------------
# Default: xAI Grok (OpenAI-compatible API). Put the key in .env as XAI_API_KEY
# (GROK_API_KEY / GROQ_API_KEY are also read). A key starting with "gsk_" is a
# Groq key and is routed to Groq instead.
AI_KEY = (os.getenv('XAI_API_KEY') or os.getenv('GROK_API_KEY') or os.getenv('GROQ_API_KEY') or '').strip()
if AI_KEY.startswith('gsk_'):
    AI_PROVIDER = 'groq'
    AI_BASE_URL = 'https://api.groq.com/openai/v1'
    AI_MODEL = os.getenv('AI_MODEL', 'openai/gpt-oss-120b')
else:
    AI_PROVIDER = 'xai'
    AI_BASE_URL = os.getenv('XAI_API_BASE', 'https://api.x.ai/v1')
    AI_MODEL = os.getenv('AI_MODEL', 'grok-4-1-fast-non-reasoning')
CLINIC_EMAIL = os.getenv('CLINIC_EMAIL', 'drhenrysdermatology@gmail.com')
RESEND_API_KEY = os.getenv('RESEND_API_KEY', '')
# Verified sender in Resend. Until your domain is verified, use: Dr Henry's Skin Clinic <onboarding@resend.dev>
RESEND_FROM = os.getenv('RESEND_FROM', "Dr Henry's Skin Clinic <onboarding@resend.dev>")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY



@app.route('/')
def home():
    return render_template(
        'index.html',
        treatments=featured_treatments(),
        categories=CATEGORIES,
    )


def _fmt_inr(n):
    """12500 -> '12,500' (Indian digit grouping)."""
    s = str(int(n))
    if len(s) <= 3:
        return s
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    if head:
        parts.insert(0, head)
    return ','.join(parts + [tail])


def price_display(slug):
    """Returns (english, hindi) text for a treatment's price, or None if no price is set."""
    p = TREATMENT_PRICES.get(slug) or {}
    lo, hi = p.get('from'), p.get('to')
    if lo in ('', None):
        return None
    if hi in ('', None) or hi == lo:
        amount = '\u20b9' + _fmt_inr(lo)
        prefix_en, prefix_hi = 'From ', 'शुरुआत '
        en = prefix_en + amount
        hi_txt = amount + ' से'
    else:
        amount = '\u20b9%s \u2013 \u20b9%s' % (_fmt_inr(lo), _fmt_inr(hi))
        en, hi_txt = amount, amount
    unit_en, unit_hi = p.get('unit', ''), p.get('unit_hi', '')
    return (en + (' ' + unit_en if unit_en else ''), hi_txt + (' (' + unit_hi + ')' if unit_hi else ''))

@app.route('/treatments/<slug>')
def treatment_page(slug):
    treatment = TREATMENTS.get(slug)
    if not treatment:
        abort(404)
    hi = dict(TREATMENTS_HI.get(slug, {}))
    price = price_display(slug)
    if price:
        treatment = dict(treatment, cost=price[0])
        hi['cost'] = price[1]
    related = [t for t in featured_treatments() if t['category'] == treatment.get('category') and t['slug'] != slug][:4]
    return render_template(
        'treatment.html',
        treatment=treatment,
        hi=hi,
        has_price=bool(price),
        results=results_for(slug),
        related=related,
        related_hi=TREATMENTS_HI,
    )


def get_site_url():
    """Public base URL (no trailing slash). Set SITE_URL in the environment to force a
    custom domain; otherwise the domain the visitor is actually on is used."""
    forced = (os.getenv('SITE_URL') or '').strip().rstrip('/')
    if forced:
        return forced
    host = request.headers.get('X-Forwarded-Host') or request.host
    local = host.startswith(('127.', 'localhost', '0.0.0.0'))
    return ('http://' if local else 'https://') + host


@app.context_processor
def inject_site_url():
    return {'site_url': get_site_url()}


@app.route('/robots.txt')
def robots():
    body = "User-agent: *\nAllow: /\nDisallow: /chat\nDisallow: /chatbot\nDisallow: /api/\n\nSitemap: %s/sitemap.xml\n" % get_site_url()
    return app.response_class(body, mimetype='text/plain')


@app.route('/sitemap.xml')
def sitemap():
    base = get_site_url()
    urls = [(base + '/', '1.0')] + [(base + '/treatments/' + slug, '0.8') for slug in TREATMENTS]
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for loc, pr in urls:
        xml += '  <url><loc>%s</loc><priority>%s</priority></url>\n' % (loc, pr)
    xml += '</urlset>\n'
    return app.response_class(xml, mimetype='application/xml')


@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')


@app.route('/api/appointment', methods=['POST'])
def appointment():
    """Receive booking details and email the clinic via Resend."""
    data = request.get_json(silent=True) or {}
    name = (data.get('name') or '').strip()
    phone = (data.get('phone') or '').strip()
    email = (data.get('email') or '').strip()
    concern = (data.get('concern') or '').strip()
    day = (data.get('day') or '').strip()
    note = (data.get('note') or '').strip()

    if not name or not phone or not concern or not day:
        return jsonify({'ok': False, 'error': 'Missing required fields'}), 400

    text_body = (
        f"New appointment request — Dr Henry's Skin Clinic\n\n"
        f"Name: {name}\n"
        f"Phone: {phone}\n"
        f"Email: {email or '—'}\n"
        f"Concern: {concern}\n"
        f"Preferred day: {day}\n"
        f"Message: {note or '—'}\n"
    )
    html_body = f"""
    <h2>New appointment request</h2>
    <p><strong>Clinic:</strong> Dr Henry's Skin Clinic</p>
    <ul>
      <li><strong>Name:</strong> {name}</li>
      <li><strong>Phone:</strong> {phone}</li>
      <li><strong>Email:</strong> {email or '—'}</li>
      <li><strong>Concern:</strong> {concern}</li>
      <li><strong>Preferred day:</strong> {day}</li>
      <li><strong>Message:</strong> {note or '—'}</li>
    </ul>
    """

    if not RESEND_API_KEY:
        return jsonify({
            'ok': True,
            'emailed': False,
            'error': 'RESEND_API_KEY is not set in .env'
        }), 200

    try:
        payload = {
            'from': RESEND_FROM,
            'to': [CLINIC_EMAIL],
            'subject': f"Appointment request — {name}",
            'text': text_body,
            'html': html_body,
        }
        if email:
            payload['reply_to'] = email

        result = resend.Emails.send(payload)
        email_id = result.get('id') if isinstance(result, dict) else None
        return jsonify({'ok': True, 'emailed': True, 'id': email_id})
    except Exception as exc:
        return jsonify({'ok': True, 'emailed': False, 'error': str(exc)}), 200


SYSTEM_PROMPT = """You are a helpful assistant for Dr Henry's Skin Clinic in Bilaspur, Chhattisgarh.
IMPORTANT DISCLAIMER — always remember and state when relevant:
This chatbot does NOT give medical advice, diagnosis, or prescriptions. It cannot replace a doctor visit.

RULES:
1. DO NOT provide any medical treatment recommendations
2. DO NOT prescribe any medications or suggest prescriptions
3. DO NOT diagnose any medical conditions
4. DO NOT use any special characters, emojis, or symbols like dashes, asterisks, bullets in your responses
5. ONLY provide general information about:
   - Clinic services and treatments we offer: dermatology consultation (1 visit as needed), dermoscopy, acne (4 to 6 visits over 3 to 6 months), melasma and pigmentation (6 to 8 sessions), acne scars, laser hair reduction (6 to 8 sessions plus yearly top up), tattoo removal, carbon facial, chemical peels, glutathione, Botox, fillers, thread lift, PRP or GFC for hair, FUE hair transplant, mole wart and skin tag removal, cyst and lipoma excision, nail surgery, vitiligo grafting, and confidential infection and STD care. Always say the exact plan is confirmed after consultation.
   - Clinic timings: Monday to Saturday, 9:00 AM to 7:00 PM. Sunday closed.
   - Clinic name: Dr Henry's Skin Clinic
   - Location: Usha Memorial Skin and Eye Hospital, Ware House Rd, near Sheafer School, Sindhi Colony, Bilaspur, Chhattisgarh 495001
   - How to book appointments (call or WhatsApp +91 97700 48965)
   - General non-medical skin care tips
6. If someone asks about treatment or prescription, always redirect them to visit the clinic or call for proper consultation
7. If someone asks about timing, ALWAYS say: Monday to Saturday, 9:00 AM to 7:00 PM. Sunday closed.
Be friendly and professional.
When responding:
- Keep paragraphs short and readable
- Use simple plain text only
- Use numbers followed by dots for lists (1. 2. 3.)
- Do not use any markdown or special formatting"""


def _log_available_models():
    """Helps debugging a 'model not found' error: prints the models this key can use."""
    try:
        r = httpx.get(AI_BASE_URL + '/models',
                      headers={'Authorization': 'Bearer ' + AI_KEY}, timeout=10)
        ids = [m.get('id') for m in r.json().get('data', [])]
        app.logger.error('Models available to this key: %s', ', '.join(ids))
        app.logger.error('Set one in .env as AI_MODEL=<id>')
    except Exception as exc:
        app.logger.error('Could not list models: %s', exc)


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = (data.get('message') or '').strip()
    if not user_message:
        return jsonify({'response': 'Please type your question.'}), 400
    system_prompt = SYSTEM_PROMPT + (
        "\nLANGUAGE: Reply in the language the visitor writes in (English, Hindi in Devanagari, or Hinglish). "
        "If the visitor writes in Hindi, translate the standard timing and booking lines into Hindi too."
    )
    if data.get('lang') == 'hi':
        system_prompt += " The visitor is using the Hindi version of the website, so default to simple Hindi (Devanagari) unless they write in English."

    fallback = ("Sorry, the assistant is not available right now. "
                "Please call or WhatsApp the clinic on +91 97700 48965.")

    if not AI_KEY:
        app.logger.error('No AI key found. Add XAI_API_KEY=... to .env and restart the server.')
        return jsonify({'response': fallback}), 502

    payload = {
        'model': AI_MODEL,
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_message},
        ],
        'temperature': 0.7,
        'max_tokens': 1500 if AI_PROVIDER == 'groq' else 700,
    }
    if AI_PROVIDER == 'groq':
        payload['reasoning_effort'] = 'low'

    status = None
    try:
        resp = httpx.post(
            AI_BASE_URL + '/chat/completions',
            headers={'Authorization': 'Bearer ' + AI_KEY, 'Content-Type': 'application/json'},
            json=payload, timeout=45,
        )
        status = resp.status_code
        if status != 200:
            raise RuntimeError(resp.text[:300])
        bot_response = ((resp.json()['choices'][0]['message'].get('content')) or '').strip()
        if not bot_response:
            raise ValueError('Model returned an empty reply')
        return jsonify({'response': bot_response})
    except Exception as exc:
        hint = ''
        if status in (401, 403):
            hint = ' -> API key rejected. Create a new key and update .env (then restart the server)'
        elif status == 429:
            hint = ' -> Rate limit / no credits on this account. Check usage and billing in the provider dashboard'
        elif status in (400, 404):
            hint = ' -> Model name rejected'
            _log_available_models()
        app.logger.error('Chatbot error [%s] (%s, model=%s) %s: %s%s',
                         status, AI_PROVIDER, AI_MODEL, type(exc).__name__, exc, hint)
        return jsonify({'response': fallback}), 502


if __name__ == '__main__':
    app.run(debug=True)