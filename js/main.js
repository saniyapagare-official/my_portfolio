/* ------------------------------------------------------------------
   1. Original behaviour (menu + years)
------------------------------------------------------------------ */
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-navigation');
const currentYear = document.querySelector('#year');
const footerYear = document.querySelector('.current-year');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });
}

/* ------------------------------------------------------------------
   2. Indian traditional decor: inject the motif SVGs into every
      [data-ind] placeholder. Keeps the HTML light + easy to extend.
------------------------------------------------------------------ */
const IND_MOTIFS = {
  mandala: '<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><use href="#ind-mandala"></use></svg>',
  paisley: '<svg viewBox="0 0 120 160" aria-hidden="true" focusable="false"><use href="#ind-paisley"></use></svg>',
  corner: '<svg viewBox="0 0 140 140" aria-hidden="true" focusable="false"><use href="#ind-corner"></use></svg>',
  arch: '<svg viewBox="0 0 300 380" aria-hidden="true" focusable="false"><use href="#ind-arch"></use></svg>',
  lotus: '<svg viewBox="0 0 140 90" aria-hidden="true" focusable="false"><use href="#ind-lotus"></use></svg>',
  diya: '<svg viewBox="0 0 90 70" aria-hidden="true" focusable="false"><use href="#ind-diya"></use></svg>'
};

document.querySelectorAll('[data-ind]').forEach((slot) => {
  const motif = IND_MOTIFS[slot.dataset.ind];
  if (motif) {
    slot.innerHTML = motif;
  }
});

/* ------------------------------------------------------------------
   3. Reveal the decor softly the first time a section enters view
      (purely cosmetic, respects reduced-motion).
------------------------------------------------------------------ */
const decorLayers = document.querySelectorAll('.ind-layer');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  decorLayers.forEach((layer) => {
    layer.style.opacity = '0';
    layer.style.transition = 'opacity 900ms ease';
  });

  const revealDecor = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  };

  const decorObserver = new IntersectionObserver(revealDecor, { threshold: 0.05 });
  decorLayers.forEach((layer) => decorObserver.observe(layer));
}

document.querySelectorAll('a[data-category]').forEach(link => {
  link.addEventListener('click', function () {
    if (typeof posthog === 'object') {
      posthog.capture('social_link_clicked', {
        category: this.dataset.category,
        link_name: this.dataset.name
      });
    }
  });
});

/* ------------------------------------------------------------------
   4. Nav ribbon: add a solid background to the header once the page
      has been scrolled, so page text never shows through the nav links.
------------------------------------------------------------------ */
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}
