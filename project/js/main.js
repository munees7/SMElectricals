/* ==========================================================================
   SM Electrical — main.js
   Handles: sticky header, mobile navigation, scroll-to-top button,
   active navigation highlighting, scroll reveal animations, FAQ accordion.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initStickyHeader();
    initMobileNav();
    initScrollTop();
    initActiveNav();
    initScrollReveal();
    initFaqAccordion();
    initCurrentYear();
    initServiceFilters();
  });

  /* -----------------------------------------
     Service category filter (Services page)
  ----------------------------------------- */
  function initServiceFilters() {
    var filterButtons = document.querySelectorAll('.service-category-nav .category-btn');
    var serviceCards = document.querySelectorAll('.services-page-grid .service-card');
    if (!filterButtons.length || !serviceCards.length) return;

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');

        filterButtons.forEach(function (btn) {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');

        serviceCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          if (filter === 'all' || filter === category) {
            card.hidden = false;
          } else {
            card.hidden = true;
          }
        });
      });
    });
  }

  /* -----------------------------------------
     Sticky header shadow on scroll
  ----------------------------------------- */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function toggleShadow() {
      if (window.scrollY > 8) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    toggleShadow();
    window.addEventListener('scroll', toggleShadow, { passive: true });
  }

  /* -----------------------------------------
     Mobile navigation menu
  ----------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    var backdrop = document.querySelector('.nav-backdrop');
    if (!toggle || !nav) return;

    function closeNav() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function openNav() {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeNav);
    }

    // Close nav when a link is clicked (mobile)
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* -----------------------------------------
     Scroll to top button
  ----------------------------------------- */
  function initScrollTop() {
    var btn = document.querySelector('.scroll-top');
    if (!btn) return;

    function toggleVisibility() {
      if (window.scrollY > 480) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -----------------------------------------
     Highlight active nav link based on current page or scroll position
  ----------------------------------------- */
  function initActiveNav() {
    var links = document.querySelectorAll('.nav-link');
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // On services.html just highlight by filename
    if (currentPage === 'services.html') {
      links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === 'services.html') {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        }
      });
      return;
    }

    // On index.html — use Intersection Observer to highlight by section in view
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: mark Home active
      links.forEach(function (link) {
        if (link.getAttribute('data-section') === 'home') {
          link.classList.add('is-active');
        }
      });
      return;
    }

    function setActiveSection(id) {
      links.forEach(function (link) {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
        var section = link.getAttribute('data-section');
        var href = link.getAttribute('href');
        // match by data-section attribute or by href anchor
        if (
          section === id ||
          href === '#' + id ||
          (id === 'home' && (href === '#' || href === '#home' || href === 'index.html'))
        ) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        }
      });
    }

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* -----------------------------------------
     Scroll reveal via Intersection Observer
  ----------------------------------------- */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -----------------------------------------
     FAQ Accordion
  ----------------------------------------- */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = question.getAttribute('aria-expanded') === 'true';

        // Close all other items
        faqItems.forEach(function (other) {
          var otherQuestion = other.querySelector('.faq-question');
          var otherAnswer = other.querySelector('.faq-answer');
          if (other !== item) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.style.maxHeight = null;
          }
        });

        if (isOpen) {
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* -----------------------------------------
     Auto-update footer copyright year
  ----------------------------------------- */
  function initCurrentYear() {
    var yearEl = document.querySelector('#current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }
})();
