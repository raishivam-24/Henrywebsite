(function () {
    var CLINIC_PHONE = '919770048965';
    var CLINIC_EMAIL = 'drhenrysdermatology@gmail.com';
    var MAPS_URL = 'https://maps.app.goo.gl/sek2LjWRsRHCm6aL8';

    var dict = {
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.doctors': 'Our Doctors',
            'nav.awards': 'Awards',
            'nav.services': 'Services',
            'nav.gallery': 'Gallery',
            'nav.reviews': 'Reviews',
            'nav.faq': 'FAQ',
            'nav.bot': 'AI Bot',
            'nav.contact': 'Contact',
            'hero.badge': 'ISO 9001:2015 Certified Clinic',
            'hero.lead': 'Trusted dermatology care in Bilaspur since 2000.',
            'hero.sub': 'Advanced skin, laser, hair and aesthetic treatments at Usha Memorial Skin & Eye Hospital, Ware House Rd, Sindhi Colony.',
            'cta.book': 'Book Appointment',
            'cta.services': 'Our Services',
            'cta.whatsapp': 'WhatsApp',
            'cta.reviews': 'See Google reviews',
            'doctors.title': 'Meet Our Doctors',
            'doctors.sub': 'A family team of dermatologists with local and international training.',
            'reviews.title': 'What patients say on Google',
            'reviews.sub': 'Real reviews from Google Maps for Dr Henry\'s Skin Clinic.',
            'reviews.based': 'Based on 232 Google reviews',
            'reviews.open': 'Read all reviews on Google',
            'book.title': 'Book an Appointment',
            'book.sub': 'Send your request on WhatsApp and email in one step. We will confirm your slot.',
            'book.name': 'Full name',
            'book.phone': 'Phone number',
            'book.email': 'Your email (optional)',
            'book.concern': 'Concern',
            'book.day': 'Preferred day',
            'book.note': 'Message (optional)',
            'book.send': 'Send on WhatsApp & Email',
            'book.call': 'Call clinic',
            'book.success': 'Sending your request on WhatsApp and email…',
            'book.email_ok': 'Email sent to the clinic. WhatsApp is opening…',
            'book.email_fail': 'WhatsApp is opening. Email could not be sent automatically — use the email draft if it opens.',
            'faq.title': 'Frequently Asked Questions',
            'contact.title': 'Contact Us',
            'gallery.title': 'Clinic Gallery',
            'services.title': 'Our Services',
            'about.welcome': 'Welcome to Dr Henry\'s Skin Clinic'
        },
        hi: {
            'nav.home': 'होम',
            'nav.about': 'हमारे बारे में',
            'nav.doctors': 'डॉक्टर',
            'nav.awards': 'पुरस्कार',
            'nav.services': 'सेवाएँ',
            'nav.gallery': 'गैलरी',
            'nav.reviews': 'समीक्षाएँ',
            'nav.faq': 'प्रश्न',
            'nav.bot': 'एआई बॉट',
            'nav.contact': 'संपर्क',
            'hero.badge': 'ISO 9001:2015 प्रमाणित क्लिनिक',
            'hero.lead': 'बिलासपुर में भरोसेमंद त्वचा चिकित्सा — 2000 से।',
            'hero.sub': 'उषा मेमोरियल स्किन एंड आई हॉस्पिटल, वेयर हाउस रोड, सिंधी कॉलोनी में उन्नत त्वचा, लेज़र, बाल और एस्थेटिक उपचार।',
            'cta.book': 'अपॉइंटमेंट बुक करें',
            'cta.services': 'हमारी सेवाएँ',
            'cta.whatsapp': 'व्हाट्सएप',
            'cta.reviews': 'गूगल समीक्षाएँ देखें',
            'doctors.title': 'हमारे डॉक्टर',
            'doctors.sub': 'स्थानीय और अंतरराष्ट्रीय प्रशिक्षण वाले त्वचा विशेषज्ञों की टीम।',
            'reviews.title': 'मरीज़ गूगल पर क्या कहते हैं',
            'reviews.sub': 'डॉ हेनरी स्किन क्लिनिक की गूगल मैप्स से वास्तविक समीक्षाएँ।',
            'reviews.based': '२३२ गूगल समीक्षाओं पर आधारित',
            'reviews.open': 'गूगल पर सभी समीक्षाएँ पढ़ें',
            'book.title': 'अपॉइंटमेंट बुक करें',
            'book.sub': 'एक कदम में व्हाट्सएप और ईमेल पर अनुरोध भेजें। हम स्लॉट की पुष्टि करेंगे।',
            'book.name': 'पूरा नाम',
            'book.phone': 'फ़ोन नंबर',
            'book.email': 'आपका ईमेल (वैकल्पिक)',
            'book.concern': 'समस्या',
            'book.day': 'पसंदीदा दिन',
            'book.note': 'संदेश (वैकल्पिक)',
            'book.send': 'व्हाट्सएप और ईमेल भेजें',
            'book.call': 'क्लिनिक कॉल करें',
            'book.success': 'व्हाट्सएप और ईमेल पर अनुरोध भेजा जा रहा है…',
            'book.email_ok': 'क्लिनिक को ईमेल भेज दी गई। व्हाट्सएप खुल रहा है…',
            'book.email_fail': 'व्हाट्सएप खुल रहा है। स्वचालित ईमेल नहीं भेजी जा सकी।',
            'faq.title': 'अक्सर पूछे जाने वाले प्रश्न',
            'contact.title': 'संपर्क करें',
            'gallery.title': 'क्लिनिक गैलरी',
            'services.title': 'हमारी सेवाएँ',
            'about.welcome': 'डॉ हेनरी स्किन क्लिनिक में आपका स्वागत है'
        }
    };

    // Hindi translations for every other text block on the page, matched by exact English text.
    // (Review quotes, doctor names and degrees are intentionally left as written.)
    var hiPhrases = {
        "All services": "सभी सेवाएँ",
        "What it involves": "इसमें क्या होता है",
        "Sessions": "सत्र",
        "Downtime": "डाउनटाइम (ठीक होने का समय)",
        "Rough cost": "अनुमानित खर्च",
        "Cost": "खर्च",
        "Patient Results": "मरीज़ों के नतीजे",
        "Shared with each patient's written consent. Results vary from person to person.": "हर मरीज़ की लिखित सहमति से साझा किया गया। नतीजे हर व्यक्ति में अलग-अलग होते हैं।",
        "Before": "पहले",
        "After": "बाद में",
        "Who typically sees you": "आपको कौन देखेगा",
        "Ask on WhatsApp": "व्हाट्सएप पर पूछें",
        "Exact plan, number of sessions and fee are confirmed after an in-person consultation. This page is general information only — not medical advice.": "सटीक योजना, सत्रों की संख्या और शुल्क आमने-सामने परामर्श के बाद तय होते हैं। यह पेज केवल सामान्य जानकारी है — चिकित्सकीय सलाह नहीं।",
        "© 2026 Dr Henry's Skin Clinic · Ware House Rd, Sindhi Colony, Bilaspur": "© 2026 डॉ हेनरी स्किन क्लिनिक · वेयर हाउस रोड, सिंधी कॉलोनी, बिलासपुर",
        "Dr Henry's Skin Clinic": "डॉ हेनरी स्किन क्लिनिक",
        "Dr Henry's": "डॉ हेनरी का",
        "Skin Clinic": "स्किन क्लिनिक",
        "Trusted since": "भरोसे का सफ़र",
        "2000": "2000 से",
        "Skin, laser and aesthetic care for families across Bilaspur and Chhattisgarh.": "बिलासपुर और छत्तीसगढ़ के परिवारों के लिए त्वचा, लेज़र और एस्थेटिक देखभाल।",
        "At Usha Memorial Skin & Eye Hospital": "उषा मेमोरियल स्किन एंड आई हॉस्पिटल में",
        "Ware House Rd, Sindhi Colony, Bilaspur": "वेयर हाउस रोड, सिंधी कॉलोनी, बिलासपुर",
        "Welcome to": "आपका स्वागत है:",
        "Located at Usha Memorial Skin & Eye Hospital, Ware House Rd, near Sheafer School, Sindhi Colony, Bilaspur, Chhattisgarh 495001.": "उषा मेमोरियल स्किन एंड आई हॉस्पिटल, वेयर हाउस रोड, शेफ़र स्कूल के पास, सिंधी कॉलोनी, बिलासपुर, छत्तीसगढ़ 495001।",
        "Excellence in Skin Care": "त्वचा देखभाल में उत्कृष्टता",
        "Dr Henry's Skin Clinic offers comprehensive dermatology and cosmetology care in Bilaspur. Our facility combines modern equipment with experienced doctors to deliver personalised treatment plans.": "डॉ हेनरी स्किन क्लिनिक बिलासपुर में त्वचा रोग और कॉस्मेटोलॉजी की संपूर्ण देखभाल उपलब्ध कराता है। हमारी सुविधा आधुनिक उपकरणों और अनुभवी डॉक्टरों को जोड़कर हर मरीज़ के लिए व्यक्तिगत उपचार योजना देती है।",
        "From routine skin consultations to laser treatments, dermato-surgery and aesthetic procedures, we cover the full range of dermatological care for patients across Chhattisgarh.": "सामान्य त्वचा परामर्श से लेकर लेज़र उपचार, डर्मेटो-सर्जरी और एस्थेटिक प्रक्रियाओं तक, हम छत्तीसगढ़ भर के मरीज़ों को त्वचा रोग की पूरी देखभाल देते हैं।",
        "ISO Certified": "ISO प्रमाणित",
        "Expert Doctors": "विशेषज्ञ डॉक्टर",
        "Modern Equipment": "आधुनिक उपकरण",
        "Patient Care": "मरीज़ देखभाल",
        "Our Doctors": "हमारे डॉक्टर",
        "Experienced": "अनुभवी",
        "Dermatologists": "त्वचा रोग विशेषज्ञ",
        "Serving Bilaspur": "बिलासपुर की सेवा में",
        "Dr. David Henry": "डॉ. डेविड हेनरी",
        "(MBBS, DVD, MPH (USA)) — senior dermatologist with decades of clinical experience in Bilaspur.": "(MBBS, DVD, MPH (USA)) — बिलासपुर में दशकों के नैदानिक अनुभव वाले वरिष्ठ त्वचा रोग विशेषज्ञ।",
        "Dr. Daniel Henry": "डॉ. डैनियल हेनरी",
        "(MBBS, MD, FAAD, MRCP) — President, Bilaspur Society of Dermatology. Experienced in infections, melasma, acne and sexually transmitted diseases.": "(MBBS, MD, FAAD, MRCP) — अध्यक्ष, बिलासपुर सोसाइटी ऑफ डर्मेटोलॉजी। संक्रमण, झाइयों (मेलाज़्मा), मुँहासों और यौन संचारित रोगों में अनुभवी।",
        "Dr. Dennis Henry": "डॉ. डेनिस हेनरी",
        "(MD (DVL), DNB (DVL), FAAD (USA), MRCP (London), MNAMS) — dermato-surgeon, cosmetologist and aesthetician; Secretary Elect, Bilaspur Society of Dermatology.": "(MD (DVL), DNB (DVL), FAAD (USA), MRCP (London), MNAMS) — डर्मेटो-सर्जन, कॉस्मेटोलॉजिस्ट और एस्थेटिशियन; सेक्रेटरी इलेक्ट, बिलासपुर सोसाइटी ऑफ डर्मेटोलॉजी।",
        "International Degrees": "अंतरराष्ट्रीय डिग्रियाँ",
        "FAAD (USA), MRCP (London)": "FAAD (USA), MRCP (London)",
        "Trusted since 2000": "2000 से भरोसेमंद",
        "Serving Bilaspur families": "बिलासपुर के परिवारों की सेवा में",
        "Book Consultation": "परामर्श बुक करें",
        "Watch Our": "हमारा परिचय",
        "Introduction": "देखें",
        "Clinic introduction video (Hindi)": "क्लिनिक परिचय वीडियो (हिंदी)",
        "Senior Dermatologist": "वरिष्ठ त्वचा रोग विशेषज्ञ",
        "MBBS | DVD | MPH (USA)": "MBBS | DVD | MPH (USA)",
        "Senior dermatologist with extensive experience treating complex skin conditions in Bilaspur.": "बिलासपुर में जटिल त्वचा रोगों के इलाज का व्यापक अनुभव रखने वाले वरिष्ठ त्वचा रोग विशेषज्ञ।",
        "Infections & STD Specialist": "संक्रमण एवं यौन रोग विशेषज्ञ",
        "MBBS | MD | FAAD | MRCP": "MBBS | MD | FAAD | MRCP",
        "President, Bilaspur Society of Dermatology. Expert in infections, melasma, acne and STDs.": "अध्यक्ष, बिलासपुर सोसाइटी ऑफ डर्मेटोलॉजी। संक्रमण, झाइयों, मुँहासों और यौन रोगों के विशेषज्ञ।",
        "Dermato-Surgeon": "डर्मेटो-सर्जन",
        "MD | DNB | MRCP | FAAD | MNAMS": "MD | DNB | MRCP | FAAD | MNAMS",
        "Dermato-surgeon, cosmetologist and aesthetician. Secretary Elect, Bilaspur Society of Dermatology.": "डर्मेटो-सर्जन, कॉस्मेटोलॉजिस्ट और एस्थेटिशियन। सेक्रेटरी इलेक्ट, बिलासपुर सोसाइटी ऑफ डर्मेटोलॉजी।",
        "Awards": "पुरस्कार",
        "Professional Milestones": "पेशेवर उपलब्धियाँ",
        "& Recognition": "एवं सम्मान",
        "Alongside clinical practice, Dr. Dennis Henry contributes to dermatology through education, conference faculty roles, authorship and association leadership.": "क्लिनिकल प्रैक्टिस के साथ-साथ डॉ. डेनिस हेनरी शिक्षा, सम्मेलनों में फैकल्टी भूमिका, लेखन और संस्थागत नेतृत्व के माध्यम से त्वचा रोग विज्ञान में योगदान देते हैं।",
        "Three World-Record Achievements": "तीन विश्व रिकॉर्ड उपलब्धियाँ",
        "Includes a Guinness World Records-related recognition or attempt. Official titles can be linked once verified.": "इसमें गिनीज़ वर्ल्ड रिकॉर्ड्स से जुड़ी एक मान्यता या प्रयास शामिल है। सत्यापन के बाद आधिकारिक शीर्षक जोड़े जा सकते हैं।",
        "MNAMS Recognition": "MNAMS सम्मान",
        "Awarded MNAMS, as shared by Dr. Henry.": "डॉ. हेनरी द्वारा बताए अनुसार MNAMS से सम्मानित।",
        "Young Dermatologist Award — 2025": "यंग डर्मेटोलॉजिस्ट अवॉर्ड — 2025",
        "State-level Young Dermatologist Award in 2025. First prize at CG Cuticon 2022.": "2025 में राज्य स्तरीय यंग डर्मेटोलॉजिस्ट अवॉर्ड। सीजी क्यूटिकॉन 2022 में प्रथम पुरस्कार।",
        "National & International Faculty": "राष्ट्रीय एवं अंतरराष्ट्रीय फैकल्टी",
        "Faculty at DERMACON, ACSI conference, and the Asian Dermatology Masterclass in Malaysia.": "DERMACON, ACSI सम्मेलन और मलेशिया में एशियन डर्मेटोलॉजी मास्टरक्लास में फैकल्टी।",
        "Laser Education & Training": "लेज़र शिक्षा एवं प्रशिक्षण",
        "Trained in Thailand and the USA. Laser trainer in Chhattisgarh.": "थाईलैंड और अमेरिका में प्रशिक्षित। छत्तीसगढ़ में लेज़र प्रशिक्षक।",
        "Professional Leadership": "पेशेवर नेतृत्व",
        "Roles in the Bilaspur Society of Dermatology and IADVL Chhattisgarh.": "बिलासपुर सोसाइटी ऑफ डर्मेटोलॉजी और IADVL छत्तीसगढ़ में पदभार।",
        "Author of": "लेखक:",
        ", available on Amazon.": ", अमेज़न पर उपलब्ध।",
        "Product Advisory": "उत्पाद सलाहकार",
        "Dermatology expertise for product advisory and formulation work.": "उत्पाद सलाह और फ़ॉर्मुलेशन कार्य के लिए त्वचा रोग विशेषज्ञता।",
        "International Recognition": "अंतरराष्ट्रीय सम्मान",
        "Selected for the Young Turk Award by Southeast Asian countries (December 2024), as reported by Dr. Henry.": "डॉ. हेनरी के अनुसार, दक्षिण-पूर्व एशियाई देशों द्वारा यंग टर्क अवॉर्ड के लिए चयनित (दिसंबर 2024)।",
        "Recent": "हालिया",
        "Update": "अपडेट",
        "New Achievement": "नई उपलब्धि",
        "Dr. Dennis Henry Appointed as": "डॉ. डेनिस हेनरी को",
        "Secretary Elect": "सेक्रेटरी इलेक्ट नियुक्त किया गया",
        "has been appointed": "को",
        "Secretary Elect of Bilaspur Society of Dermatology": "बिलासपुर सोसाइटी ऑफ डर्मेटोलॉजी का सेक्रेटरी इलेक्ट",
        ".": " नियुक्त किया गया है।",
        "Our": "हमारी",
        "Services": "सेवाएँ",
        "Dermatology and cosmetology under one roof. Tap a service for more detail.": "त्वचा रोग और कॉस्मेटोलॉजी एक ही छत के नीचे। अधिक जानकारी के लिए किसी सेवा पर टैप करें।",
        "Dermatology Consultation": "त्वचा रोग परामर्श",
        "Skin evaluation and personalised treatment plans.": "त्वचा की जाँच और व्यक्तिगत उपचार योजनाएँ।",
        "Dermoscopic Evaluation": "डर्मोस्कोपिक जाँच",
        "Advanced skin analysis with routine guidance.": "नियमित मार्गदर्शन के साथ उन्नत त्वचा विश्लेषण।",
        "Dermato-Surgery": "डर्मेटो-सर्जरी",
        "Lipoma, cyst, nail, mole, acne scar and vitiligo surgery.": "लिपोमा, सिस्ट, नाखून, तिल, मुँहासों के निशान और सफ़ेद दाग़ (विटिलिगो) की सर्जरी।",
        "Laser Treatments": "लेज़र उपचार",
        "Melasma, pigmentation, rejuvenation, tattoo removal.": "झाइयाँ, पिगमेंटेशन, त्वचा पुनर्जीवन और टैटू हटाना।",
        "Aesthetics": "एस्थेटिक्स",
        "Botox, threads, fillers, non-surgical tightening.": "बोटॉक्स, थ्रेड्स, फ़िलर्स और बिना सर्जरी त्वचा कसाव।",
        "Medi-Spa": "मेडी-स्पा",
        "Peels, polish, light treatments, glutathione therapy.": "पील्स, पॉलिश, लाइट ट्रीटमेंट और ग्लूटाथियोन थेरेपी।",
        "Hair Treatment": "बालों का उपचार",
        "PRP, exosomes, stem cells, rejuvenation, transplant.": "PRP, एक्सोसोम्स, स्टेम सेल, पुनर्जीवन और ट्रांसप्लांट।",
        "Laser Hair Reduction": "लेज़र हेयर रिडक्शन",
        "Safe laser hair reduction for all skin types.": "सभी त्वचा प्रकारों के लिए सुरक्षित लेज़र हेयर रिडक्शन।",
        "Infection & STD Care": "संक्रमण एवं यौन रोग देखभाल",
        "Confidential care for skin infections and STDs.": "त्वचा संक्रमण और यौन रोगों के लिए गोपनीय देखभाल।",
        "Gallery": "गैलरी",
        "Clinic": "क्लिनिक",
        "A look inside the clinic, our doctors and patient care moments.": "क्लिनिक, हमारे डॉक्टरों और मरीज़ देखभाल के पलों की एक झलक।",
        "Dermatology event": "त्वचा रोग कार्यक्रम",
        "Consultation room": "परामर्श कक्ष",
        "Treatment equipment": "उपचार उपकरण",
        "Clinic premises": "क्लिनिक परिसर",
        "Professional recognition": "पेशेवर सम्मान",
        "Conference participation": "सम्मेलन में भागीदारी",
        "Award ceremony": "पुरस्कार समारोह",
        "Certificate presentation": "प्रमाणपत्र वितरण",
        "Clinic team": "क्लिनिक टीम",
        "Procedure setup": "प्रक्रिया की तैयारी",
        "Before-and-after treatment photos will be added with written patient consent.": "उपचार से पहले और बाद की तस्वीरें मरीज़ की लिखित सहमति के साथ जोड़ी जाएँगी।",
        "Local Guide · 17 reviews": "लोकल गाइड · 17 समीक्षाएँ",
        "Google Maps · 2 reviews": "गूगल मैप्स · 2 समीक्षाएँ",
        "Google Maps · 7 reviews": "गूगल मैप्स · 7 समीक्षाएँ",
        "Local Guide · 163 reviews": "लोकल गाइड · 163 समीक्षाएँ",
        "Google Maps · 1 review": "गूगल मैप्स · 1 समीक्षा",
        "Reviews shown from": "समीक्षाएँ यहाँ से ली गई हैं:",
        "Google Maps": "गूगल मैप्स",
        ". Rating and count match the clinic’s Google Business listing.": "। रेटिंग और संख्या क्लिनिक की गूगल बिज़नेस लिस्टिंग से मेल खाती है।",
        "Frequently Asked": "अक्सर पूछे जाने वाले",
        "Questions": "प्रश्न",
        "Where is the clinic located?": "क्लिनिक कहाँ स्थित है?",
        "Dr Henry's Skin Clinic is at Usha Memorial Skin & Eye Hospital, Ware House Rd, near Sheafer School, Sindhi Colony, Bilaspur, Chhattisgarh 495001.": "डॉ हेनरी स्किन क्लिनिक उषा मेमोरियल स्किन एंड आई हॉस्पिटल, वेयर हाउस रोड, शेफ़र स्कूल के पास, सिंधी कॉलोनी, बिलासपुर, छत्तीसगढ़ 495001 में है।",
        "What are the clinic timings?": "क्लिनिक का समय क्या है?",
        "Monday to Saturday: 9:00 AM – 7:00 PM. Sunday closed. Holiday hours may vary — please call or WhatsApp to confirm.": "सोमवार से शनिवार: सुबह 9:00 से शाम 7:00 बजे तक। रविवार बंद। छुट्टियों में समय बदल सकता है — कृपया कॉल या व्हाट्सएप करके पुष्टि करें।",
        "How do I book an appointment?": "अपॉइंटमेंट कैसे बुक करें?",
        "Use the booking form below, WhatsApp +91 97700 48965 with your preferred day, or call the same number.": "नीचे दिए बुकिंग फ़ॉर्म का उपयोग करें, अपने पसंदीदा दिन के साथ +91 97700 48965 पर व्हाट्सएप करें, या इसी नंबर पर कॉल करें।",
        "Do you treat acne, melasma and hair loss?": "क्या आप मुँहासे, झाइयाँ और बाल झड़ने का इलाज करते हैं?",
        "Yes. We offer medical dermatology, laser care, aesthetics and hair treatments including PRP and hair transplant counselling. A doctor will advise the right plan after examining you.": "जी हाँ। हम मेडिकल डर्मेटोलॉजी, लेज़र देखभाल, एस्थेटिक्स और PRP व हेयर ट्रांसप्लांट परामर्श सहित बालों के उपचार उपलब्ध कराते हैं। जाँच के बाद डॉक्टर सही उपचार योजना बताएँगे।",
        "Is the AI chatbot medical advice?": "क्या एआई चैटबॉट की जानकारी चिकित्सकीय सलाह है?",
        "No. The AI Bot only shares general clinic information. It does not diagnose, prescribe or replace a doctor's consultation.": "नहीं। एआई बॉट केवल क्लिनिक की सामान्य जानकारी देता है। यह रोग की पहचान या दवा नहीं बताता और डॉक्टर के परामर्श का विकल्प नहीं है।",
        "Contact": "संपर्क",
        "Us": "करें",
        "Appointments, directions and enquiries.": "अपॉइंटमेंट, रास्ता और पूछताछ।",
        "Clinic Information": "क्लिनिक की जानकारी",
        "Address": "पता",
        "Usha Memorial Skin & Eye Hospital": "उषा मेमोरियल स्किन एंड आई हॉस्पिटल",
        "Ware House Rd, near Sheafer School, Sindhi Colony": "वेयर हाउस रोड, शेफ़र स्कूल के पास, सिंधी कॉलोनी",
        "Bilaspur, Chhattisgarh 495001": "बिलासपुर, छत्तीसगढ़ 495001",
        "Phone / WhatsApp": "फ़ोन / व्हाट्सएप",
        "Call Now": "अभी कॉल करें",
        "WhatsApp": "व्हाट्सएप",
        "Email": "ईमेल",
        "Clinic Timings": "क्लिनिक का समय",
        "Monday – Saturday: 9:00 AM – 7:00 PM": "सोमवार – शनिवार: सुबह 9:00 – शाम 7:00",
        "Sunday closed": "रविवार बंद",
        ". Holiday hours may vary — please confirm by phone.": "। छुट्टियों में समय बदल सकता है — कृपया फ़ोन पर पुष्टि करें।",
        "Instagram": "इंस्टाग्राम",
        "Find Us On Map": "नक्शे पर हमें खोजें",
        "Open in Google Maps": "गूगल मैप्स में खोलें",
        "Select concern": "समस्या चुनें",
        "Acne / pimples": "मुँहासे / फुंसियाँ",
        "Pigmentation / melasma": "पिगमेंटेशन / झाइयाँ",
        "Hair loss": "बाल झड़ना",
        "Laser hair reduction": "लेज़र हेयर रिडक्शन",
        "Skin allergy / infection": "त्वचा एलर्जी / संक्रमण",
        "Aesthetic / anti-ageing": "एस्थेटिक / एंटी-एजिंग",
        "Dermato-surgery": "डर्मेटो-सर्जरी",
        "General skin check": "सामान्य त्वचा जाँच",
        "Other": "अन्य",
        "Sends to WhatsApp (+91 97700 48965) and emails the clinic via Resend (drhenrysdermatology@gmail.com).": "व्हाट्सएप (+91 97700 48965) पर भेजता है और Resend के ज़रिए क्लिनिक को ईमेल (drhenrysdermatology@gmail.com) करता है।",
        "Dr Henry's Skin Clinic — trusted dermatology care in Bilaspur since 2000. Located at Usha Memorial Skin & Eye Hospital, Ware House Rd, Sindhi Colony.": "डॉ हेनरी स्किन क्लिनिक — 2000 से बिलासपुर में भरोसेमंद त्वचा चिकित्सा। उषा मेमोरियल स्किन एंड आई हॉस्पिटल, वेयर हाउस रोड, सिंधी कॉलोनी में स्थित।",
        "Quick Links": "त्वरित लिंक",
        "Home": "होम",
        "About": "हमारे बारे में",
        "Book Appointment": "अपॉइंटमेंट बुक करें",
        "AI Bot": "एआई बॉट",
        "Follow Us": "हमें फ़ॉलो करें",
        "Shop Skincare link will appear in the menu when Henry's Store goes live.": "हेनरी स्टोर शुरू होने पर स्किनकेयर शॉप का लिंक मेनू में दिखाई देगा।",
        "© 2026 Dr Henry's Skin Clinic. All rights reserved. Design and created by": "© 2026 डॉ हेनरी स्किन क्लिनिक। सर्वाधिकार सुरक्षित। डिज़ाइन एवं निर्माण:",
        "Recent Update": "हालिया अपडेट",
        "Patient care": "मरीज़ देखभाल",
        "FAQ": "प्रश्न"
};
    var hiPlaceholders = {
        "Your full name": "आपका पूरा नाम",
        "10-digit mobile": "10 अंकों का मोबाइल नंबर",
        "Any extra detail for the clinic": "क्लिनिक के लिए कोई अतिरिक्त जानकारी"
};

    var i18nNodes = null;   // [{node, orig, lead, trail, hi}]
    var i18nAttrs = null;   // [{el, orig, hi}]
    var i18nHiEls = null;   // [{el, orig, hi}]  elements carrying their own Hindi in data-hi

    function collapse(t) { return t.replace(/\s+/g, ' ').trim(); }

    function collectI18n() {
        i18nNodes = [];
        i18nAttrs = [];
        i18nHiEls = [];
        document.querySelectorAll('[data-hi]').forEach(function (el) {
            var hi = el.getAttribute('data-hi');
            if (hi) i18nHiEls.push({ el: el, orig: el.textContent, hi: hi });
        });
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                var p = n.parentElement;
                if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
                if (p.closest('[data-i18n],[data-hi],[translate="no"]')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var n;
        while ((n = walker.nextNode())) {
            var key = collapse(n.nodeValue);
            if (!key || !Object.prototype.hasOwnProperty.call(hiPhrases, key)) continue;
            var raw = n.nodeValue;
            i18nNodes.push({
                node: n,
                orig: raw,
                lead: raw.match(/^\s*/)[0],
                trail: raw.match(/\s*$/)[0],
                hi: hiPhrases[key]
            });
        }
        document.querySelectorAll('[placeholder]').forEach(function (el) {
            var ph = el.getAttribute('placeholder');
            if (hiPlaceholders[ph]) i18nAttrs.push({ el: el, orig: ph, hi: hiPlaceholders[ph] });
        });
        // Keep <option> values in English so the WhatsApp/email message stays readable for the clinic
        document.querySelectorAll('option:not([value])').forEach(function (o) {
            o.setAttribute('value', collapse(o.textContent));
        });
    }

    function applyLang(lang) {
        document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
        document.documentElement.setAttribute('data-lang', lang);
        var pack = dict[lang] || dict.en;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (pack[key]) el.textContent = pack[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (pack[key]) el.setAttribute('placeholder', pack[key]);
        });

        if (!i18nNodes) collectI18n();
        i18nNodes.forEach(function (it) {
            it.node.nodeValue = lang === 'hi' ? it.lead + it.hi + it.trail : it.orig;
        });
        i18nAttrs.forEach(function (it) {
            it.el.setAttribute('placeholder', lang === 'hi' ? it.hi : it.orig);
        });
        i18nHiEls.forEach(function (it) {
            it.el.textContent = lang === 'hi' ? it.hi : it.orig;
        });
        // Browser tab title
        var de = document.documentElement;
        var tEn = de.getAttribute('data-title-en'), tHi = de.getAttribute('data-title-hi');
        if (lang === 'hi' && tHi) document.title = tHi; else if (tEn) document.title = tEn;

        localStorage.setItem('clinic-lang', lang);
        document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
            btn.setAttribute('aria-pressed', btn.getAttribute('data-lang-btn') === lang ? 'true' : 'false');
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('clinic-theme', theme);
        var icon = document.getElementById('themeIcon');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        var btn = document.getElementById('themeToggle');
        if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

    function buildMessage(data) {
        return [
            'New appointment request — Dr Henry\'s Skin Clinic',
            '',
            'Name: ' + data.name,
            'Phone: ' + data.phone,
            data.email ? 'Email: ' + data.email : null,
            'Concern: ' + data.concern,
            'Preferred day: ' + data.day,
            data.note ? 'Message: ' + data.note : null,
            '',
            'Sent from ushamemorial.co.in website'
        ].filter(Boolean).join('\n');
    }

    function openWhatsAppAndEmail(data, statusEl) {
        var body = buildMessage(data);
        var wa = 'https://wa.me/' + CLINIC_PHONE + '?text=' + encodeURIComponent(body);
        var mail = 'mailto:' + CLINIC_EMAIL +
            '?subject=' + encodeURIComponent('Appointment request — ' + data.name) +
            '&body=' + encodeURIComponent(body);
        var lang = localStorage.getItem('clinic-lang') || 'en';
        var pack = dict[lang] || dict.en;

        fetch('/api/appointment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(function (r) { return r.json(); })
            .then(function (res) {
                if (statusEl) {
                    statusEl.textContent = res.emailed ? pack['book.email_ok'] : pack['book.email_fail'];
                    statusEl.classList.remove('d-none');
                }
                window.open(wa, '_blank', 'noopener');
                // Fallback mailto only if Resend did not send
                if (!res.emailed) {
                    setTimeout(function () { window.location.href = mail; }, 500);
                }
            })
            .catch(function () {
                if (statusEl) {
                    statusEl.textContent = pack['book.email_fail'];
                    statusEl.classList.remove('d-none');
                }
                window.open(wa, '_blank', 'noopener');
                setTimeout(function () { window.location.href = mail; }, 500);
            });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var savedLang = localStorage.getItem('clinic-lang') || 'en';
        var savedTheme = localStorage.getItem('clinic-theme') || 'light';
        applyLang(savedLang);
        applyTheme(savedTheme);

        document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyLang(btn.getAttribute('data-lang-btn'));
            });
        });

        var themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', function () {
                var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                applyTheme(next);
            });
        }

        var form = document.getElementById('appointmentForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var data = {
                    name: (document.getElementById('apptName').value || '').trim(),
                    phone: (document.getElementById('apptPhone').value || '').trim(),
                    email: (document.getElementById('apptEmail') && document.getElementById('apptEmail').value || '').trim(),
                    concern: document.getElementById('apptConcern').value,
                    day: document.getElementById('apptDay').value,
                    note: (document.getElementById('apptNote').value || '').trim()
                };
                if (!data.name || !data.phone || !data.concern || !data.day) {
                    form.reportValidity();
                    return;
                }
                var status = document.getElementById('bookStatus');
                if (status) {
                    var lang = localStorage.getItem('clinic-lang') || 'en';
                    status.textContent = (dict[lang] || dict.en)['book.success'];
                    status.classList.remove('d-none');
                }
                openWhatsAppAndEmail(data, status);
            });
        }

        // Soft reveal for cards
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) {
                        en.target.classList.add('in');
                        io.unobserve(en.target);
                    }
                });
            }, { threshold: 0.01, rootMargin: '0px 0px 80px 0px' });
            document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
        } else {
            document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
        }

        // Active nav highlight
        var links = document.querySelectorAll('#navbar .nav-link-custom[href^="#"]');
        window.addEventListener('scroll', function () {
            var y = window.scrollY + 100;
            links.forEach(function (link) {
                var id = link.getAttribute('href').slice(1);
                var sec = document.getElementById(id);
                if (!sec) return;
                var top = sec.offsetTop;
                var bottom = top + sec.offsetHeight;
                link.classList.toggle('is-active', y >= top && y < bottom);
            });
        }, { passive: true });

        window.CLINIC_MAPS_URL = MAPS_URL;
    });
})();

/* Mobile menu: close the hamburger panel on scroll, outside tap or Escape */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var menu = document.getElementById('navbarNav');
        var toggler = document.querySelector('.navbar-toggler');
        if (!menu || !toggler || !window.bootstrap) return;

        var openedAt = 0;
        function isOpen() { return menu.classList.contains('show'); }
        function closeMenu() {
            if (isOpen()) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }

        menu.addEventListener('shown.bs.collapse', function () { openedAt = window.scrollY; });

        // Page scrolled while the menu is open -> close it (small threshold ignores jitter)
        window.addEventListener('scroll', function () {
            if (isOpen() && Math.abs(window.scrollY - openedAt) > 24) closeMenu();
        }, { passive: true });

        // Tap/click anywhere outside the navbar closes it
        document.addEventListener('click', function (e) {
            if (isOpen() && !e.target.closest('#navbar')) closeMenu();
        });
        document.addEventListener('touchstart', function (e) {
            if (isOpen() && !e.target.closest('#navbar')) closeMenu();
        }, { passive: true });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    });
})();