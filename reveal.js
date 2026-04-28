/**
 * reveal.js — Table 11
 *
 * Fetches content.json and builds the post-reveal time capsule:
 *   1. Opening line
 *   2. Greeting
 *   3. Four couples (expandable messages)
 *   4. Coordinates reveal
 *   5. Media feed (hidden if empty)
 *   6. Sign-off
 *
 * Called by countdown.js once the reveal date has passed.
 *
 * NOTE: fetch() requires an HTTP server. For local preview run:
 *   python3 -m http.server 8000
 * then open http://localhost:8000
 */

window.renderCapsule = function () {
  fetch('content.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      buildCapsule(data);
    })
    .catch(function (err) {
      console.warn('Table 11: could not load content.json —', err.message);
      var capsule = document.getElementById('capsule');
      if (capsule) {
        capsule.innerHTML =
          '<p class="noscript-msg">Could not load content. ' +
          'If previewing locally, serve the folder with: ' +
          '<code style="font-family:monospace">python3 -m http.server 8000</code></p>';
      }
    });
};

/* ---- BUILDER ---- */

function buildCapsule(data) {
  var capsule = document.getElementById('capsule');
  if (!capsule) return;

  var html = '';

  /* 1 — Opening line */
  html += '<p class="opening">' + esc(data.opening_line) + '</p>';

  html += '<hr class="rule">';

  /* 2 — Greeting */
  html += '<p class="greeting">' + esc(data.greeting) + '</p>';

  html += '<hr class="rule">';

  /* 3 — Four couples */
  html += '<ul class="couples-list" role="list">';
  data.couples.forEach(function (couple, i) {
    html += '<li class="couple-item" id="couple-' + i + '">';
    html +=   '<button class="couple-toggle"' +
                ' aria-expanded="false"' +
                ' aria-controls="msg-' + i + '">';
    html +=     '<span>' + esc(couple.names) + '</span>';
    html +=     '<span class="couple-toggle-icon" aria-hidden="true">+</span>';
    html +=   '</button>';
    html +=   '<div class="couple-message" id="msg-' + i + '" role="region">';
    html +=     '<p>' + esc(couple.message) + '</p>';
    if (couple.message_date) {
      html +=   '<time datetime="' + esc(couple.message_date) + '">' +
                  formatDate(couple.message_date) +
                '</time>';
    }
    html +=   '</div>';
    html += '</li>';
  });
  html += '</ul>';

  html += '<hr class="rule">';

  /* 4 — Coordinates */
  var mapSrc   = 'https://maps.google.com/maps?q=' + data.coordinates.lat + ',' + data.coordinates.lng + '&z=14&t=k&output=embed';
  var mapsHref = 'https://www.google.com/maps/search/?api=1&query=' + data.coordinates.lat + ',' + data.coordinates.lng;

  html += '<div class="coordinates-block">';
  html +=   '<button class="coordinates-btn" id="coords-btn" aria-expanded="false" aria-controls="coords-panel">';
  html +=     '<span>' + esc(data.coordinates.display) + '</span>';
  html +=     '<span class="coords-chevron" aria-hidden="true">↓</span>';
  html +=   '</button>';
  html +=   '<div class="coords-panel" id="coords-panel" aria-live="polite">';
  html +=     '<p class="coords-reveal-text">' + esc(data.coordinates_reveal_text) + '</p>';
  html +=     '<div class="coords-map">';
  html +=       '<iframe src="' + mapSrc + '" width="100%" height="320" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Cox Bay, Tofino on Google Maps"></iframe>';
  html +=     '</div>';
  html +=     '<a class="coords-gmaps-link" href="' + mapsHref + '" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>';
  html +=   '</div>';
  html += '</div>';

  /* 5 — Media feed heading (always shown) + items (only if they exist) */
  html += '<hr class="rule">';
  html += '<p class="section-label">' + esc(data.media_heading || 'Table 11 over the years.') + '</p>';

  if (data.media && data.media.length > 0) {
    html += '<div class="media-feed">';

    // Chronological: sort by date_added ascending
    var sorted = data.media.slice().sort(function (a, b) {
      return new Date(a.date_added) - new Date(b.date_added);
    });

    sorted.forEach(function (item) {
      html += '<figure class="media-item">';
      if (item.type === 'video') {
        html += '<video src="media/' + esc(item.filename) + '"' +
                ' controls playsinline preload="metadata"></video>';
      } else {
        html += '<img src="media/' + esc(item.filename) + '"' +
                ' alt="' + esc(item.caption) + '" loading="lazy">';
      }
      html += '<figcaption>';
      html +=   '<p class="media-meta">' +
                  esc(item.uploaded_by) + ' &middot; ' + formatDate(item.date_added) +
                '</p>';
      html +=   '<p class="media-caption">' + esc(item.caption) + '</p>';
      html += '</figcaption>';
      html += '</figure>';
    });

    html += '</div>';
  }

  html += '<hr class="rule">';

  /* 6 — Sign-off */

  html += '<div class="signoff">';
  html +=   '<p class="signoff-line">' + esc(data.sign_off) + '</p>';
  var names = data.couples
    .map(function (c) { return esc(c.names); })
    .join('<br>');
  html +=   '<p class="signoff-names">' + names + '</p>';
  html += '</div>';

  capsule.innerHTML = html;

  /* Wire interactivity after DOM is ready */
  attachCoupleToggles();
  attachCoordinatesReveal();
}

/* ---- INTERACTIVITY ---- */

function attachCoupleToggles() {
  var items = document.querySelectorAll('.couple-item');
  items.forEach(function (item) {
    var btn = item.querySelector('.couple-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var opening = !item.classList.contains('open');
      item.classList.toggle('open', opening);
      btn.setAttribute('aria-expanded', String(opening));
    });
  });
}

function attachCoordinatesReveal() {
  var btn   = document.getElementById('coords-btn');
  var panel = document.getElementById('coords-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', function () {
    var isOpen = panel.classList.contains('open');
    panel.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.classList.toggle('active', !isOpen);
  });
}

/* ---- UTILITIES ---- */

// Escape user-supplied strings before inserting as HTML
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Format ISO date → "April 25, 2026"
function formatDate(iso) {
  if (!iso) return '';
  var MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  var d = new Date(iso);
  return MONTHS[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
}
