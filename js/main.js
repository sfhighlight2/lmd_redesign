// ============ MOBILE NAV ============
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
navToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', false);
}));

// ============ NAV DROPDOWN (Services) ============
const navDropdownToggle = document.getElementById('services-dropdown-toggle');
const navDropdownItem = navDropdownToggle?.closest('.nav-item');
if (navDropdownToggle && navDropdownItem) {
  navDropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = navDropdownItem.classList.toggle('open');
    navDropdownToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if (!navDropdownItem.contains(e.target)) {
      navDropdownItem.classList.remove('open');
      navDropdownToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

// ============ FAQ ACCORDION ============
function setFaqHeight(item, open) {
  const answer = item.querySelector('.faq-a');
  const btn = item.querySelector('.faq-q');
  if (!answer || !btn) return;
  answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
  btn.setAttribute('aria-expanded', String(open));
  item.classList.toggle('open', open);
}
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach(i => setFaqHeight(i, false));
    if (!isOpen) setFaqHeight(item, true);
  });
});
// Open the first FAQ item by default (matches the .open class already on it in HTML)
const initialFaqOpen = document.querySelector('.faq-item.open');
if (initialFaqOpen) setFaqHeight(initialFaqOpen, true);
// Recalculate open answer height on resize (font/line-wrap can change scrollHeight)
window.addEventListener('resize', () => {
  const openItem = document.querySelector('.faq-item.open');
  if (openItem) setFaqHeight(openItem, true);
});

// ============ HERO AI VISIBILITY SEARCH ============
const heroSearchForm = document.getElementById('hero-search-form');
heroSearchForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('hero-search-input');
  let url = input.value.trim();
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  window.location.href = `get-report.html?url=${encodeURIComponent(url)}`;
});

