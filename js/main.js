/* ============================================
   ZivoPlus — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky Header ---------- */
  const header = document.querySelector('.header');

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check on load


  /* ---------- Mobile Menu ---------- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', function () {
      mobileToggle.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ---------- Scroll Fade-In Animations ---------- */
  var fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ---------- Contact Form — Mailto Submission ---------- */
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      clearFormErrors();

      // Get form values
      var name = contactForm.querySelector('#contactName').value.trim();
      var email = contactForm.querySelector('#contactEmail').value.trim();
      var enquiryType = contactForm.querySelector('#enquiryType').value;
      var message = contactForm.querySelector('#contactMessage').value.trim();

      // Validate
      var isValid = true;

      if (!name) {
        showFieldError('contactName', 'Please enter your full name.');
        isValid = false;
      }

      if (!email) {
        showFieldError('contactEmail', 'Please enter your email address.');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showFieldError('contactEmail', 'Please enter a valid email address.');
        isValid = false;
      }

      if (!enquiryType) {
        showFieldError('enquiryType', 'Please select an enquiry type.');
        isValid = false;
      }

      if (!message) {
        showFieldError('contactMessage', 'Please enter your message.');
        isValid = false;
      }

      if (!isValid) return;

      // Build mailto link with form data
      var subject = encodeURIComponent('ZivoPlus Enquiry: ' + enquiryType);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Enquiry Type: ' + enquiryType + '\n\n' +
        'Message:\n' + message
      );

      var mailtoLink = 'mailto:admin@zivoplus.com?subject=' + subject + '&body=' + body;

      // Open mail client
      window.location.href = mailtoLink;
    });
  }


  /* ---------- Form Helper Functions ---------- */
  function showFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = field.parentElement.querySelector('.form-error-message');
    if (field) field.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearFormErrors() {
    document.querySelectorAll('.form-control.error').forEach(function (el) {
      el.classList.remove('error');
    });
    document.querySelectorAll('.form-error-message.visible').forEach(function (el) {
      el.classList.remove('visible');
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ---------- Active Nav Link Highlight (on scroll) ---------- */
  var sections = document.querySelectorAll('section[id]');

  function highlightNavOnScroll() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  if (sections.length > 0) {
    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
  }

});
