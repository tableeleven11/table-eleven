/**
 * countdown.js — Table 11
 *
 * Determines current state (pre-reveal vs post-reveal) and runs the
 * appropriate timer. On the exact reveal moment, fades out the countdown
 * and fades in the time-capsule content.
 *
 * Source-of-truth timestamp:
 *   April 26, 2037 02:00:00 UTC
 *   = April 25, 2037 7:00 PM PDT (UTC−7)
 *
 * Wedding timestamp:
 *   April 25, 2026 07:00:00 UTC
 *   = April 25, 2026 12:00 AM PDT (UTC−7)
 */

(function () {
  'use strict';

  /* ---- CONSTANTS ---- */

  // UTC milliseconds — single source of truth, no timezone ambiguity
  var REVEAL_MS  = Date.UTC(2037, 3, 26, 2, 0, 0);   // Month is 0-indexed: 3 = April
  var WEDDING_MS = Date.UTC(2026, 3, 25, 7, 0, 0);

  // Dev preview: append ?preview to the URL to force post-reveal state
  // e.g. http://localhost:8001?preview
  var PREVIEW_MODE = window.location.search.indexOf('preview') !== -1;

  /* ---- ELEMENTS ---- */

  var preEl  = document.getElementById('pre-reveal');
  var postEl = document.getElementById('post-reveal');

  /* ---- UTILITIES ---- */

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  /**
   * Calculate calendar-accurate diff between two UTC timestamps.
   * Returns { years, months, days, hours, minutes, seconds }.
   */
  function calcDiff(fromMs, toMs) {
    var from = new Date(fromMs);
    var to   = new Date(toMs);

    var years   = to.getUTCFullYear() - from.getUTCFullYear();
    var months  = to.getUTCMonth()    - from.getUTCMonth();
    var days    = to.getUTCDate()     - from.getUTCDate();
    var hours   = to.getUTCHours()    - from.getUTCHours();
    var minutes = to.getUTCMinutes()  - from.getUTCMinutes();
    var seconds = to.getUTCSeconds()  - from.getUTCSeconds();

    // Normalize — cascade borrows upward
    if (seconds < 0) { seconds += 60; minutes -= 1; }
    if (minutes < 0) { minutes += 60; hours   -= 1; }
    if (hours   < 0) { hours   += 24; days    -= 1; }
    if (days    < 0) {
      months -= 1;
      // Days in the month *before* `to`
      var daysInPrevMonth = new Date(
        Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 0)
      ).getUTCDate();
      days += daysInPrevMonth;
    }
    if (months < 0) { months += 12; years -= 1; }

    return {
      years:   years,
      months:  months,
      days:    days,
      hours:   hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  /* ---- COUNTDOWN (pre-reveal) ---- */

  function setCountdown(d) {
    document.getElementById('cd-years').textContent   = pad(d.years);
    document.getElementById('cd-months').textContent  = pad(d.months);
    document.getElementById('cd-days').textContent    = pad(d.days);
    document.getElementById('cd-hours').textContent   = pad(d.hours);
    document.getElementById('cd-minutes').textContent = pad(d.minutes);
    document.getElementById('cd-seconds').textContent = pad(d.seconds);
  }

  /* ---- COUNT-UP (post-reveal) ---- */

  // The count-up uses the same visual structure as the countdown.
  // countdown.js builds it programmatically so reveal.js has one less concern.
  function buildCountupDOM() {
    var countupEl = document.getElementById('countup');
    if (!countupEl || countupEl.querySelector('.unit')) return; // already built

    var units = [
      ['cu-years',   'Years'],
      ['cu-months',  'Months'],
      ['cu-days',    'Days'],
      ['cu-hours',   'Hours'],
      ['cu-minutes', 'Minutes'],
      ['cu-seconds', 'Seconds']
    ];

    var html = '';
    units.forEach(function (u, i) {
      if (i > 0) {
        html += '<span class="dot" aria-hidden="true">\u00B7</span>';
      }
      html +=
        '<div class="unit">' +
          '<span class="num" id="' + u[0] + '">00</span>' +
          '<span class="lbl">' + u[1] + '</span>' +
        '</div>';
    });

    countupEl.innerHTML = html;
  }

  function setCountup(d) {
    var ids = ['cu-years', 'cu-months', 'cu-days', 'cu-hours', 'cu-minutes', 'cu-seconds'];
    var vals = [d.years, d.months, d.days, d.hours, d.minutes, d.seconds];
    ids.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (el) el.textContent = pad(vals[i]);
    });
  }

  /* ---- TIMER TICKS ---- */

  var timerInterval = null;

  function tickCountdown() {
    var now = Date.now();
    if (now >= REVEAL_MS) {
      clearInterval(timerInterval);
      timerInterval = null;
      onRevealMoment();
      return;
    }
    setCountdown(calcDiff(now, REVEAL_MS));
  }

  function tickCountup() {
    setCountup(calcDiff(WEDDING_MS, Date.now()));
  }

  /* ---- REVEAL TRANSITION ---- */

  function onRevealMoment() {
    // Fade out the pre-reveal section
    preEl.classList.add('anim-fade-out');

    setTimeout(function () {
      // Swap states
      preEl.setAttribute('hidden', '');
      preEl.classList.remove('anim-fade-out');

      postEl.removeAttribute('hidden');
      postEl.classList.add('anim-fade-in');

      startPostReveal();

      // Signal reveal.js to render the capsule content
      if (typeof window.renderCapsule === 'function') {
        window.renderCapsule();
      }
    }, 900);
  }

  /* ---- STATE INITIALIZERS ---- */

  function startPreReveal() {
    preEl.removeAttribute('hidden');
    postEl.setAttribute('hidden', '');

    // Set immediately, then update every second
    setCountdown(calcDiff(Date.now(), REVEAL_MS));
    timerInterval = setInterval(tickCountdown, 1000);
  }

  function startPostReveal() {
    buildCountupDOM();
    tickCountup();
    timerInterval = setInterval(tickCountup, 1000);
  }

  /* ---- INIT ---- */

  function init() {
    // Fade the page in
    document.body.classList.add('loaded');

    if (PREVIEW_MODE || Date.now() >= REVEAL_MS) {
      // Already past the reveal date — go straight to post-reveal
      postEl.removeAttribute('hidden');
      preEl.setAttribute('hidden', '');
      startPostReveal();

      if (typeof window.renderCapsule === 'function') {
        window.renderCapsule();
      }
    } else {
      startPreReveal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
