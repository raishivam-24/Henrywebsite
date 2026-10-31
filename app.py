from flask import Flask, render_template, request, jsonify, send_from_directory, abort
import httpx
from dotenv import load_dotenv
import os
import resend
from urllib.parse import quote

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

TREATMENTS = {
    'dermatology-consultation': {
        'slug': 'dermatology-consultation',
        'title': 'Dermatology Consultation',
        'summary': 'A full skin evaluation and personalised plan for your concern.',
        'what': 'The doctor examines your skin, reviews history and medicines, and explains diagnosis options. You leave with a clear next step — medical treatment, procedure, or follow-up.',
        'sessions': 'Usually 1 visit; follow-ups as needed',
        'downtime': 'None',
        'cost': 'Confirmed at clinic after assessment',
        'doctor': 'Any of our dermatologists, based on your concern',
    },
    'dermoscopic-evaluation': {
        'slug': 'dermoscopic-evaluation',
        'title': 'Dermoscopic Evaluation',
        'summary': 'Close-up skin analysis to guide diagnosis and your home routine.',
        'what': 'Dermoscopy helps the doctor look at pigment, vessels and surface patterns that are hard to see with the naked eye. Useful for moles, melasma, acne and hair conditions.',
        'sessions': 'Often part of the first consultation',
        'downtime': 'None',
        'cost': 'Included or quoted with consultation',
        'doctor': 'Clinic dermatologists',
    },
    'dermato-surgery': {
        'slug': 'dermato-surgery',
        'title': 'Dermato-Surgery',
        'summary': 'Removal of lipoma, cyst, mole, skin tag, nail procedures, acne-scar and vitiligo surgeries.',
        'what': 'Day-care procedures under local anaesthesia when suitable. The team explains preparation, aftercare and expected healing before you decide.',
        'sessions': 'Often 1 procedure + dressing follow-ups',
        'downtime': 'A few days to 1–2 weeks, depending on site',
        'cost': 'Quoted after examination',
        'doctor': 'Primarily Dr. Dennis Henry (dermato-surgeon)',
    },
    'laser-treatments': {
        'slug': 'laser-treatments',
        'title': 'Laser Treatments',
        'summary': 'Laser care for melasma, pigmentation, rejuvenation and tattoo removal.',
        'what': 'A test patch or assessment comes first. Sessions are spaced for safety. Results vary by skin type and the condition being treated.',
        'sessions': 'Typically a course of sessions (plan after assessment)',
        'downtime': 'Mild redness for hours to a few days',
        'cost': 'Starting price quoted at consultation',
        'doctor': 'Dr. Dennis Henry and trained laser team',
    },
    'aesthetics': {
        'slug': 'aesthetics',
        'title': 'Aesthetics',
        'summary': 'Botox, threads, fillers and non-surgical skin tightening.',
        'what': 'Cosmetic injectables and devices are planned after facial assessment. We discuss goals, risks and realistic outcomes before any treatment.',
        'sessions': '1 session; maintenance as advised',
        'downtime': 'Usually minimal (hours to 1–2 days)',
        'cost': 'Quoted per area / product',
        'doctor': 'Dr. Dennis Henry',
    },
    'medi-spa': {
        'slug': 'medi-spa',
        'title': 'Medi-Spa',
        'summary': 'Chemical peels, skin polish, light treatments and related facials.',
        'what': 'Medical-grade peels and facials chosen for your skin type. Not the same as a beauty parlour facial — medical supervision guides the strength and aftercare.',
        'sessions': 'Single or a short series',
        'downtime': 'Mild peeling for peels (a few days)',
        'cost': 'Quoted by treatment type',
        'doctor': 'Clinic doctors and supervised staff',
    },
    'hair-treatment': {
        'slug': 'hair-treatment',
        'title': 'Hair Treatment',
        'summary': 'Hair-loss consultation, PRP, exosomes, stem cells, rejuvenation and transplant counselling.',
        'what': 'We start with diagnosis (pattern, medical causes). Procedures like PRP or transplant are suggested only when suitable. Transplant counselling includes realistic density expectations.',
        'sessions': 'Medical plan varies; PRP often a short course',
        'downtime': 'Depends on procedure (PRP: short; transplant: longer)',
        'cost': 'Quoted after hair analysis',
        'doctor': 'Clinic dermatologists',
    },
    'laser-hair-reduction': {
        'slug': 'laser-hair-reduction',
        'title': 'Laser Hair Reduction',
        'summary': 'Laser hair reduction for suitable skin types, planned over multiple sessions.',
        'what': 'A course of sessions targets hair follicles. Results build gradually. Shaving and sun-care instructions are given before and after each visit.',
        'sessions': 'Usually 6–8+ sessions, area-dependent',
        'downtime': 'Mild redness for a few hours',
        'cost': 'Package pricing after area assessment',
        'doctor': 'Trained laser team under doctor supervision',
    },
    'infection-std-care': {
        'slug': 'infection-std-care',
        'title': 'Infection & STD Care',
        'summary': 'Confidential care for skin infections and sexually transmitted diseases.',
        'what': 'Private consultation, examination and appropriate tests or medicines when indicated. Partner advice may be discussed. Everything stays confidential.',
        'sessions': 'As clinically required',
        'downtime': 'None for consultation',
        'cost': 'Consultation + any labs/medicines',
        'doctor': 'Dr. Daniel Henry and clinic dermatologists',
    },
}

