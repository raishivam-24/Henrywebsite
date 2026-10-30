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
            'reviews.based': 'Based on 303 Google reviews',
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
            'reviews.based': '३०३ गूगल समीक्षाओं पर आधारित',
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
            }, { threshold: 0.12 });
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
