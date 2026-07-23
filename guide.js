/* HOW TO GUIDE — table-of-contents drawer, smooth scrolling and
   scroll-spy. Shared by every language version of how-to-guide.html. */
(function () {
    var toggle   = document.getElementById('tocToggle');
    var sidebar  = document.getElementById('tocSidebar');
    var overlay  = document.getElementById('tocOverlay');
    var navLinks = document.querySelectorAll('.guide-nav a');

    function openDrawer()  { sidebar.classList.add('open');  overlay.classList.add('open'); }
    function closeDrawer() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }

    toggle.addEventListener('click', function () {
        sidebar.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    overlay.addEventListener('click', closeDrawer);

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 820) closeDrawer();
        });
    });

    document.querySelectorAll('.guide-nav a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', this.getAttribute('href'));
            }
        });
    });

    var sections = [];
    navLinks.forEach(function (link) {
        var id = link.getAttribute('href').replace('#', '');
        var el = document.getElementById(id);
        if (el) sections.push({ id: id, el: el, link: link });
    });

    function updateActive() {
        var scrollY = window.scrollY + 80;
        var current = null;
        for (var i = 0; i < sections.length; i++) {
            if (sections[i].el.offsetTop <= scrollY) current = sections[i];
        }
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        if (current) current.link.classList.add('active');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () { updateActive(); ticking = false; });
            ticking = true;
        }
    });
    updateActive();
})();
