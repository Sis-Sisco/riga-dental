(function () {
  'use strict';

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Header shadow on scroll
  var header = document.getElementById('header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Lightbox
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
  document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.parentElement.classList.contains('empty')) return;
      lbImg.src = btn.getAttribute('data-lightbox');
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });
  lb.addEventListener('click', function (e) { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  // Booking form -> opens Telegram with a ready message
  var form = document.getElementById('bookForm');
  var hint = document.getElementById('formHint');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var ok = true;
    [form.name, form.phone].forEach(function (f) {
      var bad = !f.value.trim();
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { hint.textContent = 'Please enter your name and phone number.'; return; }

    var msg = 'Appointment request - Riga Speciality Dental Center\n' +
      'Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      'Service: ' + form.service.value +
      (form.message.value.trim() ? '\nMessage: ' + form.message.value.trim() : '');

    // Copy as a fallback in case Telegram doesn't prefill the text
    if (navigator.clipboard) { navigator.clipboard.writeText(msg).catch(function () {}); }
    window.open('https://t.me/Painkiller38?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    hint.textContent = 'Telegram opened. If your message is empty, just paste it (it was copied for you).';
  });
})();