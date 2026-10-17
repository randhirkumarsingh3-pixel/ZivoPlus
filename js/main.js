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


  /* ---------- ZivoPlus Bespoke Travel Booking Suite ---------- */
  var zivoNavItems = document.querySelectorAll('.zivo-nav-item');
  var deckTitle = document.getElementById('deckTitle');
  var deckDesc = document.getElementById('deckDesc');
  var box1Label = document.getElementById('box1Label');
  var zivoPrimaryInput = document.getElementById('zivoPrimaryInput');
  var box1Hint = document.getElementById('box1Hint');
  var box2Label = document.getElementById('box2Label');
  var zivoDateStart = document.getElementById('zivoDateStart');
  var box2Hint = document.getElementById('box2Hint');
  var box3Label = document.getElementById('box3Label');
  var zivoDateEnd = document.getElementById('zivoDateEnd');
  var box3Hint = document.getElementById('box3Hint');
  var box4Label = document.getElementById('box4Label');
  var zivoOptionSelect = document.getElementById('zivoOptionSelect');
  var box4Hint = document.getElementById('box4Hint');
  var zivoSearchBtn = document.getElementById('zivoSearchBtn');
  var zivoSearchBtnText = document.getElementById('zivoSearchBtnText');

  // Helper: Format Date to YYYY-MM-DD
  function formatDate(d) {
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  // Helper: Format Date to readable text
  function formatReadableDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    var options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-IN', options);
  }

  // Initialize Dates
  var now = new Date();
  var tomorrow = new Date(now.getTime() + 86400000);
  var dayAfter = new Date(now.getTime() + 86400000 * 3);

  if (zivoDateStart && zivoDateEnd) {
    var todayStr = formatDate(now);
    var startStr = formatDate(tomorrow);
    var endStr = formatDate(dayAfter);

    zivoDateStart.min = todayStr;
    zivoDateStart.value = startStr;
    if (box2Hint) box2Hint.textContent = formatReadableDate(startStr);

    zivoDateEnd.min = startStr;
    zivoDateEnd.value = endStr;
    if (box3Hint) box3Hint.textContent = formatReadableDate(endStr);

    // Update hints live when dates are changed
    zivoDateStart.addEventListener('change', function () {
      if (box2Hint) box2Hint.textContent = formatReadableDate(this.value);
      if (zivoDateEnd && zivoDateEnd.value < this.value) {
        zivoDateEnd.min = this.value;
        var nextDay = new Date(new Date(this.value).getTime() + 86400000);
        zivoDateEnd.value = formatDate(nextDay);
        if (box3Hint) box3Hint.textContent = formatReadableDate(zivoDateEnd.value);
      }
    });

    zivoDateEnd.addEventListener('change', function () {
      if (box3Hint) box3Hint.textContent = formatReadableDate(this.value);
    });
  }

  // Service Definitions (Hotels, Flights, Trains, Buses)
  var currentService = 'hotels';
  var serviceConfigs = {
    hotels: {
      title: 'Hotels & Accommodations',
      desc: 'Search verified hotels, business stays, and boutique accommodations',
      box1Label: '<span class="zivo-label-icon">&#128205;</span> Destination or Hotel',
      placeholder: 'Where would you like to stay? (e.g. Mumbai, Goa, Delhi...)',
      box1Hint: 'City, landmark, or accommodation',
      box2Label: '<span class="zivo-label-icon">&#128197;</span> Check-In Date',
      box3Label: '<span class="zivo-label-icon">&#128197;</span> Check-Out Date',
      box4Label: '<span class="zivo-label-icon">&#128101;</span> Rooms & Guests',
      options: [
        { val: '1 Room, 2 Guests', text: '1 Room, 2 Guests (Standard)' },
        { val: '1 Room, 1 Guest', text: '1 Room, 1 Guest (Solo)' },
        { val: '2 Rooms, 4 Guests', text: '2 Rooms, 4 Guests (Family)' },
        { val: '3+ Rooms', text: '3+ Rooms (Group Deals)' }
      ],
      box4Hint: 'Economy • Deluxe • Suites',
      btnText: 'Check Availability'
    },
    flights: {
      title: 'Flights & Air Travel',
      desc: 'Compare domestic and international flights across certified airline partners',
      box1Label: '<span class="zivo-label-icon">&#9992;</span> From (Departure City)',
      placeholder: 'Where are you flying from? (e.g. Mumbai BOM, Delhi DEL...)',
      box1Hint: 'Enter origin airport or city',
      box2Label: '<span class="zivo-label-icon">&#128197;</span> Departure Date',
      box3Label: '<span class="zivo-label-icon">&#128197;</span> Return Date',
      box4Label: '<span class="zivo-label-icon">&#128100;</span> Travellers & Class',
      options: [
        { val: '1 Passenger, Economy', text: '1 Passenger, Economy' },
        { val: '1 Passenger, Premium Economy', text: '1 Passenger, Premium Economy' },
        { val: '1 Passenger, Business', text: '1 Passenger, Business Class' },
        { val: '2 Passengers, Economy', text: '2 Passengers, Economy' },
        { val: 'Family / Group', text: 'Family / Group (3+ Passengers)' }
      ],
      box4Hint: 'Direct & connecting flight routes',
      btnText: 'Search Flights'
    },
    trains: {
      title: 'Trains & Railway Bookings',
      desc: 'Direct rail network ticketing under development for Indian Railways',
      box1Label: '<span class="zivo-label-icon">&#128646;</span> Origin Station',
      placeholder: 'Enter departure station (e.g. New Delhi NDLS, Mumbai BCT...)',
      box1Hint: 'Station code or city name',
      box2Label: '<span class="zivo-label-icon">&#128197;</span> Journey Date',
      box3Label: '<span class="zivo-label-icon">&#128197;</span> Return Date',
      box4Label: '<span class="zivo-label-icon">&#127915;</span> Class & Quota',
      options: [
        { val: 'All Classes', text: 'All Classes (General Quota)' },
        { val: 'Sleeper (SL)', text: 'Sleeper Class (SL)' },
        { val: 'AC 3 Tier (3A)', text: 'AC 3 Tier (3A)' },
        { val: 'AC 2 Tier (2A)', text: 'AC 2 Tier (2A)' },
        { val: 'AC 1st Class (1A)', text: 'AC 1st Class (1A)' },
        { val: 'Tatkal', text: 'Tatkal Quota' }
      ],
      box4Hint: 'Live status & confirmed berths',
      btnText: 'Find Trains'
    },
    buses: {
      title: 'Buses & Intercity Travel',
      desc: 'Verified state transport corporations & private luxury operators',
      box1Label: '<span class="zivo-label-icon">&#128652;</span> Boarding City',
      placeholder: 'Enter departure city (e.g. Bengaluru, Pune, Hyderabad...)',
      box1Hint: 'Major boarding points & bus terminals',
      box2Label: '<span class="zivo-label-icon">&#128197;</span> Travel Date',
      box3Label: '<span class="zivo-label-icon">&#128197;</span> Return Date',
      box4Label: '<span class="zivo-label-icon">&#128186;</span> Bus Type & Seats',
      options: [
        { val: 'Any Bus Type', text: 'Any Bus Type (1 Seat)' },
        { val: 'AC Sleeper (2+1)', text: 'AC Sleeper (2+1)' },
        { val: 'AC Semi-Sleeper', text: 'AC Semi-Sleeper' },
        { val: 'Volvo Multi-Axle', text: 'Volvo Multi-Axle Luxury' },
        { val: '2+ Seats', text: '2+ Seats (Group)' }
      ],
      box4Hint: 'Live GPS & verified amenities',
      btnText: 'Search Buses'
    }
  };

  // Tab click switching
  if (zivoNavItems.length > 0) {
    zivoNavItems.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var service = tab.getAttribute('data-service');
        if (!serviceConfigs[service]) return;

        currentService = service;
        zivoNavItems.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        var cfg = serviceConfigs[service];
        if (deckTitle) deckTitle.textContent = cfg.title;
        if (deckDesc) deckDesc.textContent = cfg.desc;
        if (box1Label) box1Label.innerHTML = cfg.box1Label;
        if (zivoPrimaryInput) {
          zivoPrimaryInput.placeholder = cfg.placeholder;
          zivoPrimaryInput.value = ''; // Clean & empty
        }
        if (box1Hint) box1Hint.textContent = cfg.box1Hint;
        if (box2Label) box2Label.innerHTML = cfg.box2Label;
        if (box3Label) box3Label.innerHTML = cfg.box3Label;
        if (box4Label) box4Label.innerHTML = cfg.box4Label;

        if (zivoOptionSelect) {
          zivoOptionSelect.innerHTML = '';
          cfg.options.forEach(function (opt) {
            var el = document.createElement('option');
            el.value = opt.val;
            el.textContent = opt.text;
            zivoOptionSelect.appendChild(el);
          });
        }
        if (box4Hint) box4Hint.textContent = cfg.box4Hint;
        if (zivoSearchBtnText) zivoSearchBtnText.textContent = cfg.btnText;
      });
    });
  }

  /* ---------- Booking Modal Popup Trigger ---------- */
  var bookingModalOverlay = document.getElementById('bookingModalOverlay');
  var bookingModalClose = document.getElementById('bookingModalClose');
  var bookingModalDismiss = document.getElementById('bookingModalDismiss');
  var modalTitle = document.getElementById('modalTitle');

  function openBookingModal() {
    if (bookingModalOverlay) {
      var dest = (zivoPrimaryInput && zivoPrimaryInput.value.trim()) || '';
      var serviceName = serviceConfigs[currentService] ? serviceConfigs[currentService].title : 'Travel';
      if (modalTitle) {
        modalTitle.textContent = serviceName + ' — Coming Soon!';
      }
      bookingModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBookingModal() {
    if (bookingModalOverlay) {
      bookingModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (zivoSearchBtn) {
    zivoSearchBtn.addEventListener('click', openBookingModal);
  }

  if (bookingModalClose) {
    bookingModalClose.addEventListener('click', closeBookingModal);
  }

  if (bookingModalDismiss) {
    bookingModalDismiss.addEventListener('click', closeBookingModal);
  }

  if (bookingModalOverlay) {
    bookingModalOverlay.addEventListener('click', function (e) {
      if (e.target === bookingModalOverlay) {
        closeBookingModal();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bookingModalOverlay && bookingModalOverlay.classList.contains('active')) {
      closeBookingModal();
    }
  });

});
