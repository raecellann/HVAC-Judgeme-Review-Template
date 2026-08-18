/* ─────────────────────────────────────────────────────────────────────────
   HVAC Judge.me Review Section — static preview behavior
   Mirrors the IIFE at the bottom of sections/judgeme-reviews-section.liquid
   ────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var sid = 'demo';
  var PER_PAGE = 4;

  var PRODUCT_TITLE = 'Goodman 3 Ton 14.3 SEER2 Air Conditioner Condenser';

  /* Purchased-title variants (mirrors _pta.._pte in the Liquid file — swaps
     the tonnage/SEER2 tokens for each variant so different reviews look like
     they bought a different configuration). */
  var VARIANT_TITLES = {
    a: 'Goodman 3 Ton 14.3 SEER2 Air Conditioner Condenser',
    b: 'Goodman 2 Ton 13.4 SEER2 Air Conditioner Condenser',
    c: 'Goodman 4 Ton 15.2 SEER2 Air Conditioner Condenser',
    d: 'Goodman 5 Ton 14.3 SEER2 Air Conditioner Condenser',
    e: 'Goodman 2.5 Ton 15.2 SEER2 Air Conditioner Condenser'
  };

  /* Customer photo tiles — CSS gradients so nothing external is fetched */
  var PHOTO_TILES = [
    { grad: 'linear-gradient(135deg,#93c5fd 0%,#1e40af 100%)', label: 'Outdoor install',   more: 'Backyard placement' },
    { grad: 'linear-gradient(135deg,#fbbf24 0%,#b45309 100%)', label: 'Line-set detail',   more: 'Copper lineset' },
    { grad: 'linear-gradient(135deg,#a7f3d0 0%,#059669 100%)', label: 'Coil close-up',     more: 'Evaporator coil' },
    { grad: 'linear-gradient(135deg,#fecaca 0%,#b91c1c 100%)', label: 'Wiring diagram',    more: 'Control board' },
    { grad: 'linear-gradient(135deg,#e9d5ff 0%,#6b21a8 100%)', label: 'Concrete pad',      more: 'Base mounting' }
  ];

  /* Review dataset (matches the fallback reviews in the Liquid file) */
  var REVIEWS = [
    { initials: 'ON', name: 'Onion',      loc: 'Louisiana',       rating: 5, date: 'January 20, 2026',  ts: 20260120, tonnage: '4 Ton', seer2: '15.2 SEER2', title: 'HVAC equipment',           body: 'Ordered furnace, ac coil, and condenser to match. Upon arrival all three items were damaged, I refused shipment and took pictures. I contacted HVAC direct immediately and informed them of the situation. They sent out new equipment without any delay and the new shipment arrived quicker than the first. Second time around all HVAC equipment is in great condition. I will be ordering more in the future because of their willingness to make a bad situation good!', purchased: 'c', helpful: 14 },
    { initials: 'TO', name: 'Todd',       loc: 'Texas',           rating: 5, date: 'June 6, 2025',      ts: 20250606, tonnage: '3 Ton', seer2: '14.3 SEER2', title: 'Impressed',                body: 'I called customer service just to see if the equipment could be picked up by me at the warehouse. James Nesbitt answered the call and verified customer pick up was an option then offered to help me buy the system that was the best fit for me, his help was very appreciated.',                                                                                                                                                                                                                                        purchased: 'a', helpful: 19 },
    { initials: 'FI', name: 'Fisher',     loc: 'Texas',           rating: 5, date: 'May 19, 2025',      ts: 20250519, tonnage: '5 Ton', seer2: '14.3 SEER2', title: 'Good american made.',      body: "Being from Houston where they make them the quality is very good, the dependability is very good. Overall I've had good luck over a 30 year investment in Goodman products. Some give them a bad wrap but I would put them up against the big names any day.",                                                                                                                                                                                                                                                       purchased: 'd', helpful: 22 },
    { initials: 'JA', name: 'James',      loc: 'Alabama',         rating: 5, date: 'April 15, 2025',    ts: 20250415, tonnage: '3 Ton', seer2: '14.3 SEER2', title: 'Great',                    body: 'Everything was great. The price, the service. Everyone was so nice and helpful. I would definitely use again if needed.',                                                                                                                                                                                                                                                                                                                                                     purchased: 'a', helpful: 7  },
    { initials: 'DL', name: 'Delores',    loc: 'Georgia',         rating: 5, date: 'February 12, 2024', ts: 20240212, tonnage: '5 Ton', seer2: '14.3 SEER2', title: 'Satisfied',                body: 'So far am satisfied with air conditioner. Was easy for my daughter to help me order and questions were answered as needed. Will use you again if needed.',                                                                                                                                                                                                                                                                                                              purchased: 'd', helpful: 4  },
    { initials: 'GY', name: 'Gary',       loc: 'Florida',         rating: 5, date: 'October 8, 2023',   ts: 20231008, tonnage: '5 Ton', seer2: '14.3 SEER2', title: 'Great AC Unit',            body: "This unit was installed 7 1/2 years ago and has given me trouble free and excellent cooling. I couldn't be anymore satisfied.",                                                                                                                                                                                                                                                                                                                              purchased: 'd', helpful: 6  },
    { initials: 'FK', name: 'Frank',      loc: 'Mississippi',     rating: 4, date: 'October 3, 2023',   ts: 20231003, tonnage: '4 Ton', seer2: '15.2 SEER2', title: 'Very pleased',             body: 'Perfect unit for my home. Runs quiet and cool.',                                                                                                                                                                                                                                                                                                                                                                                                            purchased: 'c', helpful: 2  },
    { initials: 'MI', name: 'Michael',    loc: 'North Carolina',  rating: 5, date: 'September 13, 2023',ts: 20230913, tonnage: '2 Ton', seer2: '13.4 SEER2', title: 'Very happy',               body: 'My nephew who is licensed installed it, the line set and coil, cools great, very happy. Quiet as well.',                                                                                                                                                                                                                                                                                                                                                     purchased: 'b', helpful: 9  },
    { initials: 'WJ', name: 'WJA',        loc: 'Tennessee',       rating: 5, date: 'September 6, 2023', ts: 20230906, tonnage: '3 Ton', seer2: '14.3 SEER2', title: 'Extremely pleased',        body: 'The product and customer service are above and beyond what I was expecting. I ordered the wrong product and they helped me with my mistake to get my order correct. Ben was awesome as well as the entire dock crew. I will order from here again.',                                                                                                                                                                                                          purchased: 'a', helpful: 23 },
    { initials: 'RU', name: 'Russell',    loc: 'Arizona',         rating: 5, date: 'August 28, 2023',   ts: 20230828, tonnage: '2 Ton', seer2: '13.4 SEER2', title: 'Smooth transaction',       body: 'Could not have ask for a smoother transaction, everything arrived undamaged and very well packaged. I had an issue with the brass cap on the liquid line service valve missing but after I notified your sales department, they sent a replacement cap. Very satisfied with the transaction!',                                                                                                                                                             purchased: 'b', helpful: 8  },
    { initials: 'AL', name: 'Allen',      loc: 'Florida',         rating: 5, date: 'August 28, 2023',   ts: 20230828, tonnage: '5 Ton', seer2: '14.3 SEER2', title: 'Awesome',                  body: "So far everything seems to be working really well as of now. Your service is awesome — you didn't have the unit I ordered and upgraded me for free and I received it the same week I ordered it. Can't say enough good about y'all and will recommend you to my friends. I personally will be a repeat customer. Thanks again.",                                                                                                                                        purchased: 'd', helpful: 17 },
    { initials: 'KE', name: 'Kerry',      loc: 'Ohio',            rating: 5, date: 'August 28, 2023',   ts: 20230828, tonnage: '4 Ton', seer2: '15.2 SEER2', title: 'Delivered in 3 days',      body: "Customer service helped me choose a matching condenser coil. Placed my order and it was delivered in 3 days. Couldn't be happier!",                                                                                                                                                                                                                                                                                                                                purchased: 'c', helpful: 12 },
    { initials: 'SU', name: 'Sue',        loc: 'Florida',         rating: 5, date: 'August 19, 2023',   ts: 20230819, tonnage: '5 Ton', seer2: '14.3 SEER2', title: 'Happy with product',       body: 'I have had this product for about 3 weeks. Works very good. Happy with the a/c unit. My old a/c unit was a Goodman — it lasted 45 years. My old unit was put in in 1977. That is why I bought another Goodman a/c unit.',                                                                                                                                                                                                                                       purchased: 'd', helpful: 11 },
    { initials: 'ZA', name: 'Zack',       loc: 'Texas',           rating: 5, date: 'July 19, 2023',     ts: 20230719, tonnage: '3 Ton', seer2: '14.3 SEER2', title: 'Works fine',               body: "My old AC unit was 20 years old and wasn't cooling well. I went with the Goodman which had more competitive pricing than others.",                                                                                                                                                                                                                                                                                                                          purchased: 'a', helpful: 10 },
    { initials: 'JO', name: 'Joe',        loc: 'California',      rating: 5, date: 'July 18, 2023',     ts: 20230718, tonnage: '2 Ton', seer2: '13.4 SEER2', title: 'Our unit kicks AC!',       body: 'Great unit it really cranks and keeps the place comfortable. Best purchase we made for our newly acquired home!',                                                                                                                                                                                                                                                                                                                                              purchased: 'b', helpful: 15 },
    { initials: 'AV', name: 'Avee',       loc: 'Georgia',         rating: 5, date: 'July 16, 2023',     ts: 20230716, tonnage: '4 Ton', seer2: '15.2 SEER2', title: 'Great value for money',    body: 'I am very pleased with Goodman price, quality and performance. Keep up the good work.',                                                                                                                                                                                                                                                                                                                                                                        purchased: 'c', helpful: 6  },
    { initials: 'RN', name: 'Ron',        loc: 'Mississippi',     rating: 5, date: 'July 15, 2023',     ts: 20230715, tonnage: '2 Ton', seer2: '13.4 SEER2', title: 'Great product',            body: 'Great product, good price & good service. I always recommend it to my customer & my friend.',                                                                                                                                                                                                                                                                                                                                                              purchased: 'b', helpful: 16 },
    { initials: 'KN', name: 'Ken',        loc: 'Arizona',         rating: 5, date: 'July 13, 2023',     ts: 20230713, tonnage: '2 Ton', seer2: '13.4 SEER2', title: 'Works great',              body: "We've just got our unit installed and so far it has run great and cools the house down quickly!",                                                                                                                                                                                                                                                                                                                                                       purchased: 'b', helpful: 13 }
  ];

  /* ────────────────────────── DOM references ────────────────────────── */

  var $ = function (id) { return document.getElementById(id); };
  var qsa = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var listEl    = $('jmr-list-' + sid);
  var photoRow  = $('jmr-photo-row');
  var toggleBtn = $('jmr-filter-toggle-' + sid);
  var panel     = $('jmr-filter-panel-'  + sid);
  var emptyEl   = $('jmr-empty-'  + sid);
  var prevBtn   = $('jmr-prev-'   + sid);
  var nextBtn   = $('jmr-next-'   + sid);
  var infoEl    = $('jmr-info-'   + sid);

  /* ────────────────────────── Render photo tiles ────────────────────────── */

  PHOTO_TILES.forEach(function (p, i) {
    var tile = document.createElement('div');
    tile.className = 'jmr-photo-tile';
    tile.setAttribute('data-index', String(i));
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('aria-label', 'View ' + p.label);
    var thumb = document.createElement('div');
    thumb.className = 'jmr-photo-thumb';
    thumb.style.background = p.grad;
    tile.appendChild(thumb);
    photoRow.appendChild(tile);
  });
  var more = document.createElement('div');
  more.className = 'jmr-photo-more';
  more.innerHTML = '<span>+232</span><small>More photos</small>';
  photoRow.appendChild(more);

  /* ────────────────────────── Render review cards ────────────────────────── */

  var HELPFUL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
  var REPORT_SVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>';
  var CHECK_SVG_S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
  var VP_SVG      = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function starRow(rating) {
    var filled = '★'.repeat(rating);
    var empty  = rating < 5 ? '<span style="color:#e4e5e7">' + '★'.repeat(5 - rating) + '</span>' : '';
    return filled + empty;
  }

  function renderCards() {
    var html = '';
    REVIEWS.forEach(function (r, idx) {
      var purchased = VARIANT_TITLES[r.purchased] || PRODUCT_TITLE;
      html +=
        '<article class="jmr-review" data-idx="' + idx + '" data-rating="' + r.rating + '" data-tonnage="' + escapeHtml(r.tonnage) + '" data-seer2="' + escapeHtml(r.seer2) + '" data-ts="' + r.ts + '">' +
          '<div class="jmr-review-top">' +
            '<div class="jmr-avatar" aria-hidden="true">' + escapeHtml(r.initials) + '</div>' +
            '<div class="jmr-reviewer-meta">' +
              '<div class="jmr-reviewer-name-row">' +
                '<span class="jmr-reviewer-name">' + escapeHtml(r.name) + '</span>' +
                '<span class="jmr-vp-badge">' + VP_SVG + 'Verified Purchase</span>' +
              '</div>' +
              '<div class="jmr-purchase-line">Purchased: ' + escapeHtml(purchased) + '</div>' +
              '<div class="jmr-location-line">Installed in: ' + escapeHtml(r.loc) + '</div>' +
            '</div>' +
            '<div class="jmr-rating-date">' +
              '<div class="jmr-review-stars" aria-label="' + r.rating + ' out of 5 stars">' + starRow(r.rating) + '</div>' +
              '<div class="jmr-review-date">' + escapeHtml(r.date) + '</div>' +
            '</div>' +
          '</div>' +
          '<h4 class="jmr-review-title">' + escapeHtml(r.title) + '</h4>' +
          '<p class="jmr-review-body">' + escapeHtml(r.body) + '</p>' +
          '<div class="jmr-review-actions">' +
            '<button class="jmr-action-btn" type="button" data-action="helpful">' + HELPFUL_SVG + ' Helpful (' + r.helpful + ')</button>' +
            '<button class="jmr-action-btn" type="button" data-action="report">' + REPORT_SVG + ' Report</button>' +
          '</div>' +
        '</article>';
    });
    listEl.innerHTML = html;
  }

  renderCards();

  /* ────────────────────────── Sort + filter + pagination ────────────────────────── */

  var current = 1;
  var activeSort    = 'recent';   // 'recent' | 'rated'
  var activeRating  = null;
  var activeTonnage = null;
  var activeSeer    = null;

  function getFiltered() {
    var all = qsa('#jmr-' + sid + ' .jmr-review');
    var out = all.filter(function (r) {
      var rOk = activeRating  === null || parseInt(r.getAttribute('data-rating'), 10) === activeRating;
      var tOk = activeTonnage === null || r.getAttribute('data-tonnage') === activeTonnage;
      var sOk = activeSeer    === null || r.getAttribute('data-seer2')   === activeSeer;
      return rOk && tOk && sOk;
    });
    if (activeSort === 'rated') {
      out.sort(function (a, b) {
        var ra = parseInt(a.getAttribute('data-rating'), 10);
        var rb = parseInt(b.getAttribute('data-rating'), 10);
        if (rb !== ra) return rb - ra;
        return parseInt(b.getAttribute('data-ts'), 10) - parseInt(a.getAttribute('data-ts'), 10);
      });
    } else {
      out.sort(function (a, b) {
        return parseInt(b.getAttribute('data-ts'), 10) - parseInt(a.getAttribute('data-ts'), 10);
      });
    }
    return out;
  }

  function showPage(page) {
    var filtered = getFiltered();
    var total = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (page < 1) page = 1;
    if (page > total) page = total;
    current = page;

    /* Detach + reappend in sort order (so DOM matches active sort) */
    qsa('#jmr-' + sid + ' .jmr-review').forEach(function (r) { r.style.display = 'none'; });
    filtered.forEach(function (r) { listEl.appendChild(r); });
    filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach(function (r) { r.style.display = ''; });

    infoEl.textContent = 'Page ' + page + ' of ' + total;
    prevBtn.disabled = (page === 1);
    nextBtn.disabled = (page === total);
    emptyEl.style.display = filtered.length === 0 ? '' : 'none';
  }

  function updateToggleLabel() {
    var parts = [];
    if (activeRating  !== null) parts.push(activeRating + '★');
    if (activeTonnage !== null) parts.push(activeTonnage);
    if (activeSeer    !== null) parts.push(activeSeer);
    var lbl = toggleBtn.querySelector('.jmr-filters-toggle-label');
    if (parts.length === 0) {
      lbl.textContent = 'Filters';
      toggleBtn.classList.remove('has-filter');
      panel.classList.remove('has-active-filter');
    } else {
      lbl.textContent = parts.join(' · ');
      toggleBtn.classList.add('has-filter');
      panel.classList.add('has-active-filter');
    }
  }

  /* Filter panel toggle */
  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = !panel.hidden;
    panel.hidden = open;
    toggleBtn.setAttribute('aria-expanded', String(!open));
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
      panel.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* Sort tabs (Most Recent / Highest Rated) */
  qsa('#jmr-' + sid + ' .jmr-filter-btn:not(.jmr-filters-toggle)').forEach(function (btn) {
    btn.addEventListener('click', function () {
      qsa('#jmr-' + sid + ' .jmr-filter-btn:not(.jmr-filters-toggle)').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      activeSort = this.getAttribute('data-sort') || 'recent';
      panel.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
      showPage(1);
    });
  });

  /* Accordions inside filter panel */
  panel.querySelectorAll('.jmr-acc-header').forEach(function (hdr) {
    hdr.addEventListener('click', function (e) {
      e.stopPropagation();
      var body = document.getElementById(this.getAttribute('aria-controls'));
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      body.hidden = expanded;
    });
  });

  /* Rating filter */
  panel.querySelectorAll('[data-filter-rating]').forEach(function (opt) {
    opt.addEventListener('click', function () {
      panel.querySelectorAll('[data-filter-rating]').forEach(function (o) { o.classList.remove('active'); });
      this.classList.add('active');
      var val = this.getAttribute('data-filter-rating');
      activeRating = val === '' ? null : parseInt(val, 10);
      updateToggleLabel();
      showPage(1);
    });
  });
  /* Tonnage filter */
  panel.querySelectorAll('[data-filter-tonnage]').forEach(function (opt) {
    opt.addEventListener('click', function () {
      panel.querySelectorAll('[data-filter-tonnage]').forEach(function (o) { o.classList.remove('active'); });
      this.classList.add('active');
      var val = this.getAttribute('data-filter-tonnage');
      activeTonnage = val === '' ? null : val;
      updateToggleLabel();
      showPage(1);
    });
  });
  /* SEER2 filter */
  panel.querySelectorAll('[data-filter-seer2]').forEach(function (opt) {
    opt.addEventListener('click', function () {
      panel.querySelectorAll('[data-filter-seer2]').forEach(function (o) { o.classList.remove('active'); });
      this.classList.add('active');
      var val = this.getAttribute('data-filter-seer2');
      activeSeer = val === '' ? null : val;
      updateToggleLabel();
      showPage(1);
    });
  });

  /* Clear all filters */
  var clearAllBtn = $('jmr-clear-all-' + sid);
  clearAllBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    activeRating = null; activeTonnage = null; activeSeer = null;
    panel.querySelectorAll('.jmr-filter-option').forEach(function (o) { o.classList.remove('active'); });
    ['data-filter-rating', 'data-filter-tonnage', 'data-filter-seer2'].forEach(function (attr) {
      var all = panel.querySelector('[' + attr + '=""]');
      if (all) all.classList.add('active');
    });
    updateToggleLabel();
    showPage(1);
  });

  prevBtn.addEventListener('click', function () { showPage(current - 1); });
  nextBtn.addEventListener('click', function () { showPage(current + 1); });

  showPage(1);

  /* ────────────────────────── Helpful + Report (per-card) ────────────────────────── */

  var HELPFUL_KEY = 'jmr-helpful-' + sid;
  var REPORT_KEY  = 'jmr-report-'  + sid;
  var helpfulState = {};
  var reportState  = {};
  try { helpfulState = JSON.parse(localStorage.getItem(HELPFUL_KEY) || '{}'); } catch (e) {}
  try { reportState  = JSON.parse(localStorage.getItem(REPORT_KEY)  || '{}'); } catch (e) {}

  qsa('#jmr-' + sid + ' .jmr-review').forEach(function (review) {
    var idx = review.getAttribute('data-idx');
    var btns = review.querySelectorAll('.jmr-action-btn');
    if (btns.length < 2) return;
    var helpfulBtn = btns[0];
    var reportBtn  = btns[1];

    if (helpfulState[idx] !== undefined) {
      helpfulBtn.classList.add('jmr-helpful-voted');
      helpfulBtn.innerHTML = HELPFUL_SVG + ' Helpful (' + helpfulState[idx] + ')';
    }
    if (reportState[idx]) {
      reportBtn.classList.add('jmr-reported-done');
      reportBtn.innerHTML = CHECK_SVG_S + ' Reported';
    }

    helpfulBtn.addEventListener('click', function () {
      var match = this.textContent.match(/\((\d+)\)/);
      var count = match ? parseInt(match[1], 10) : 0;
      if (helpfulState[idx] !== undefined) {
        count = Math.max(0, count - 1);
        delete helpfulState[idx];
        this.classList.remove('jmr-helpful-voted');
      } else {
        count++;
        helpfulState[idx] = count;
        this.classList.add('jmr-helpful-voted');
      }
      this.innerHTML = HELPFUL_SVG + ' Helpful (' + count + ')';
      try { localStorage.setItem(HELPFUL_KEY, JSON.stringify(helpfulState)); } catch (e) {}
    });

    reportBtn.addEventListener('click', function () {
      if (reportState[idx]) return;
      openReportModal(idx, this);
    });
  });

  /* ────────────────────────── Report modal ────────────────────────── */

  var reportOverlay = $('jmr-report-overlay-' + sid);
  var reportCancel  = $('jmr-report-cancel-'  + sid);
  var reportSubmit  = $('jmr-report-submit-'  + sid);
  var activeReportIdx = null;
  var activeReportBtn = null;

  function openReportModal(idx, btn) {
    activeReportIdx = idx;
    activeReportBtn = btn;
    reportOverlay.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.checked = false;
      r.closest('.jmr-report-option').classList.remove('selected');
    });
    var suggested = reportOverlay.querySelector('input[value="spam"]');
    if (suggested) {
      suggested.checked = true;
      suggested.closest('.jmr-report-option').classList.add('selected');
    }
    reportSubmit.disabled = false;
    reportOverlay.removeAttribute('hidden');
  }
  function closeReportModal() {
    reportOverlay.setAttribute('hidden', '');
    activeReportIdx = null; activeReportBtn = null;
  }

  reportOverlay.querySelectorAll('input[type="radio"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      reportOverlay.querySelectorAll('.jmr-report-option').forEach(function (o) { o.classList.remove('selected'); });
      this.closest('.jmr-report-option').classList.add('selected');
      reportSubmit.disabled = false;
    });
  });
  reportCancel.addEventListener('click', closeReportModal);
  reportOverlay.addEventListener('click', function (e) { if (e.target === reportOverlay) closeReportModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !reportOverlay.hidden) closeReportModal();
  });
  reportSubmit.addEventListener('click', function () {
    if (activeReportIdx === null || !activeReportBtn) return;
    reportState[activeReportIdx] = true;
    try { localStorage.setItem(REPORT_KEY, JSON.stringify(reportState)); } catch (e) {}
    activeReportBtn.classList.add('jmr-reported-done');
    activeReportBtn.innerHTML = CHECK_SVG_S + ' Reported';
    closeReportModal();
  });

  /* ────────────────────────── Write Review Modal ────────────────────────── */

  var wrOverlay = $('jmr-wr-overlay-' + sid);
  var wrOpen    = $('jmr-wr-open-'    + sid);
  var wrClose   = $('jmr-wr-close-'   + sid);
  var wrCancel  = $('jmr-wr-cancel-'  + sid);
  var wrSubmit  = $('jmr-wr-submit-'  + sid);
  var wrBody    = $('jmr-wr-body-'    + sid);
  var wrFooter  = $('jmr-wr-footer-'  + sid);
  var wrSuccess = $('jmr-wr-success-' + sid);
  var wrError   = $('jmr-wr-error-'   + sid);
  var wrName    = $('jmr-wr-name-'    + sid);
  var wrEmail   = $('jmr-wr-email-'   + sid);
  var wrTitle   = $('jmr-wr-review-title-' + sid);
  var wrBodyTxt = $('jmr-wr-body-txt-' + sid);

  function openWriteModal() {
    wrOverlay.removeAttribute('hidden');
    wrSuccess.style.display = 'none';
    wrBody.style.display = '';
    wrFooter.style.display = '';
    wrError.style.display = 'none';
    wrError.textContent = '';
    wrSubmit.disabled = false;
    wrSubmit.textContent = 'Submit Review';
    if (wrName) wrName.focus();
  }
  function closeWriteModal() { wrOverlay.setAttribute('hidden', ''); }

  wrOpen.addEventListener('click', openWriteModal);
  wrClose.addEventListener('click', closeWriteModal);
  wrCancel.addEventListener('click', closeWriteModal);
  wrOverlay.addEventListener('click', function (e) { if (e.target === wrOverlay) closeWriteModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !wrOverlay.hidden) closeWriteModal();
  });

  function showWrErr(msg) {
    wrError.textContent = msg;
    wrError.style.display = 'block';
  }

  wrSubmit.addEventListener('click', function () {
    var rating = (wrOverlay.querySelector('input[name="jmr-wr-rating-' + sid + '"]:checked') || {}).value;
    var name   = wrName    ? wrName.value.trim()   : '';
    var email  = wrEmail   ? wrEmail.value.trim()  : '';
    var body   = wrBodyTxt ? wrBodyTxt.value.trim(): '';

    wrError.style.display = 'none';
    if (!rating)                                          { showWrErr('Please select a star rating.'); return; }
    if (!name)                                            { showWrErr('Please enter your name.'); return; }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email))   { showWrErr('Please enter a valid email address.'); return; }
    if (!body)                                            { showWrErr('Please write your review.'); return; }

    wrSubmit.disabled = true;
    wrSubmit.textContent = 'Submitting…';

    /* Static preview: no backend call. In the real Shopify section this POSTs
       to https://judge.me/api/v1/reviews — see judgeme-reviews-section.liquid. */
    setTimeout(function () {
      wrBody.style.display = 'none';
      wrFooter.style.display = 'none';
      wrSuccess.style.display = 'block';
    }, 500);
  });

  /* ────────────────────────── Photo lightbox ────────────────────────── */

  var lbOverlay = $('jmr-lb-overlay-' + sid);
  var lbImg     = $('jmr-lb-img-'     + sid);
  var lbClose   = $('jmr-lb-close-'   + sid);
  var lbPrev    = $('jmr-lb-prev-'    + sid);
  var lbNext    = $('jmr-lb-next-'    + sid);
  var lbCounter = $('jmr-lb-counter-' + sid);
  var lbIndex   = 0;

  function renderLbFrame(i) {
    var p = PHOTO_TILES[i];
    lbImg.style.background = p.grad;
    lbImg.textContent = p.more;
    lbCounter.textContent = (i + 1) + ' / ' + PHOTO_TILES.length;
  }
  function openLightbox(i) {
    if (!PHOTO_TILES.length) return;
    lbIndex = Math.max(0, Math.min(i, PHOTO_TILES.length - 1));
    renderLbFrame(lbIndex);
    lbPrev.hidden = (PHOTO_TILES.length <= 1);
    lbNext.hidden = (PHOTO_TILES.length <= 1);
    lbOverlay.removeAttribute('hidden');
    lbClose.focus();
  }
  function closeLightbox() { lbOverlay.setAttribute('hidden', ''); }
  function lbGo(dir) {
    lbIndex = (lbIndex + dir + PHOTO_TILES.length) % PHOTO_TILES.length;
    renderLbFrame(lbIndex);
  }

  qsa('#jmr-' + sid + ' .jmr-photo-tile').forEach(function (tile, i) {
    tile.addEventListener('click', function () { openLightbox(i); });
    tile.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });
  var moreBtn = document.querySelector('#jmr-' + sid + ' .jmr-photo-more');
  if (moreBtn) moreBtn.addEventListener('click', function () { openLightbox(0); });
  var viewAll = $('jmr-view-all-photos');
  if (viewAll) viewAll.addEventListener('click', function (e) { e.preventDefault(); openLightbox(0); });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  function () { lbGo(-1); });
  lbNext.addEventListener('click',  function () { lbGo(1); });
  lbOverlay.addEventListener('click', function (e) { if (e.target === lbOverlay) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (lbOverlay.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });
})();
