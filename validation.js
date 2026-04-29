/* SecureAI - Shared Script
   Hamburger menu, search dropdown, scroll fade-in, animated counters */

(function () {
  /* HAMBURGER MENU */
  function setupHamburger() {
    const ham = document.getElementById('hamburgerBtn');
    if (!ham) return;
    const navList = document.querySelector('header nav ul');
    if (!navList) return;
    ham.addEventListener('click', () => {
      navList.classList.toggle('mobile-open');
      ham.classList.toggle('active');
    });
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navList.classList.remove('mobile-open');
        ham.classList.remove('active');
      });
    });
  }

  /* SEARCH DROPDOWN */
  const SITE_INDEX = [
    { title: 'Home', url: 'index.html', tags: ['home','overview','secureai','dashboard'] },
    { title: 'About Us', url: 'about.html', tags: ['about','mission','team','company'] },
    { title: 'AI in Threat Detection', url: 'threat-detection.html', tags: ['threat','detection','behaviour','anomaly','machine learning','automated','malware'] },
    { title: 'AI vs Cybercrime', url: 'ai-vs-cybercrime.html', tags: ['fraud','phishing','deepfake','cybercrime','criminal'] },
    { title: 'Contact Us', url: 'contact.html', tags: ['contact','email','support','help'] },
    { title: 'Login / Signup', url: 'login.html', tags: ['login','signup','account','sign in'] }
  ];

  function setupSearch() {
    const inputs = document.querySelectorAll('.nav-right input, .index-nav-right input');
    inputs.forEach(input => {
      const wrapper = document.createElement('div');
      wrapper.className = 'search-wrapper';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      const dropdown = document.createElement('div');
      dropdown.className = 'search-dropdown';
      wrapper.appendChild(dropdown);

      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { dropdown.classList.remove('open'); dropdown.innerHTML = ''; return; }
        const matches = SITE_INDEX.filter(item =>
          item.title.toLowerCase().includes(q) || item.tags.some(t => t.includes(q))
        );
        if (!matches.length) {
          dropdown.innerHTML = '<div class="search-empty">No results for "' + escapeHtml(q) + '"</div>';
        } else {
          dropdown.innerHTML = matches.map(m =>
            `<a href="${m.url}" class="search-result"><i class="fa-solid fa-arrow-right"></i><span>${m.title}</span></a>`
          ).join('');
        }
        dropdown.classList.add('open');
      });
      input.addEventListener('blur', () => { setTimeout(() => dropdown.classList.remove('open'), 150); });
      input.addEventListener('focus', () => { if (input.value.trim()) dropdown.classList.add('open'); });
    });
  }
  function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  /* SCROLL FADE-IN */
  function setupFadeIn() {
    const els = document.querySelectorAll('.fade-in, [data-fade]');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
  }

  /* ANIMATED COUNTERS */
  function setupCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (!e.isIntersecting) return; animateCounter(e.target); obs.unobserve(e.target); });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupHamburger();
    setupSearch();
    setupFadeIn();
    setupCounters();
  });
})();
