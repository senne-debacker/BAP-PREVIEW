// Stap voor stap door de journey. De adresbalk onthoudt de plek: #stap-3 of #alles.
(function () {
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var steps = [].slice.call(document.querySelectorAll('.step'));
  var thumbs = [].slice.call(document.querySelectorAll('.th'));
  if (!steps.length) return;
  var cur = 0;

  function go(i) { location.hash = '#stap-' + (i + 1); }

  function showStep(i) {
    cur = i;
    steps.forEach(function (s, k) { s.classList.toggle('nu', k === i); });
    thumbs.forEach(function (t, k) {
      if (k === i) {
        t.setAttribute('aria-current', 'step');
        t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      } else {
        t.removeAttribute('aria-current');
      }
    });
    $('teller').textContent = (i + 1) + ' / ' + steps.length;
    $('vorige').disabled = i === 0;
    $('volgende').disabled = i === steps.length - 1;
  }

  function route() {
    var hash = location.hash;
    var alles = hash === '#alles';
    root.classList.toggle('alles', alles);
    root.classList.toggle('stap', !alles);
    $('modusAlles').setAttribute('aria-pressed', String(alles));
    $('modusStap').setAttribute('aria-pressed', String(!alles));
    if (!alles) {
      var m = /^#stap-(\d+)$/.exec(hash);
      var i = m ? Number(m[1]) - 1 : cur;
      showStep(steps[i] ? i : 0);
    }
    window.scrollTo(0, 0);
  }

  $('modusStap').addEventListener('click', function () { go(cur); });
  $('modusAlles').addEventListener('click', function () { location.hash = '#alles'; });
  $('vorige').addEventListener('click', function () { if (cur > 0) go(cur - 1); });
  $('volgende').addEventListener('click', function () { if (cur < steps.length - 1) go(cur + 1); });

  // Klik op het scherm: volgende stap. Na de laatste terug naar het begin.
  steps.forEach(function (s) {
    s.querySelector('.scherm').addEventListener('click', function () {
      if (root.classList.contains('stap')) go(cur < steps.length - 1 ? cur + 1 : 0);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (!root.classList.contains('stap') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight' && cur < steps.length - 1) go(cur + 1);
    if (e.key === 'ArrowLeft' && cur > 0) go(cur - 1);
  });

  window.addEventListener('hashchange', route);
  route();
})();