for _slug, _t in TREATMENTS.items():
    _t['wa_text'] = quote(
        f"Hello, I would like to know more about {_t['title']} at Dr Henry's Skin Clinic."
    )


# ---------------------------------------------------------------------------
# BEFORE / AFTER RESULTS — leave EMPTY until you have photos with the patient's WRITTEN
# consent. While the list is empty, no results section is shown on the website.
# To add a result: save two WebP images (each under 200 KB, same angle and lighting) in
# static/img/results/ and add an entry like this:
#   {
#       "title": "Melasma — 4 laser sessions",
#       "title_hi": "झाइयाँ — 4 लेज़र सत्र",
#       "before": "/static/img/results/melasma-1-before.webp",
#       "after":  "/static/img/results/melasma-1-after.webp",
#       "alt": "Cheek skin before and after laser treatment for melasma",
#   },
# ---------------------------------------------------------------------------
BEFORE_AFTER = []


@app.route('/')
def home():
    return render_template('index.html', before_after=BEFORE_AFTER)


# ---------------------------------------------------------------------------
# PRICES — fill these in with the clinic's REAL figures. Leave a value as "" and the
# page keeps showing the "quoted at consultation" wording instead.
#   "from"  : starting price in rupees, e.g. 500           (number or "")
#   "to"    : upper end in rupees, e.g. 1500                (number or "")
#   "unit"  : what the price is for, e.g. "per session", "per area", "per consultation"
#   "unit_hi": the same in Hindi, e.g. "प्रति सत्र", "प्रति क्षेत्र", "प्रति परामर्श"
# Example:  "laser-treatments": {"from": 2500, "to": 6000, "unit": "per session", "unit_hi": "प्रति सत्र"},
# ---------------------------------------------------------------------------
TREATMENT_PRICES = {
    "dermatology-consultation": {"from": "", "to": "", "unit": "per consultation", "unit_hi": "प्रति परामर्श"},
    "dermoscopic-evaluation":   {"from": "", "to": "", "unit": "per evaluation", "unit_hi": "प्रति जाँच"},
    "dermato-surgery":          {"from": "", "to": "", "unit": "per procedure", "unit_hi": "प्रति प्रक्रिया"},
    "laser-treatments":         {"from": "", "to": "", "unit": "per session", "unit_hi": "प्रति सत्र"},
    "aesthetics":               {"from": "", "to": "", "unit": "per area", "unit_hi": "प्रति क्षेत्र"},
    "medi-spa":                 {"from": "", "to": "", "unit": "per session", "unit_hi": "प्रति सत्र"},
    "hair-treatment":           {"from": "", "to": "", "unit": "per session", "unit_hi": "प्रति सत्र"},
    "laser-hair-reduction":     {"from": "", "to": "", "unit": "per session", "unit_hi": "प्रति सत्र"},
    "infection-std-care":       {"from": "", "to": "", "unit": "per consultation", "unit_hi": "प्रति परामर्श"},
}


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


