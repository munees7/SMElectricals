/* ==========================================================================
   SM Electrical — gallery.js
   Handles: gallery filter buttons and lightbox viewer.
   Runs only on pages that contain a .gallery-grid element.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    initGalleryFilters();
    initLightbox();
  });

  /* -----------------------------------------
     Filter buttons
  ----------------------------------------- */
  function initGalleryFilters() {
    var filterButtons = document.querySelectorAll('.gallery-filters .category-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');
    if (!filterButtons.length) return;

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');

        filterButtons.forEach(function (btn) {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');

        galleryItems.forEach(function (item) {
          var category = item.getAttribute('data-category');
          if (filter === 'all' || filter === category) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* -----------------------------------------
     Lightbox
  ----------------------------------------- */
  function initLightbox() {
    var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox || !galleryItems.length) return;

    var lightboxImg = lightbox.querySelector('.lightbox-content img');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var currentIndex = 0;
    var lastFocusedEl = null;

    function getVisibleItems() {
      return galleryItems.filter(function (item) {
        return !item.classList.contains('is-hidden');
      });
    }

    function openLightbox(item) {
      var visibleItems = getVisibleItems();
      currentIndex = visibleItems.indexOf(item);
      lastFocusedEl = document.activeElement;
      updateLightboxImage(visibleItems);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedEl) lastFocusedEl.focus();
    }

    function updateLightboxImage(visibleItems) {
      var list = visibleItems || getVisibleItems();
      var item = list[currentIndex];
      if (!item) return;
      var img = item.querySelector('img');
      var captionText = item.getAttribute('data-caption') || (img ? img.alt : '');
      lightboxImg.src = img.getAttribute('src');
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = captionText;
    }

    function showNext() {
      var list = getVisibleItems();
      currentIndex = (currentIndex + 1) % list.length;
      updateLightboxImage(list);
    }

    function showPrev() {
      var list = getVisibleItems();
      currentIndex = (currentIndex - 1 + list.length) % list.length;
      updateLightboxImage(list);
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        openLightbox(item);
      });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }
})();
