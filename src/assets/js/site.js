(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav-links');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); btn && btn.setAttribute('aria-expanded', 'false'); } });

  function setTopic(topic, about) {
    document.querySelectorAll('.contact-form').forEach(function (f) {
      var s = f.querySelector('.f-topic');
      if (topic && s) for (var i = 0; i < s.options.length; i++) if (s.options[i].text === topic) s.selectedIndex = i;
      if (about && f.elements['message'] && !f.elements['message'].value) f.elements['message'].value = "I'm interested in " + about + ". ";
    });
  }
  // Buttons like "Talk about investing" preselect the form topic
  document.querySelectorAll('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () { setTopic(a.getAttribute('data-topic')); });
  });
  // Links from project pages: /?topic=...&about=...#contact
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('topic') || q.get('about')) setTopic(q.get('topic'), q.get('about'));
  } catch (e) {}

  // Contact form: sends to Netlify (which emails you), stays on the page
  document.querySelectorAll('.contact-form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      var done = f.querySelector('.form-done');
      if (!f.elements['name'].value.trim() || !f.elements['email'].value.trim()) {
        e.preventDefault();
        done.textContent = 'Please add your name and email so we can reply.'; done.classList.add('show'); return;
      }
      if (!window.fetch || !window.URLSearchParams) return; // normal submit fallback
      e.preventDefault();
      var b = f.querySelector('button[type=submit]'); if (b) b.disabled = true;
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          done.textContent = done.getAttribute('data-success'); done.classList.add('show'); f.reset();
        })
        .catch(function () { f.submit(); })
        .finally(function () { if (b) b.disabled = false; });
    });
  });

  // Project filters
  var chips = document.querySelectorAll('.filters .chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('on', x === c); });
      var v = c.getAttribute('data-filter');
      document.querySelectorAll('#all-projects .proj').forEach(function (p) {
        p.hidden = !!v && p.getAttribute('data-status') !== v;
      });
    });
  });

  // Photo gallery viewer
  var lb = document.querySelector('.lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  if (lb && items.length && lb.showModal) {
    var img = lb.querySelector('img'), cap = lb.querySelector('.lb-cap'), idx = 0;
    function show(i) {
      idx = (i + items.length) % items.length;
      img.src = items[idx].getAttribute('data-full');
      cap.textContent = items[idx].getAttribute('data-caption') || '';
    }
    items.forEach(function (it, i) { it.addEventListener('click', function () { show(i); lb.showModal(); }); });
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.open) return;
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
