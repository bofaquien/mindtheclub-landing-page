/* MindTheClub — language handling for the static multi-language site.
   - Remembers an explicit language choice made through the footer switcher.
   - On English root pages, redirects visitors whose browser language has a
     translation (first visit), or who explicitly picked a language earlier. */
(function () {
    var LANGS = ['de', 'es', 'fr', 'id', 'it', 'pl', 'pt'];
    var TRANSLATED_PAGES = [
        'index.html', 'how-mtc-connects.html', 'white-paper.html',
        'how-to-guide.html', 'pricing.html', 'faq.html',
        'contact.html'
    ];

    function storedLang() {
        try { return localStorage.getItem('mtc_lang'); } catch (e) { return null; }
    }

    // Any click on a footer switcher link records the visitor's choice.
    document.addEventListener('click', function (e) {
        var el = e.target;
        while (el && el.getAttribute) {
            if (el.tagName === 'A' && el.getAttribute('data-lang') &&
                el.parentNode && el.parentNode.className &&
                String(el.parentNode.className).indexOf('lang-switcher') !== -1) {
                try { localStorage.setItem('mtc_lang', el.getAttribute('data-lang')); } catch (err) {}
                return;
            }
            el = el.parentNode;
        }
    });

    if (location.protocol === 'file:') return; // keep local previews navigable

    var parts = location.pathname.split('/').filter(Boolean);
    var currentLang = (parts.length && LANGS.indexOf(parts[0]) !== -1) ? parts[0] : 'en';
    if (currentLang !== 'en') return;   // never redirect away from a translation
    if (parts.length > 1) return;       // only top-level English pages redirect

    var page = parts.length ? parts[0] : 'index.html';
    if (TRANSLATED_PAGES.indexOf(page) === -1) return;

    var target = storedLang();
    if (target === 'en') return;        // explicit choice: stay on English
    if (!target) {
        // First visit: use the browser language if a translation exists.
        var candidates = navigator.languages || [navigator.language || ''];
        for (var i = 0; i < candidates.length && !target; i++) {
            var base = String(candidates[i]).toLowerCase().split('-')[0];
            if (base === 'en') return;  // browser prefers English → stay
            if (base === 'in') base = 'id'; // legacy Indonesian code
            if (LANGS.indexOf(base) !== -1) target = base;
        }
    }
    if (target && LANGS.indexOf(target) !== -1) {
        location.replace('/' + target + '/' + page + location.search + location.hash);
    }
})();
