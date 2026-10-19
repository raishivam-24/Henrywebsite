/* Cursor spotlight + magnetic buttons (additive) */
document.addEventListener('DOMContentLoaded', function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    var zones = document.querySelectorAll('.hero-section, section[style*="#1a1a2e"]');
    zones.forEach(function (z) {
        z.addEventListener('mousemove', function (e) {
            var r = z.getBoundingClientRect();
            z.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            z.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    document.querySelectorAll('.btn-sage, .btn-outline-light').forEach(function (b) {
        b.addEventListener('mousemove', function (e) {
            var r = b.getBoundingClientRect();
            var x = (e.clientX - r.left - r.width / 2) * 0.15;
            var y = (e.clientY - r.top - r.height / 2) * 0.25;
            b.style.transform = 'translate(' + x + 'px,' + (y - 3) + 'px)';
        });
        b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
});