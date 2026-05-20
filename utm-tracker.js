(function() {
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  // 1. Read UTMs from current URL
  var params = new URLSearchParams(window.location.search);
  var current = {};
  utmKeys.forEach(function(k) {
    if (params.has(k)) current[k] = params.get(k);
  });

  // 2. If new UTMs found, store them for this session
  if (Object.keys(current).length > 0) {
    try { sessionStorage.setItem('mtc_utm', JSON.stringify(current)); } catch(e) {}
  }

  // 3. Read stored UTMs (either just-set or from earlier in the session)
  var stored = {};
  try {
    var raw = sessionStorage.getItem('mtc_utm');
    if (raw) stored = JSON.parse(raw);
  } catch(e) {}

  if (Object.keys(stored).length === 0) return;

  // 4. Append UTMs to all internal links on the page
  function decorateLinks() {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (href.indexOf('mailto:') === 0) return;
      if (href.indexOf('tel:') === 0) return;
      if (href.indexOf('#') === 0) return;
      // External link that is not our domain → skip
      if (href.indexOf('http') === 0 && href.indexOf('mindtheclub.com') === -1) return;

      var url;
      try { url = new URL(href, window.location.origin); } catch(e) { return; }

      Object.keys(stored).forEach(function(k) {
        if (!url.searchParams.has(k)) url.searchParams.set(k, stored[k]);
      });

      // Preserve original format (relative if it was relative)
      if (href.indexOf('http') === 0) {
        link.setAttribute('href', url.toString());
      } else {
        link.setAttribute('href', url.pathname + url.search + url.hash);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateLinks);
  } else {
    decorateLinks();
  }
})();