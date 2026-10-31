from flask import Flask, render_template, request, jsonify, send_from_directory, abort
from groq import Groq
from dotenv import load_dotenv
import os
import resend
from urllib.parse import quote

load_dotenv()

app = Flask(__name__, static_url_path='/static')

client = Groq(api_key=os.getenv('GROQ_API_KEY'))
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


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/treatments/<slug>')
def treatment_page(slug):
    treatment = TREATMENTS.get(slug)
    if not treatment:
        abort(404)
    return render_template('treatment.html', treatment=treatment)


@app.route('/robots.txt')
def robots():
    return send_from_directory('.', 'robots.txt')


@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('.', 'sitemap.xml')


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


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = (data.get('message') or '').strip()
    if not user_message:
        return jsonify({'response': 'Please type your question.'}), 400

    fallback = ("Sorry, the assistant is not available right now. "
                "Please call or WhatsApp the clinic on +91 97700 48965.")

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": """You are a helpful assistant for Dr Henry's Skin Clinic in Bilaspur, Chhattisgarh.
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
- Do not use any markdown or special formatting"""},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            # gpt-oss is a reasoning model: leave room for thinking + the answer
            max_tokens=1500,
            extra_body={"reasoning_effort": "low"}
        )
        bot_response = (response.choices[0].message.content or '').strip()
        if not bot_response:
            raise ValueError('Model returned an empty reply')
        return jsonify({'response': bot_response})
    except Exception as exc:
        status = getattr(exc, 'status_code', None)
        hint = ''
        if status == 401:
            hint = ' -> GROQ_API_KEY is invalid/expired. Create a new key at console.groq.com/keys and update .env'
        elif status == 429:
            hint = ' -> Groq rate limit / quota reached. Wait a bit or check your Groq usage limits'
        elif status in (400, 404):
            hint = ' -> Request or model name rejected by Groq (check the model name)'
        app.logger.error('Chatbot error [%s] %s: %s%s', status, type(exc).__name__, exc, hint)
        return jsonify({'response': fallback}), 502


if __name__ == '__main__':
    app.run(debug=True)