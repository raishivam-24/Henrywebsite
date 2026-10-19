/* Design & animation enhancements (additive – safe to remove) */
(function () {
    document.documentElement.classList.add('js-enhance');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        /* Scroll progress bar */
        var bar = document.createElement('div');
        bar.id = 'scroll-progress';
        document.body.appendChild(bar);
        function progress() {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
        }
        window.addEventListener('scroll', progress, { passive: true });
        progress();

        /* Heading underline bars grow when visible */
        var bars = document.querySelectorAll('.bg-sage.mx-auto[style*="height: 4px"]');
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
                });
            }, { threshold: 0.6 });
            bars.forEach(function (b) { io.observe(b); });
        } else {
            bars.forEach(function (b) { b.classList.add('in-view'); });
        }

        if (reduce) return;

        /* Hero floating particles */
        var hero = document.getElementById('home');
        if (hero) {
            for (var i = 0; i < 18; i++) {
                var p = document.createElement('span');
                var size = 4 + Math.random() * 10;
                p.className = 'hero-particle';
                p.style.width = p.style.height = size + 'px';
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDuration = (8 + Math.random() * 10) + 's';
                p.style.animationDelay = (-Math.random() * 15) + 's';
                hero.appendChild(p);
            }
        }

        /* Button click ripple */
        document.querySelectorAll('.btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var r = btn.getBoundingClientRect();
                var d = Math.max(r.width, r.height);
                var s = document.createElement('span');
                s.className = 'ripple';
                s.style.width = s.style.height = d + 'px';
                s.style.left = (e.clientX - r.left - d / 2) + 'px';
                s.style.top = (e.clientY - r.top - d / 2) + 'px';
                btn.appendChild(s);
                setTimeout(function () { s.remove(); }, 600);
            });
        });

        /* 3D tilt on doctor cards (desktop only) */
        if (window.matchMedia('(hover: hover)').matches) {
            document.querySelectorAll('.doctor-card').forEach(function (card) {
                card.addEventListener('mousemove', function (e) {
                    var r = card.getBoundingClientRect();
                    var x = (e.clientX - r.left) / r.width - 0.5;
                    var y = (e.clientY - r.top) / r.height - 0.5;
                    card.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-8px)';
                });
                card.addEventListener('mouseleave', function () {
                    card.style.transition = 'transform .5s ease, box-shadow .3s ease';
                    card.style.transform = '';
                });
                card.addEventListener('mouseenter', function () { card.style.transition = 'box-shadow .3s ease'; });
            });
        }
    });
})();