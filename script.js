/* ==========================================================================
   APEX FITNESS & PERFORMANCE GYM - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initNavbar();
  initMobileMenu();
  initPricingToggle();
  initScheduleTabs();
  initBmiCalculator();
  initModalSystem();
  initContactForm();
  initScrollObserver();
});

/* --- NAVBAR SCROLL & ACCENT --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial state
}

/* --- MOBILE MENU TOGGLE --- */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking links
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --- PRICING TOGGLE (MONTHLY VS ANNUAL) --- */
function initPricingToggle() {
  const toggleSwitch = document.getElementById('billingToggle');
  const priceValues = document.querySelectorAll('.pricing-price');
  const pricePeriods = document.querySelectorAll('.pricing-period');

  if (!toggleSwitch || priceValues.length === 0) return;

  const basePrices = {
    monthly: ['1,000', '1,500', '2,000'],
    annual: ['800', '1,200', '1,600'] // ~20% discount on monthly rate for 1-Year plans
  };

  toggleSwitch.addEventListener('change', () => {
    const isAnnual = toggleSwitch.checked;
    const currentPrices = isAnnual ? basePrices.annual : basePrices.monthly;

    priceValues.forEach((el, index) => {
      // Animate number shift
      el.style.transform = 'scale(0.8)';
      el.style.opacity = '0';

      setTimeout(() => {
        el.textContent = currentPrices[index];
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
      }, 150);
    });

    pricePeriods.forEach(el => {
      el.textContent = isAnnual ? '/ month (billed yearly)' : '/ month';
    });

    // Update label classes
    document.getElementById('monthlyLabel')?.classList.toggle('active', !isAnnual);
    document.getElementById('annualLabel')?.classList.toggle('active', isAnnual);
  });
}

/* --- WEEKLY SCHEDULE FILTERING --- */
const SCHEDULE_DATA = {
  monday: [
    { time: '06:00 AM - 07:15 AM', class: 'Hypertrophy Power Hour', trainer: 'Marcus Vance', intensity: 'extreme', tag: 'Strength' },
    { time: '08:30 AM - 09:30 AM', class: 'Athletic Conditioning & Turf HIIT', trainer: 'Elena Rostova', intensity: 'high', tag: 'HIIT' },
    { time: '12:00 PM - 01:00 PM', class: 'Functional Mobility & Core', trainer: 'Sarah Jenkins', intensity: 'medium', tag: 'Mobility' },
    { time: '05:30 PM - 06:45 PM', class: 'Combat Conditioning & Boxing', trainer: 'David Diaz', intensity: 'high', tag: 'Combat' },
    { time: '07:00 PM - 08:15 PM', class: 'Apex Powerlifting Lab', trainer: 'Marcus Vance', intensity: 'extreme', tag: 'Strength' }
  ],
  tuesday: [
    { time: '06:30 AM - 07:30 AM', class: 'Metabolic Inferno HIIT', trainer: 'Elena Rostova', intensity: 'extreme', tag: 'HIIT' },
    { time: '09:00 AM - 10:15 AM', class: 'Olympic Weightlifting Fundamentals', trainer: 'Marcus Vance', intensity: 'high', tag: 'Strength' },
    { time: '05:00 PM - 06:00 PM', class: 'VFX Hybrid Cardio Engine', trainer: 'Sarah Jenkins', intensity: 'medium', tag: 'Cardio' },
    { time: '06:30 PM - 07:45 PM', class: 'Boxing & Kick Strikes', trainer: 'David Diaz', intensity: 'high', tag: 'Combat' }
  ],
  wednesday: [
    { time: '06:00 AM - 07:15 AM', class: 'Hypertrophy Lower Body Blast', trainer: 'Marcus Vance', intensity: 'extreme', tag: 'Strength' },
    { time: '08:30 AM - 09:30 AM', class: 'Tabata Speed & Agility', trainer: 'Elena Rostova', intensity: 'high', tag: 'HIIT' },
    { time: '05:30 PM - 06:30 PM', class: 'Recovery & Posture Mechanics', trainer: 'Sarah Jenkins', intensity: 'medium', tag: 'Mobility' },
    { time: '07:00 PM - 08:30 PM', class: 'Advanced Heavy Bag Circuit', trainer: 'David Diaz', intensity: 'high', tag: 'Combat' }
  ],
  thursday: [
    { time: '06:30 AM - 07:30 AM', class: 'Zone-2 Endurance & Engine', trainer: 'Elena Rostova', intensity: 'medium', tag: 'Cardio' },
    { time: '09:00 AM - 10:15 AM', class: 'Apex Deadlift & Squat Clinic', trainer: 'Marcus Vance', intensity: 'extreme', tag: 'Strength' },
    { time: '05:30 PM - 06:45 PM', class: 'Athletic Turf & Sled Sprint', trainer: 'Elena Rostova', intensity: 'high', tag: 'HIIT' },
    { time: '07:00 PM - 08:00 PM', class: 'Tactical Krav & Combat', trainer: 'David Diaz', intensity: 'high', tag: 'Combat' }
  ],
  friday: [
    { time: '06:00 AM - 07:15 AM', class: 'Chest & Arms Hypertrophy', trainer: 'Marcus Vance', intensity: 'extreme', tag: 'Strength' },
    { time: '08:30 AM - 09:30 AM', class: 'Friday Night Lights HIIT', trainer: 'Elena Rostova', intensity: 'high', tag: 'HIIT' },
    { time: '05:00 PM - 06:15 PM', class: 'Total Body Functional Strength', trainer: 'Sarah Jenkins', intensity: 'medium', tag: 'Strength' },
    { time: '06:30 PM - 07:30 PM', class: 'Sparring & Technique Drills', trainer: 'David Diaz', intensity: 'extreme', tag: 'Combat' }
  ],
  saturday: [
    { time: '08:00 AM - 09:30 AM', class: 'Weekend Warrior Monster Circuit', trainer: 'All Coaches', intensity: 'extreme', tag: 'HIIT' },
    { time: '10:00 AM - 11:30 AM', class: 'Strongman & Tire Flips', trainer: 'Marcus Vance', intensity: 'high', tag: 'Strength' },
    { time: '12:00 PM - 01:15 PM', class: 'Deep Tissue Mobility & Release', trainer: 'Sarah Jenkins', intensity: 'medium', tag: 'Mobility' }
  ],
  sunday: [
    { time: '09:00 AM - 10:30 AM', class: 'Active Recovery & Breathwork', trainer: 'Sarah Jenkins', intensity: 'medium', tag: 'Mobility' },
    { time: '11:00 AM - 12:30 PM', class: 'Open Gym & Technique Support', trainer: 'Staff On Duty', intensity: 'medium', tag: 'Open Gym' }
  ]
};