TREATMENTS_HI = {
    "dermatology-consultation": {
        "title": "त्वचा रोग परामर्श",
        "summary": "आपकी समस्या के लिए त्वचा की पूरी जाँच और व्यक्तिगत उपचार योजना।",
        "what": "डॉक्टर आपकी त्वचा की जाँच करते हैं, आपका इतिहास और दवाइयाँ देखते हैं और निदान के विकल्प समझाते हैं। आप स्पष्ट अगले कदम के साथ जाते हैं — दवा से उपचार, प्रक्रिया या फ़ॉलो-अप।",
        "sessions": "आमतौर पर 1 विज़िट; ज़रूरत पड़ने पर फ़ॉलो-अप",
        "downtime": "कोई नहीं",
        "cost": "जाँच के बाद क्लिनिक में बताया जाएगा",
        "doctor": "आपकी समस्या के अनुसार हमारा कोई भी त्वचा रोग विशेषज्ञ"
    },
    "dermoscopic-evaluation": {
        "title": "डर्मोस्कोपिक जाँच",
        "summary": "निदान और आपकी घरेलू देखभाल को दिशा देने के लिए त्वचा का नज़दीकी विश्लेषण।",
        "what": "डर्मोस्कोपी से डॉक्टर पिगमेंट, रक्त नलिकाओं और सतह के उन पैटर्न को देख पाते हैं जो आँखों से नहीं दिखते। तिल, झाइयों, मुँहासों और बालों की समस्याओं में उपयोगी।",
        "sessions": "अक्सर पहले परामर्श का हिस्सा",
        "downtime": "कोई नहीं",
        "cost": "परामर्श में शामिल या उसके साथ बताया जाता है",
        "doctor": "क्लिनिक के त्वचा रोग विशेषज्ञ"
    },
    "dermato-surgery": {
        "title": "डर्मेटो-सर्जरी",
        "summary": "लिपोमा, सिस्ट, तिल, स्किन टैग, नाखून की प्रक्रियाएँ, मुँहासों के निशान और सफ़ेद दाग़ (विटिलिगो) की सर्जरी।",
        "what": "उपयुक्त होने पर लोकल एनेस्थीसिया में डे-केयर प्रक्रियाएँ। आपके निर्णय से पहले टीम तैयारी, देखभाल और ठीक होने की अपेक्षित अवधि समझाती है।",
        "sessions": "अक्सर 1 प्रक्रिया + ड्रेसिंग के लिए फ़ॉलो-अप",
        "downtime": "जगह के अनुसार कुछ दिन से 1–2 सप्ताह",
        "cost": "जाँच के बाद बताया जाएगा",
        "doctor": "मुख्यतः डॉ. डेनिस हेनरी (डर्मेटो-सर्जन)"
    },
    "laser-treatments": {
        "title": "लेज़र उपचार",
        "summary": "झाइयों, पिगमेंटेशन, त्वचा पुनर्जीवन और टैटू हटाने के लिए लेज़र देखभाल।",
        "what": "पहले टेस्ट पैच या जाँच की जाती है। सुरक्षा के लिए सत्रों के बीच अंतर रखा जाता है। नतीजे त्वचा के प्रकार और इलाज की जा रही समस्या पर निर्भर करते हैं।",
        "sessions": "आमतौर पर कई सत्रों का कोर्स (जाँच के बाद योजना)",
        "downtime": "कुछ घंटों से कुछ दिनों तक हल्की लालिमा",
        "cost": "शुरुआती कीमत परामर्श में बताई जाती है",
        "doctor": "डॉ. डेनिस हेनरी और प्रशिक्षित लेज़र टीम"
    },
    "aesthetics": {
        "title": "एस्थेटिक्स",
        "summary": "बोटॉक्स, थ्रेड्स, फ़िलर्स और बिना सर्जरी त्वचा कसाव।",
        "what": "चेहरे की जाँच के बाद कॉस्मेटिक इंजेक्टेबल्स और उपकरणों की योजना बनाई जाती है। इलाज से पहले हम आपके लक्ष्य, जोखिम और यथार्थवादी नतीजों पर चर्चा करते हैं।",
        "sessions": "1 सत्र; सलाह के अनुसार रखरखाव",
        "downtime": "आमतौर पर बहुत कम (कुछ घंटे से 1–2 दिन)",
        "cost": "प्रति क्षेत्र / उत्पाद के अनुसार बताया जाता है",
        "doctor": "डॉ. डेनिस हेनरी"
    },
    "medi-spa": {
        "title": "मेडी-स्पा",
        "summary": "केमिकल पील्स, स्किन पॉलिश, लाइट ट्रीटमेंट और संबंधित फ़ेशियल।",
        "what": "आपकी त्वचा के प्रकार के अनुसार चुने गए मेडिकल-ग्रेड पील्स और फ़ेशियल। यह ब्यूटी पार्लर के फ़ेशियल जैसा नहीं है — पील की तीव्रता और देखभाल डॉक्टर की निगरानी में तय होती है।",
        "sessions": "एक सत्र या कुछ सत्रों की छोटी शृंखला",
        "downtime": "पील्स में हल्की परत उतरना (कुछ दिन)",
        "cost": "उपचार के प्रकार के अनुसार बताया जाता है",
        "doctor": "क्लिनिक के डॉक्टर और निगरानी में प्रशिक्षित स्टाफ़"
    },
    "hair-treatment": {
        "title": "बालों का उपचार",
        "summary": "बाल झड़ने का परामर्श, PRP, एक्सोसोम्स, स्टेम सेल, पुनर्जीवन और हेयर ट्रांसप्लांट काउंसलिंग।",
        "what": "हम निदान से शुरू करते हैं (पैटर्न, चिकित्सकीय कारण)। PRP या ट्रांसप्लांट जैसी प्रक्रियाएँ केवल उपयुक्त होने पर सुझाई जाती हैं। ट्रांसप्लांट काउंसलिंग में बालों के घनत्व को लेकर यथार्थवादी अपेक्षाएँ बताई जाती हैं।",
        "sessions": "चिकित्सकीय योजना अलग-अलग होती है; PRP अक्सर छोटा कोर्स",
        "downtime": "प्रक्रिया पर निर्भर (PRP: कम; ट्रांसप्लांट: अधिक)",
        "cost": "बालों की जाँच के बाद बताया जाएगा",
        "doctor": "क्लिनिक के त्वचा रोग विशेषज्ञ"
    },
    "laser-hair-reduction": {
        "title": "लेज़र हेयर रिडक्शन",
        "summary": "उपयुक्त त्वचा प्रकारों के लिए लेज़र हेयर रिडक्शन, कई सत्रों में नियोजित।",
        "what": "सत्रों का एक कोर्स बालों की जड़ों (फ़ॉलिकल) पर काम करता है। नतीजे धीरे-धीरे दिखते हैं। हर विज़िट से पहले और बाद में शेविंग और धूप से बचाव के निर्देश दिए जाते हैं।",
        "sessions": "आमतौर पर 6–8+ सत्र, क्षेत्र के अनुसार",
        "downtime": "कुछ घंटों के लिए हल्की लालिमा",
        "cost": "क्षेत्र की जाँच के बाद पैकेज मूल्य",
        "doctor": "डॉक्टर की निगरानी में प्रशिक्षित लेज़र टीम"
    },
    "infection-std-care": {
        "title": "संक्रमण एवं यौन रोग देखभाल",
        "summary": "त्वचा संक्रमण और यौन संचारित रोगों के लिए गोपनीय देखभाल।",
        "what": "निजी परामर्श, जाँच और ज़रूरत होने पर उचित परीक्षण या दवाइयाँ। साथी के लिए सलाह पर चर्चा हो सकती है। सब कुछ गोपनीय रखा जाता है।",
        "sessions": "चिकित्सकीय आवश्यकता के अनुसार",
        "downtime": "परामर्श के लिए कोई नहीं",
        "cost": "परामर्श + आवश्यक लैब जाँच/दवाइयाँ",
        "doctor": "डॉ. डैनियल हेनरी और क्लिनिक के त्वचा रोग विशेषज्ञ"
    }
}


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
    return render_template('treatment.html', treatment=treatment, hi=hi, has_price=bool(price))


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
   - Clinic services and treatments we offer
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