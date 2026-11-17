/* FORSAZH / RACING REDESIGN
   Подключить ПОСЛЕ существующего js/app.js. Не заменяет и не меняет его логику. */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Необычная гоночная кнопка прокрутки наверх.
  const topButton = document.createElement('button');
  topButton.type = 'button';
  topButton.className = 'race-back-to-top';
  topButton.setAttribute('aria-label', 'Прокрутить страницу наверх');
  topButton.innerHTML = '<span class="race-flag" aria-hidden="true">▦</span><span class="race-top-label">НАВЕРХ</span>';
  document.body.appendChild(topButton);
  const updateTopButton = () => topButton.classList.toggle('is-visible', window.scrollY > 320);
  window.addEventListener('scroll', updateTopButton, { passive: true });
  updateTopButton();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Подсветка текущей страницы в общей навигации.
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    const target = (link.getAttribute('href') || '').split('?')[0].toLowerCase();
    if (target && target === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  // Плавное появление секций и карточек при прокрутке.
  const candidates = document.querySelectorAll(
    'main > .row, main > section, main > .card, main .program-item, main .accordion, main .table-responsive'
  );
  candidates.forEach((element, index) => {
    element.classList.add('js-reveal');
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  });

  if (!('IntersectionObserver' in window)) {
    candidates.forEach(element => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  candidates.forEach(element => observer.observe(element));
});
