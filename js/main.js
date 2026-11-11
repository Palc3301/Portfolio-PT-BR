(function () {
  var root = document.documentElement;

  /* ---------- Idioma (PT / EN) ---------- */
  var meta = {
    pt: {
      title: 'Pedro Arruda — SDET | QA Automation Engineer',
      description: 'Pedro Arruda — SDET e QA Automation Engineer especializado em testes de API, integração e E2E em Java para sistemas financeiros de grande escala.',
      status: { running: 'executando', done: 'aprovado' }
    },
    en: {
      title: 'Pedro Arruda — SDET | QA Automation Engineer',
      description: 'Pedro Arruda — SDET and QA Automation Engineer specialized in API, integration and E2E test automation in Java for large-scale financial systems.',
      status: { running: 'running', done: 'passed' }
    }
  };

  var buttons = document.querySelectorAll('[data-set-lang]');
  var descTag = document.querySelector('meta[name="description"]');

  function applyLang(lang, persist) {
    root.setAttribute('data-current', lang);
    root.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = meta[lang].title;
    if (descTag) descTag.setAttribute('content', meta[lang].description);
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    });
    if (persist) {
      try { localStorage.setItem('lang', lang); } catch (e) { }
      try {
        var url = new URL(location.href);
        url.searchParams.set('lang', lang);
        history.replaceState(null, '', url);
      } catch (e) { }
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      applyLang(b.getAttribute('data-set-lang'), true);
    });
  });

  applyLang(root.getAttribute('data-current') === 'pt' ? 'pt' : 'en', false);

  /* ---------- Cabeçalho com borda ao rolar ---------- */
  var header = document.querySelector('.header');
  var bar = document.querySelector('.progress span');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    // Destaca no menu a seção visível
    var line = window.innerHeight * 0.35, active = -1;
    targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) active = i; });
    links.forEach(function (a, i) { a.classList.toggle('is-active', i === active); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Execução do cenário Gherkin no hero ---------- */
  var suite = document.querySelector('.suite');
  if (suite) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var steps = suite.querySelectorAll('.suite-code');
    var count = 0;
    steps.forEach(function (code) {
      count = Math.max(count, code.querySelectorAll('.step').length);
    });

    function setStatus(key) {
      suite.querySelectorAll('.suite-status [data-lang]').forEach(function (el) {
        el.textContent = meta[el.getAttribute('data-lang')].status[key];
      });
    }

    function pass(i) {
      steps.forEach(function (code) {
        var s = code.querySelectorAll('.step')[i];
        if (s) s.classList.add('passed');
      });
    }

    function finish() {
      suite.classList.add('is-done');
      setStatus('done');
    }

    if (reduce) {
      for (var i = 0; i < count; i++) pass(i);
      finish();
    } else {
      var i2 = 0;
      var timer = setInterval(function () {
        pass(i2);
        i2++;
        if (i2 >= count) {
          clearInterval(timer);
          setTimeout(finish, 350);
        }
      }, 520);
    }
  }

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