function initScheduleTabs() {
  const tabBtns = document.querySelectorAll('.schedule-tabs .tab-btn');
  const tableBody = document.getElementById('scheduleTableBody');

  if (!tabBtns.length || !tableBody) return;

  function renderDay(day) {
    const classes = SCHEDULE_DATA[day] || [];
    tableBody.innerHTML = '';

    if (classes.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No classes scheduled for this day.</td></tr>`;
      return;
    }

    classes.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="schedule-time">${item.time}</td>
        <td>
          <div class="schedule-class">${item.class}</div>
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Category: ${item.tag}</span>
        </td>
        <td class="schedule-trainer">${item.trainer}</td>
        <td>
          <span class="intensity-badge intensity-${item.intensity}">${item.intensity.toUpperCase()}</span>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedDay = btn.getAttribute('data-day');
      renderDay(selectedDay);
    });
  });

  // Render initial Monday
  renderDay('monday');
}

/* --- INTERACTIVE BMI & CALORIE CALCULATOR --- */
function initBmiCalculator() {
  const form = document.getElementById('bmiCalculatorForm');
  const numberEl = document.getElementById('bmiValue');
  const categoryEl = document.getElementById('bmiCategory');
  const adviceEl = document.getElementById('bmiAdvice');

  if (!form || !numberEl || !categoryEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const heightCm = parseFloat(document.getElementById('bmiHeight').value);
    const weightKg = parseFloat(document.getElementById('bmiWeight').value);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      showToast('Please enter valid height and weight values.', 'error');
      return;
    }

    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);

    numberEl.textContent = bmi;

    let category = '';
    let advice = '';
    let color = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'Recommended: High-protein hypertrophy program with surplus caloric intake.';
      color = '#00f0ff';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Optimal Fitness';
      advice = 'Excellent condition! Recommended: Apex Performance or Strength & Athletic Conditioning.';
      color = '#00ff88';
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = 'Overweight / Muscular Density';
      advice = 'Recommended: High-intensity HIIT combined with heavy compound resistance training.';
      color = '#ffaa00';
    } else {
      category = 'High Mass Index';
      advice = 'Recommended: Custom 1-on-1 athletic body recomposition & metabolic engine program.';
      color = '#ff5500';
    }

    categoryEl.textContent = category;
    categoryEl.style.color = color;
    numberEl.style.color = color;
    adviceEl.textContent = advice;

    showToast(`BMI Calculated: ${bmi} (${category})`, 'success');
  });
}

/* --- MODAL SYSTEM (BOOKING / FREE PASS) --- */
function initModalSystem() {
  const modal = document.getElementById('bookingModal');
  const triggers = document.querySelectorAll('[data-modal="booking"]');
  const closeBtns = document.querySelectorAll('.modal-close');
  const modalForm = document.getElementById('modalBookingForm');
  const modalTitle = document.getElementById('modalTitle');

  if (!modal) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = trigger.getAttribute('data-plan') || 'Free 3-Day Pass';
      if (modalTitle) {
        modalTitle.textContent = `Claim Your ${planName}`;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      modal.classList.remove('active');
      document.body.style.overflow = '';
      showToast('🎉 VIP Pass Confirmed! Our team will contact you in 15 mins.', 'success');
      modalForm.reset();
    });
  }
}

/* --- CONTACT FORM VALIDATION & SUBMISSION --- */
function initContactForm() {
  const form = document.getElementById('apexContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();

    if (!name || !email) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    showToast('🚀 Message received! An Apex coach will reply shortly.', 'success');
    form.reset();
  });
}

/* --- SCROLL INTERSECTION OBSERVER FOR ACTIVE NAV LINKS --- */
function initScrollObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

/* --- TOAST NOTIFICATION UTILITY --- */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? '⚡' : '⚠️';
  toast.innerHTML = `<span style="font-size:1.2rem;">${icon}</span><span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
