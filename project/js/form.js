/* ==========================================================================
   SM Electrical — form.js
   Handles: contact form client-side validation and mock submission.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('#contact-form');
    if (!form) return;

    var successMessage = document.querySelector('.form-success');

    var fields = {
      name: {
        input: form.querySelector('#name'),
        error: form.querySelector('#name-error'),
        validate: function (value) {
          if (!value.trim()) return 'Please enter your full name.';
          if (value.trim().length < 3) return 'Name must be at least 3 characters.';
          return '';
        }
      },
      phone: {
        input: form.querySelector('#phone'),
        error: form.querySelector('#phone-error'),
        validate: function (value) {
          var digitsOnly = value.replace(/\D/g, '');
          if (!value.trim()) return 'Please enter your phone number.';
          if (digitsOnly.length < 10) return 'Enter a valid 10-digit phone number.';
          return '';
        }
      },
      email: {
        input: form.querySelector('#email'),
        error: form.querySelector('#email-error'),
        validate: function (value) {
          if (!value.trim()) return 'Please enter your email address.';
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value.trim())) return 'Enter a valid email address.';
          return '';
        }
      },
      service: {
        input: form.querySelector('#service'),
        error: form.querySelector('#service-error'),
        validate: function (value) {
          if (!value) return 'Please select a service.';
          return '';
        }
      },
      message: {
        input: form.querySelector('#message'),
        error: form.querySelector('#message-error'),
        validate: function (value) {
          if (!value.trim()) return 'Please tell us a little about your requirement.';
          if (value.trim().length < 10) return 'Message should be at least 10 characters.';
          return '';
        }
      }
    };

    // Live validation on blur
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field.input) return;
      field.input.addEventListener('blur', function () {
        validateField(key);
      });
      field.input.addEventListener('input', function () {
        if (field.input.classList.contains('is-invalid')) {
          validateField(key);
        }
      });
    });

    function validateField(key) {
      var field = fields[key];
      var errorText = field.validate(field.input.value);

      if (errorText) {
        field.input.classList.add('is-invalid');
        field.input.setAttribute('aria-invalid', 'true');
        if (field.error) field.error.textContent = errorText;
        return false;
      } else {
        field.input.classList.remove('is-invalid');
        field.input.setAttribute('aria-invalid', 'false');
        if (field.error) field.error.textContent = '';
        return true;
      }
    }

    function validateAll() {
      var isValid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) {
          isValid = false;
        }
      });
      return isValid;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (successMessage) successMessage.classList.remove('is-visible');

      if (!validateAll()) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Simulate network request (no backend wired up in this template)
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        form.reset();

        Object.keys(fields).forEach(function (key) {
          fields[key].input.classList.remove('is-invalid');
        });

        if (successMessage) {
          successMessage.classList.add('is-visible');
          successMessage.setAttribute('tabindex', '-1');
          successMessage.focus();
        }
      }, 900);
    });
  });
})();