// ============ LEAD FORM (get-report.html) ============
const leadForm = document.getElementById('lead-form');
if (leadForm) {
  const websiteField = document.getElementById('lf-website');
  const params = new URLSearchParams(window.location.search);
  const carriedUrl = params.get('url');
  if (carriedUrl && websiteField) websiteField.value = carriedUrl;

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('lf-first-name').value.trim();
    const lastName = document.getElementById('lf-last-name').value.trim();
    const name = `${firstName} ${lastName}`.trim();
    const email = document.getElementById('lf-email').value.trim();
    const phone = document.getElementById('lf-phone').value.trim();
    const business = document.getElementById('lf-business').value.trim();
    const website = websiteField.value.trim();
    const subject = encodeURIComponent('New AI Visibility Report Request');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nBusiness: ${business}\nWebsite: ${website}`
    );
    window.location.href = `mailto:letschat@livemediadigital.com?subject=${subject}&body=${body}`;
  });
}

// ============ HERO CURSOR SPOTLIGHT ============
const heroDark = document.getElementById('hero-dark');
const heroSpotlight = document.getElementById('hero-spotlight');
if (heroDark && heroSpotlight && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let rafPending = false;
  let lastX = 50, lastY = 30;
  heroDark.addEventListener('pointermove', (e) => {
    const rect = heroDark.getBoundingClientRect();
    lastX = ((e.clientX - rect.left) / rect.width) * 100;
    lastY = ((e.clientY - rect.top) / rect.height) * 100;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        heroSpotlight.style.setProperty('--mx', lastX + '%');
        heroSpotlight.style.setProperty('--my', lastY + '%');
        rafPending = false;
      });
    }
  });
}

// ============ TEAM CARDS CAROUSEL ============
const teamTrack = document.getElementById('team-cards-track');
const teamPrev = document.getElementById('team-prev');
const teamNext = document.getElementById('team-next');
if (teamTrack && teamPrev && teamNext) {
  const teamGap = 16;
  function teamCardStep() {
    const card = teamTrack.querySelector('.team-card');
    return card ? card.getBoundingClientRect().width + teamGap : 240;
  }
  function updateTeamArrows() {
    const max = teamTrack.scrollWidth - teamTrack.clientWidth - 2;
    teamPrev.disabled = teamTrack.scrollLeft <= 2;
    teamNext.disabled = teamTrack.scrollLeft >= max;
  }
  teamPrev.addEventListener('click', () => teamTrack.scrollBy({ left: -teamCardStep(), behavior: 'smooth' }));
  teamNext.addEventListener('click', () => teamTrack.scrollBy({ left: teamCardStep(), behavior: 'smooth' }));
  teamTrack.addEventListener('scroll', () => requestAnimationFrame(updateTeamArrows), { passive: true });
  window.addEventListener('resize', updateTeamArrows);
  updateTeamArrows();
}

// ============ CLIENT RESULTS: QUOTE SPOTLIGHT (autoplay carousel) ============
const qsRoot = document.getElementById('quote-spotlight');
if (qsRoot) {
  const qsSlides = qsRoot.querySelectorAll('.qs-slide');
  const qsAuthors = qsRoot.querySelectorAll('.qs-author');
  const qsPeople = qsRoot.querySelectorAll('.qs-person');
  const qsProgressBar = document.getElementById('qs-progress-bar');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = qsSlides.length;
  let current = 0;
  let timer = null;

  function goTo(index) {
    current = index;
    qsSlides.forEach(s => s.classList.toggle('is-active', s.dataset.index === String(index)));
    qsAuthors.forEach(a => a.classList.toggle('is-active', a.dataset.index === String(index)));
    qsPeople.forEach(p => {
      const active = p.dataset.index === String(index);
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-selected', active);
    });
    if (qsProgressBar && !reduceMotion) {
      qsProgressBar.classList.remove('is-animating');
      void qsProgressBar.offsetWidth;
      qsProgressBar.classList.add('is-animating');
    }
  }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = setInterval(() => goTo((current + 1) % total), 6000);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  qsPeople.forEach(p => p.addEventListener('click', () => { goTo(Number(p.dataset.index)); startAutoplay(); }));
  qsRoot.addEventListener('mouseenter', stopAutoplay);
  qsRoot.addEventListener('mouseleave', startAutoplay);
  qsRoot.addEventListener('focusin', stopAutoplay);
  qsRoot.addEventListener('focusout', startAutoplay);

  goTo(0);
  startAutoplay();
}

// ============ COOKIE BANNER ============
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookies = document.getElementById('accept-cookies');
const openCookieSettings = document.getElementById('open-cookie-settings');
if (!localStorage.getItem('lmd-cookie-consent')) {
  setTimeout(() => cookieBanner?.classList.add('show'), 1200);
}
acceptCookies?.addEventListener('click', () => {
  localStorage.setItem('lmd-cookie-consent', 'true');
  cookieBanner?.classList.remove('show');
});
openCookieSettings?.addEventListener('click', () => cookieBanner?.classList.add('show'));

// ============ FLOATING CONTACT BUBBLE ============
const floatContact = document.getElementById('float-contact');
const floatContactToggle = document.getElementById('float-contact-toggle');
if (floatContact && floatContactToggle) {
  floatContactToggle.addEventListener('click', () => {
    const isOpen = floatContact.classList.toggle('open');
    floatContactToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if (!floatContact.contains(e.target)) {
      floatContact.classList.remove('open');
      floatContactToggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      floatContact.classList.remove('open');
      floatContactToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============ EXIT-INTENT / MOBILE LEAD POPUP ============
const exitPopup = document.getElementById('exit-popup');
if (exitPopup) {
  const exitPopupBackdrop = document.getElementById('exit-popup-backdrop');
  const exitPopupClose = document.getElementById('exit-popup-close');
  const exitPopupForm = document.getElementById('exit-popup-form');
  const EXIT_POPUP_KEY = 'lmd-exit-popup-shown';
  let popupShown = sessionStorage.getItem(EXIT_POPUP_KEY) === 'true';

  function showExitPopup() {
    if (popupShown) return;
    popupShown = true;
    sessionStorage.setItem(EXIT_POPUP_KEY, 'true');
    exitPopup.hidden = false;
    document.body.style.overflow = 'hidden';
    exitPopupClose?.focus();
  }
  function hideExitPopup() {
    exitPopup.hidden = true;
    document.body.style.overflow = '';
  }
  exitPopupBackdrop?.addEventListener('click', hideExitPopup);
  exitPopupClose?.addEventListener('click', hideExitPopup);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !exitPopup.hidden) hideExitPopup();
  });

  // Desktop exit-intent: cursor leaves toward the top of the viewport
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && e.clientY <= 0) showExitPopup();
  });

  // Mobile "tap" equivalent: a deliberate upward scroll after the visitor
  // has already read well into the page (a reasonable proxy for exit intent
  // on touch devices, which have no cursor to track).
  let maxScrollDepth = 0;
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const depth = scrollable > 0 ? y / scrollable : 0;
    maxScrollDepth = Math.max(maxScrollDepth, depth);
    if (maxScrollDepth > 0.5 && lastScrollY - y > 60) showExitPopup();
    lastScrollY = y;
  }, { passive: true });

  exitPopupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('ep-first-name').value.trim();
    const lastName = document.getElementById('ep-last-name').value.trim();
    const name = `${firstName} ${lastName}`.trim();
    const email = document.getElementById('ep-email').value.trim();
    const phone = document.getElementById('ep-phone').value.trim();
    const business = document.getElementById('ep-business').value.trim();
    const subject = encodeURIComponent('New Lead from Exit Popup');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nBusiness: ${business}`);
    window.location.href = `mailto:letschat@livemediadigital.com?subject=${subject}&body=${body}`;
    hideExitPopup();
  });
}

// ============ FOOTER YEAR ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ HEADER SHADOW ON SCROLL ============
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });
