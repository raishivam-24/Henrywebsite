from flask import Flask, render_template, request, jsonify, send_from_directory
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_url_path='/static')

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/robots.txt')
def robots():
    return send_from_directory('.', 'robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('.', 'sitemap.xml')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": """You are a helpful assistant for Dr Henry's Skin Clinic in Bilaspur, Chhattisgarh.
IMPORTANT RULES:
1. DO NOT provide any medical treatment recommendations
2. DO NOT prescribe any medications or suggest prescriptions
3. DO NOT diagnose any medical conditions
4. DO NOT use any special characters, emojis, or symbols like dashes, asterisks, bullets in your responses
5. ONLY provide general information about:
   - Clinic services and treatments we offer
   - Clinic timings: Monday to Saturday, 9:00 AM to 7:00 PM
   - Clinic location: 1st Floor, Usha Memorial Skin & Eye Hospital, Ware House Rd, near Sheafer School, Sindhi Colony, Bilaspur, Chhattisgarh 495001
   - How to book appointments
   - General skin care tips (non-medical)
6. If someone asks about treatment or prescription, always redirect them to visit the clinic or call for proper consultation
7. If someone asks about timing, ALWAYS say: Monday to Saturday, 9:00 AM to 7:00 PM
Be friendly and professional.
When responding:
- Keep paragraphs short and readable
- Use simple plain text only
- Use numbers followed by dots for lists (1. 2. 3.)
- Do not use any markdown or special formatting"""},
            {"role": "user", "content": user_message}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    bot_response = response.choices[0].message.content
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
