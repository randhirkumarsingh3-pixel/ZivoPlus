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


  /* ---------- Booking Widget Tabs & Dynamic Search Grid ---------- */
  var bookingTabs = document.querySelectorAll('.booking-tab');
  var col1Label = document.getElementById('col1Label');
  var col1Val = document.getElementById('col1Val');
  var col1Sub = document.getElementById('col1Sub');

  var col2Label = document.getElementById('col2Label');
  var col2Val = document.getElementById('col2Val');
  var col2Sub = document.getElementById('col2Sub');

  var col3Label = document.getElementById('col3Label');
  var col3Val = document.getElementById('col3Val');
  var col3Sub = document.getElementById('col3Sub');

  var col4Label = document.getElementById('col4Label');
  var col4Val = document.getElementById('col4Val');
  var col4Sub = document.getElementById('col4Sub');

  var bookingRadios = document.getElementById('bookingRadios');
  var bookingSubbarText = document.getElementById('bookingSubbarText');
  var recentSearchItem = document.getElementById('recentSearchItem');

  var tabData = {
    hotels: {
      radios: '<label class="booking-radio-option"><input type="radio" name="bookingOption" checked><span>Upto 4 Rooms</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Group Deals</span> <span class="badge-new">NEW</span></label>',
      tagline: 'Book Domestic & International Properties Online',
      col1: { label: 'City, Property Name Or Location', val: 'Z Bliss Suites, BKC', sub: 'Mumbai, India' },
      col2: { label: 'Check-In <span class="chevron">&#9662;</span>', val: '<span class="date-large">18</span> <span class="date-month">Oct\'26</span>', sub: 'Sunday' },
      col3: { label: 'Check-Out <span class="chevron">&#9662;</span>', val: '<span class="date-large">20</span> <span class="date-month">Oct\'26</span>', sub: 'Tuesday' },
      col4: { label: 'Rooms & Guests <span class="chevron">&#9662;</span>', val: '1 Room, 2 Adults', sub: 'Economy / Deluxe' },
      recent: 'Z Bliss Suites, BKC • 18 Oct - 20 Oct'
    },
    flights: {
      radios: '<label class="booking-radio-option"><input type="radio" name="bookingOption" checked><span>One Way</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Round Trip</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Multi-City</span></label>',
      tagline: 'Compare & Book Domestic & International Flights',
      col1: { label: 'From (City / Airport)', val: 'Mumbai (BOM)', sub: 'Chhatrapati Shivaji Maharaj Intl' },
      col2: { label: 'To (City / Airport)', val: 'New Delhi (DEL)', sub: 'Indira Gandhi Intl Airport' },
      col3: { label: 'Departure Date <span class="chevron">&#9662;</span>', val: '<span class="date-large">18</span> <span class="date-month">Oct\'26</span>', sub: 'Sunday' },
      col4: { label: 'Travellers & Class <span class="chevron">&#9662;</span>', val: '1 Traveller', sub: 'Economy / Premium' },
      recent: 'BOM → DEL • 18 Oct\'26 • 1 Traveller'
    },
    trains: {
      radios: '<label class="booking-radio-option"><input type="radio" name="bookingOption" checked><span>Book Train Tickets</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Check PNR Status</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Live Train Status</span></label>',
      tagline: 'Authorized IRCTC Partner Booking Under Development',
      col1: { label: 'From Station', val: 'NDLS, New Delhi', sub: 'New Delhi Railway Station' },
      col2: { label: 'To Station', val: 'BCT, Mumbai Central', sub: 'Mumbai Central Station' },
      col3: { label: 'Travel Date <span class="chevron">&#9662;</span>', val: '<span class="date-large">18</span> <span class="date-month">Oct\'26</span>', sub: 'Sunday' },
      col4: { label: 'Class & Quota <span class="chevron">&#9662;</span>', val: 'All Classes', sub: 'General Quota' },
      recent: 'NDLS → BCT • 18 Oct\'26 • 3AC'
    },
    buses: {
      radios: '<label class="booking-radio-option"><input type="radio" name="bookingOption" checked><span>All Routes</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>AC Sleeper</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>State RTCs</span></label>',
      tagline: 'Verified Private & State RTC Bus Bookings',
      col1: { label: 'From City', val: 'Bengaluru', sub: 'Majestic / Silk Board' },
      col2: { label: 'To City', val: 'Hyderabad', sub: 'MGBS / Ameerpet' },
      col3: { label: 'Travel Date <span class="chevron">&#9662;</span>', val: '<span class="date-large">18</span> <span class="date-month">Oct\'26</span>', sub: 'Sunday' },
      col4: { label: 'Bus Type <span class="chevron">&#9662;</span>', val: 'AC Sleeper (2+1)', sub: 'Verified Operators' },
      recent: 'Bengaluru → Hyderabad • 18 Oct\'26'
    },
    villas: {
      radios: '<label class="booking-radio-option"><input type="radio" name="bookingOption" checked><span>Entire Villa</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Homestays</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Pet Friendly</span></label>',
      tagline: 'Private Villas, Cottages & Homestays Across India',
      col1: { label: 'Destination / Property', val: 'Goa, North Goa', sub: 'Candolim / Calangute' },
      col2: { label: 'Check-In <span class="chevron">&#9662;</span>', val: '<span class="date-large">18</span> <span class="date-month">Oct\'26</span>', sub: 'Sunday' },
      col3: { label: 'Check-Out <span class="chevron">&#9662;</span>', val: '<span class="date-large">22</span> <span class="date-month">Oct\'26</span>', sub: 'Thursday' },
      col4: { label: 'Guests <span class="chevron">&#9662;</span>', val: '4 Guests', sub: '2 Bedrooms' },
      recent: 'Goa Villa • 18 Oct - 22 Oct • 4 Guests'
    },
    packages: {
      radios: '<label class="booking-radio-option"><input type="radio" name="bookingOption" checked><span>All Packages</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Honeymoon</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Weekend Getaways</span></label>',
      tagline: 'Curated Travel & Holiday Experiences',
      col1: { label: 'Explore Destination', val: 'Kashmir Valley', sub: 'Srinagar, Gulmarg, Pahalgam' },
      col2: { label: 'Starting Month <span class="chevron">&#9662;</span>', val: '<span class="date-large">Oct</span> <span class="date-month">2026</span>', sub: '5 Nights / 6 Days' },
      col3: { label: 'Travel Style <span class="chevron">&#9662;</span>', val: 'Family / Leisure', sub: 'Flights + Hotel + Sightseeing' },
      col4: { label: 'Travellers <span class="chevron">&#9662;</span>', val: '2 Adults', sub: 'Customizable' },
      recent: 'Kashmir 6D5N Package • 2 Adults'
    },
    cabs: {
      radios: '<label class="booking-radio-option"><input type="radio" name="bookingOption" checked><span>Outstation One-Way</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Round Trip</span></label><label class="booking-radio-option"><input type="radio" name="bookingOption"><span>Airport Transfers</span></label>',
      tagline: 'Reliable Intercity Cabs & Airport Rides',
      col1: { label: 'Pickup Location', val: 'Mumbai Airport (T2)', sub: 'Sahar, Andheri East' },
      col2: { label: 'Drop Destination', val: 'Pune City', sub: 'Shivajinagar / Hinjewadi' },
      col3: { label: 'Pickup Date <span class="chevron">&#9662;</span>', val: '<span class="date-large">18</span> <span class="date-month">Oct\'26</span>', sub: '09:00 AM' },
      col4: { label: 'Vehicle Type <span class="chevron">&#9662;</span>', val: 'Sedan / SUV', sub: 'AC Cab • Top Drivers' },
      recent: 'Mumbai Airport → Pune • 18 Oct\'26'
    }
  };

  if (bookingTabs.length > 0) {
    bookingTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var tabKey = tab.getAttribute('data-tab');
        if (!tabData[tabKey]) return;

        bookingTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        var data = tabData[tabKey];
        if (bookingRadios) bookingRadios.innerHTML = data.radios;
        if (bookingSubbarText) bookingSubbarText.textContent = data.tagline;

        if (col1Label) col1Label.innerHTML = data.col1.label;
        if (col1Val) col1Val.innerHTML = data.col1.val;
        if (col1Sub) col1Sub.textContent = data.col1.sub;

        if (col2Label) col2Label.innerHTML = data.col2.label;
        if (col2Val) col2Val.innerHTML = data.col2.val;
        if (col2Sub) col2Sub.textContent = data.col2.sub;

        if (col3Label) col3Label.innerHTML = data.col3.label;
        if (col3Val) col3Val.innerHTML = data.col3.val;
        if (col3Sub) col3Sub.textContent = data.col3.sub;

        if (col4Label) col4Label.innerHTML = data.col4.label;
        if (col4Val) col4Val.innerHTML = data.col4.val;
        if (col4Sub) col4Sub.textContent = data.col4.sub;

        if (recentSearchItem) recentSearchItem.textContent = data.recent;
      });
    });
  }

  /* ---------- Booking Modal Popup Trigger ---------- */
  var bookingModalOverlay = document.getElementById('bookingModalOverlay');
  var bookingModalClose = document.getElementById('bookingModalClose');
  var bookingModalDismiss = document.getElementById('bookingModalDismiss');
  var bookingSearchBtn = document.getElementById('bookingSearchBtn');
  var bookingGrid = document.getElementById('bookingGrid');

  function openBookingModal() {
    if (bookingModalOverlay) {
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

  if (bookingSearchBtn) {
    bookingSearchBtn.addEventListener('click', openBookingModal);
  }

  if (bookingGrid) {
    bookingGrid.addEventListener('click', openBookingModal);
  }

  if (recentSearchItem) {
    recentSearchItem.addEventListener('click', openBookingModal);
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
