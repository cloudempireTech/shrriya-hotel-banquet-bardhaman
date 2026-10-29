/* ==========================================================================
   SHRRIYA HOTEL & BANQUET - MAIN INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Dynamic Keyword Rotator in Hero Title
  const rotator = document.querySelector('.dynamic-rotator');
  if (rotator) {
    const keywords = [
      "Bardhaman Weddings",
      "Grand Receptions",
      "Corporate Galas",
      "Cultural Soirees",
      "Milestone Celebrations"
    ];
    let currentIndex = 0;

    setInterval(() => {
      rotator.style.opacity = '0';
      rotator.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % keywords.length;
        rotator.textContent = keywords[currentIndex];
        rotator.style.opacity = '1';
        rotator.style.transform = 'translateY(0)';
      }, 400);
    }, 3200);
  }

  // 3. Hero Video Pause / Play Toggle
  const video = document.querySelector('.hero-video');
  const videoControlBtn = document.querySelector('.video-control-btn');

  if (video && videoControlBtn) {
    videoControlBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        videoControlBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        `;
        videoControlBtn.setAttribute('aria-label', 'Pause Hero Video');
      } else {
        video.pause();
        videoControlBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        `;
        videoControlBtn.setAttribute('aria-label', 'Play Hero Video');
      }
    });
  }

  // 4. Animated Number Count-Up Telemetry
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseFloat(el.getAttribute('data-target') || el.textContent);
          const isDecimal = el.getAttribute('data-decimal') === 'true';
          const suffix = el.getAttribute('data-suffix') || '';
          
          let startVal = 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = startVal + (targetVal - startVal) * easeProgress;

            if (isDecimal) {
              el.textContent = currentVal.toFixed(1) + suffix;
            } else {
              el.textContent = Math.round(currentVal) + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = (isDecimal ? targetVal.toFixed(1) : targetVal) + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => observer.observe(el));
  }

  // 5. Sticky Floating Filter Rail Logic (for Offerings page)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.offering-card, .dish-card');

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        cards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        // Center clicked button in scroll view
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });
  }

  // 6. Dynamic Banquet Configuration / Capacity Calculator
  const guestSlider = document.getElementById('guestSlider');
  const guestDisplay = document.getElementById('guestCountDisplay');
  const hallConfigDisplay = document.getElementById('hallConfigDisplay');
  const buffetAreaDisplay = document.getElementById('buffetAreaDisplay');
  const roomsDisplay = document.getElementById('roomsDisplay');
  const staffDisplay = document.getElementById('staffDisplay');
  const calcWaBtn = document.getElementById('calcWaBtn');

  if (guestSlider && guestDisplay) {
    function updateCalculator() {
      const guests = parseInt(guestSlider.value, 10);
      guestDisplay.textContent = `${guests} Guests`;

      let config = "Grand Celebration Hall A";
      let buffet = "1,800 sq.ft. Dedicated Dining Hall";
      let rooms = "2 Complimentary AC Deluxe Bridal Suites";
      let staff = "24 Hospitality & Banquet Coordinators";

      if (guests <= 250) {
        config = "Imperial AC Banquet Hall (Single Level)";
        buffet = "1,200 sq.ft. Buffet Lounge";
        rooms = "1 Executive AC Bridal Suite";
        staff = "16 Hospitality Staff";
      } else if (guests <= 550) {
        config = "Royal Grand Hall + Open-Air Lawn Terrace";
        buffet = "2,500 sq.ft. Multi-Cuisine Buffet Zone";
        rooms = "2 Luxury AC Family Suites";
        staff = "32 Hospitality Staff";
      } else {
        config = "Full Grand Hall & Terrace Concourse (Exclusive Access)";
        buffet = "4,000 sq.ft. Royal Banquet & Live Counters";
        rooms = "4 Luxury AC Suites + VIP Green Room";
        staff = "50+ Dedicated Event Coordinators";
      }

      if (hallConfigDisplay) hallConfigDisplay.textContent = config;
      if (buffetAreaDisplay) buffetAreaDisplay.textContent = buffet;
      if (roomsDisplay) roomsDisplay.textContent = rooms;
      if (staffDisplay) staffDisplay.textContent = staff;

      if (calcWaBtn) {
        const msg = `Hello Shrriya Hotel & Banquet! I used your website calculator for an upcoming event for ${guests} guests (${config}). I would like to check availability and schedule a venue tour.`;
        calcWaBtn.href = `https://wa.me/917407392497?text=${encodeURIComponent(msg)}`;
      }
    }

    guestSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // 7. General WhatsApp Inquiry Form Handoff
  const inquiryForms = document.querySelectorAll('.inquiry-form');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'Guest';
      const eventType = form.querySelector('[name="eventType"]')?.value || 'Celebration';
      const date = form.querySelector('[name="eventDate"]')?.value || 'Upcoming Date';
      const guests = form.querySelector('[name="guestCount"]')?.value || '100+';
      const notes = form.querySelector('[name="message"]')?.value || '';

      const text = `Namaste Shrriya Hotel & Banquet!\n\nMy Name: ${name}\nEvent Type: ${eventType}\nTarget Date: ${date}\nEstimated Guests: ${guests}\nSpecial Notes: ${notes}\n\nI would like to enquire about banquet booking and date availability.`;

      const primaryWaUrl = `https://wa.me/917407392497?text=${encodeURIComponent(text)}`;
      window.open(primaryWaUrl, '_blank');
    });
  });
});
