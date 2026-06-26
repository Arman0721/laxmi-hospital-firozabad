/* ==========================================================================
   Laxmi Hospital, Firozabad - Main Interactive Script
   Core JS logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicContent();
  initStickyHeader();
  initMobileMenu();
  initCounters();
  initTestimonials();
  initFAQs();
  initActiveNavLink();
  initFooterStatus();
  initHeroSlider();
  initPromoPopup();
  initDoctorsCarousel();
});

/* --- Sticky Header --- */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(11, 79, 147, 0.08)';
    } else {
      header.style.backgroundColor = 'var(--white)';
      header.style.boxShadow = 'var(--shadow-sm)';
    }
  });
}

/* --- Mobile Menu Toggle --- */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    
    // Toggle icon lines representation
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

/* --- Dynamic Counter Animation on Scroll --- */
function initCounters() {
  const counters = document.querySelectorAll('.trust-number');
  if (counters.length === 0) return;
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // ~60fps
    
    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.ceil(count) + suffix;
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target + suffix;
      }
    };
    
    updateCount();
  };
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    once: true
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

/* --- Testimonial Slider --- */
function initTestimonials() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  const testimonials = slider.querySelectorAll('.testi-card');
  if (testimonials.length === 0) return;

  // Clear existing interval if any
  if (slider._testimonialTimer) {
    clearInterval(slider._testimonialTimer);
  }

  // Clone buttons to clear old listeners
  let prevBtn = slider.querySelector('.slider-btn-prev');
  let nextBtn = slider.querySelector('.slider-btn-next');
  if (prevBtn && nextBtn) {
    const newPrev = prevBtn.cloneNode(true);
    const newNext = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    prevBtn = newPrev;
    nextBtn = newNext;
  }

  let currentIndex = 0;
  
  function showTestimonial(index) {
    testimonials.forEach(card => card.classList.remove('active'));
    if (testimonials[index]) {
      testimonials[index].classList.add('active');
    }
  }
  
  // Show initial testimonial
  showTestimonial(0);
  
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    });
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentIndex);
    });
  }
  
  // Auto slide every 8 seconds
  slider._testimonialTimer = setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }, 8000);
}

/* --- FAQ Accordion --- */
function initFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other FAQs
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- Active Nav Link Highlighter --- */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Resolve relative href to absolute pathname
    let targetPath;
    try {
      targetPath = new URL(href, window.location.href).pathname;
    } catch (e) {
      targetPath = href;
    }
    
    // Check match
    let isMatch = false;
    if (currentPath === targetPath) {
      isMatch = true;
    } else if (currentPath.endsWith(href)) {
      isMatch = true;
    } else if (href === 'index.html' && currentPath.endsWith('/')) {
      isMatch = true;
    } else if (targetPath.endsWith('/doctors.html') && currentPath.includes('/doctors/')) {
      isMatch = true;
    } else if (targetPath.endsWith('/departments.html') && currentPath.includes('/departments/')) {
      isMatch = true;
    } else if (targetPath.endsWith('/blog.html') && currentPath.includes('/blog/')) {
      isMatch = true;
    }
    
    if (isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Footer Dynamic Working Status --- */
function initFooterStatus() {
  const statusBadge = document.getElementById('hospital-status-footer');
  if (!statusBadge) return;
  
  // Laxmi Hospital is open 24/7/365, so we reflect that with absolute certitude
  statusBadge.innerHTML = '<span class="open">Open 24 Hours (Everyday)</span>';
}

/* --- Hero Image Slider --- */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider-container');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.dot');
  const prevBtn = slider.querySelector('.hero-slider-arrow.prev');
  const nextBtn = slider.querySelector('.hero-slider-arrow.next');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const slideInterval = 5000; // 5 seconds

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    if (dots[index]) {
      dots[index].classList.add('active');
    }
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, slideInterval);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function handleManualChange(action) {
    stopAutoplay();
    action();
    startAutoplay();
  }

  // Click listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      handleManualChange(() => showSlide(index));
    });
  });

  // Click listeners for arrows
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      handleManualChange(prevSlide);
    });

    nextBtn.addEventListener('click', () => {
      handleManualChange(nextSlide);
    });
  }

  // Initialize slider and start autoplay
  showSlide(0);
  startAutoplay();
  
  // Pause autoplay when tab is inactive to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });
}

/* --- Dynamic Priority Callback Popup Form --- */
function initPromoPopup() {
  // Prevent showing popup if dismissed or submitted in this session (or permanently)
  if (sessionStorage.getItem('laxmi_popup_dismissed') === 'true' || 
      sessionStorage.getItem('laxmi_popup_submitted') === 'true' || 
      localStorage.getItem('laxmi_popup_submitted') === 'true') {
    return;
  }

  const isSubfolder = window.location.pathname.includes('/doctors/') || window.location.pathname.includes('/departments/') || window.location.pathname.includes('/blog/');
  const pathPrefix = isSubfolder ? '../' : '';

  // Read system settings from localStorage
  const storedSettings = localStorage.getItem('laxmi_settings');
  if (storedSettings) {
    try {
      const settings = JSON.parse(storedSettings);
      if (settings.popupEnabled === false) return; // Disable popup globally if turned off
    } catch(e) {}
  }



  const popupHtml = `
    <div class="promo-popup-backdrop" id="promo-popup">
      <div class="promo-popup-content">
        <!-- Brand Side -->
        <div class="promo-popup-brand-side">
          <div>
            <img src="${pathPrefix}assets/images/logo-white.png" alt="Laxmi Hospital" class="promo-popup-brand-logo">
            <div class="promo-popup-brand-tag">Priority Desk</div>
            <h3 class="promo-popup-brand-title">Instant OPD Consultation</h3>
          </div>
          <ul class="promo-popup-bullets">
            <li class="promo-popup-bullet-item">
              <i class="fas fa-check-circle"></i>
              <span><strong>Zero Waiting Line</strong><br>Skip the lobby queues entirely.</span>
            </li>
            <li class="promo-popup-bullet-item">
              <i class="fas fa-check-circle"></i>
              <span><strong>Direct Triage Allocation</strong><br>Slots matched in 10 minutes.</span>
            </li>
            <li class="promo-popup-bullet-item">
              <i class="fas fa-check-circle"></i>
              <span><strong>Dedicated Call Coordination</strong><br>OPD assistance over the phone.</span>
            </li>
          </ul>
          <div class="promo-popup-trust-badge">
            <i class="fas fa-shield-alt"></i>
            <span>Firozabad's Leading Multi-Speciality Care</span>
          </div>
        </div>

        <!-- Form Side -->
        <div class="promo-popup-form-side">
          <button class="promo-popup-close" id="promo-popup-close-btn">&times;</button>
          <h2>Request Triage Callback</h2>
          <p>Provide your contact details below. Our chief administrative desk will coordinate your priority consultation slot immediately.</p>
          
          <form id="promo-popup-form">
            <div class="promo-input-group">
              <label for="promo-name" class="promo-input-label">Patient Name *</label>
              <div class="promo-input-container">
                <i class="fas fa-user-md promo-input-icon"></i>
                <input type="text" id="promo-name" class="promo-field" placeholder="Enter patient's full name" required>
              </div>
            </div>

            <div class="promo-input-group">
              <label for="promo-phone" class="promo-input-label">Mobile Number *</label>
              <div class="promo-input-container">
                <i class="fas fa-phone-alt promo-input-icon"></i>
                <input type="tel" id="promo-phone" class="promo-field" placeholder="10-digit mobile number" required>
              </div>
            </div>

            <div class="promo-input-group">
              <label for="promo-dept" class="promo-input-label">Specialty Department *</label>
              <div class="promo-input-container">
                <i class="fas fa-hospital-user promo-input-icon"></i>
                <select id="promo-dept" class="promo-field" required>
                  <option value="">-- Select Specialty --</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Gynecology">Maternity & Gynecology</option>
                  <option value="Orthopedics">Orthopedics & Spine</option>
                  <option value="Pediatrics">Pediatrics (Child Health)</option>
                  <option value="Emergency Care">Emergency Duty Desk</option>
                </select>
              </div>
            </div>

            <button type="submit" class="promo-submit-btn">
              <i class="fas fa-phone-alt"></i> Request Priority Callback
            </button>
            
            <button type="button" id="promo-popup-skip-link" class="promo-skip-btn">
              Skip & Continue to Site
            </button>
          </form>
          <div id="promo-popup-feedback" style="display:none; margin-top:16px; font-weight:700; font-size:0.95rem; text-align:center; padding:12px; border-radius:6px; background:#ECFDF5; border:1px solid #A7F3D0;"></div>
          
          <div class="promo-direct-call">
            <span>Need emergency triage?</span>
            <a href="tel:+917078221122"><i class="fas fa-phone-alt"></i> +91 7078221122</a>
          </div>
        </div>
      </div>
    </div>
  `;

  const popupCss = `
    .promo-popup-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .promo-popup-backdrop.active {
      opacity: 1;
      visibility: visible;
    }
    .promo-popup-content {
      background-color: var(--white);
      width: 90%;
      max-width: 760px;
      border-radius: 16px;
      box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.35), 0 0 50px rgba(0, 123, 158, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      transform: scale(0.92) translateY(20px);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      display: flex;
      flex-direction: row;
    }
    .promo-popup-backdrop.active .promo-popup-content {
      transform: scale(1) translateY(0);
    }
    
    /* Brand Side */
    .promo-popup-brand-side {
      width: 42%;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
      color: var(--white);
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      position: relative;
      overflow: hidden;
    }
    .promo-popup-brand-side::before {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      top: -100px;
      left: -100px;
      pointer-events: none;
    }
    .promo-popup-brand-logo {
      height: 44px;
      object-fit: contain;
      align-self: flex-start;
      margin-bottom: 25px;
    }
    .promo-popup-brand-tag {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--secondary);
      font-weight: 800;
      margin-bottom: 8px;
    }
    .promo-popup-brand-title {
      font-size: 1.5rem;
      font-weight: 800;
      line-height: 1.25;
      margin: 0;
      color: var(--white);
    }
    .promo-popup-bullets {
      list-style: none;
      padding: 0;
      margin: 30px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .promo-popup-bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 0.8rem;
      line-height: 1.4;
      opacity: 0.95;
    }
    .promo-popup-bullet-item i {
      color: var(--secondary);
      margin-top: 3px;
      font-size: 1rem;
    }
    .promo-popup-trust-badge {
      background: rgba(255, 255, 255, 0.1);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .promo-popup-trust-badge i {
      color: var(--secondary);
    }
    
    /* Form Side */
    .promo-popup-form-side {
      width: 58%;
      padding: 40px 36px;
      text-align: left;
      position: relative;
      background-color: var(--white);
    }
    .promo-popup-close {
      position: absolute;
      top: 16px;
      right: 20px;
      background: rgba(15, 23, 42, 0.05);
      border: none;
      font-size: 1.3rem;
      color: var(--text-muted);
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      z-index: 10;
    }
    .promo-popup-close:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--emergency);
      transform: rotate(90deg);
    }
    .promo-popup-form-side h2 {
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 8px;
      margin-top: 0;
      line-height: 1.2;
    }
    .promo-popup-form-side p {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 20px;
      margin-top: 0;
    }
    
    /* Input Groups */
    .promo-input-group {
      margin-bottom: 12px;
      position: relative;
    }
    .promo-input-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-dark);
      display: block;
      margin-bottom: 6px;
    }
    .promo-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    .promo-input-icon {
      position: absolute;
      left: 14px;
      color: var(--primary);
      font-size: 0.95rem;
      pointer-events: none;
    }
    .promo-field {
      width: 100%;
      padding: 11px 14px 11px 40px;
      border: 1.5px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.9rem;
      background: #F8FAFC;
      color: var(--text-dark);
      outline: none;
      transition: all 0.3s ease;
    }
    .promo-field:focus {
      border-color: var(--primary);
      background: var(--white);
      box-shadow: 0 0 0 4px rgba(0, 123, 158, 0.1);
    }
    .promo-submit-btn {
      width: 100%;
      padding: 13px;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: 8px;
      border: none;
      background: var(--gradient-primary);
      color: var(--white);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 123, 158, 0.2);
      margin-top: 20px;
    }
    .promo-submit-btn:hover {
      box-shadow: 0 6px 20px rgba(0, 123, 158, 0.35);
      transform: translateY(-1px);
    }
    .promo-submit-btn:active {
      transform: translateY(0);
    }
    .promo-skip-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      display: block;
      margin: 12px auto 0 auto;
      transition: var(--transition);
      outline: none;
    }
    .promo-skip-btn:hover {
      color: var(--primary);
    }
    
    .promo-direct-call {
      margin-top: 16px;
      font-size: 0.8rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border-color);
      padding-top: 12px;
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .promo-direct-call a {
      color: var(--primary);
      font-weight: 700;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .promo-popup-content {
        flex-direction: column;
        max-width: 400px;
        width: 92%;
      }
      .promo-popup-brand-side {
        width: 100%;
        padding: 24px;
      }
      .promo-popup-brand-logo {
        margin-bottom: 12px;
      }
      .promo-popup-brand-title {
        font-size: 1.25rem;
      }
      .promo-popup-bullets {
        display: none; /* Hide bullets on mobile for vertical space */
      }
      .promo-popup-form-side {
        width: 100%;
        padding: 24px;
      }
    }
  `;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = popupCss;
  document.head.appendChild(styleEl);

  // Inject HTML
  const divEl = document.createElement('div');
  divEl.innerHTML = popupHtml;
  document.body.appendChild(divEl.firstElementChild);

  const popup = document.getElementById('promo-popup');
  const closeBtn = document.getElementById('promo-popup-close-btn');
  const skipLink = document.getElementById('promo-popup-skip-link');
  const form = document.getElementById('promo-popup-form');
  const feedback = document.getElementById('promo-popup-feedback');

  // Show after 2 seconds
  setTimeout(() => {
    if (popup) popup.classList.add('active');
  }, 2000);

  const closePopup = () => {
    if (popup) {
      popup.classList.remove('active');
      sessionStorage.setItem('laxmi_popup_dismissed', 'true');
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  if (skipLink) {
    skipLink.addEventListener('click', closePopup);
  }

  if (popup) {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('promo-name').value.trim();
      const phone = document.getElementById('promo-phone').value.trim();
      const dept = document.getElementById('promo-dept').value;

      if (!/^[6-9]\d{9}$/.test(phone)) {
        if (feedback) {
          feedback.style.color = 'var(--emergency)';
          feedback.style.display = 'block';
          feedback.innerText = 'Please enter a valid 10-digit mobile number.';
        }
        return;
      }

      const inquiry = { name, phone, dept, type: 'Popup Callback', timestamp: new Date().toISOString() };
      let list = JSON.parse(localStorage.getItem('laxmi_inquiries') || '[]');
      list.push(inquiry);
      localStorage.setItem('laxmi_inquiries', JSON.stringify(list));

      // Prevent popup from ever showing again after successful submission
      localStorage.setItem('laxmi_popup_submitted', 'true');
      sessionStorage.setItem('laxmi_popup_submitted', 'true');

      if (feedback) {
        feedback.style.color = 'var(--primary)';
        feedback.style.display = 'block';
        feedback.innerText = '✓ Success! We will call you back in 10 minutes.';
      }

      setTimeout(() => {
        closePopup();
      }, 2000);
    });
  }
}

/* --- Senior Doctors Carousel logic --- */
function initDoctorsCarousel() {
  const container = document.querySelector('.docs-carousel-container');
  if (!container) return;

  const track = container.querySelector('.docs-carousel-track');
  if (!track) return;
  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  // Clear existing interval/timers if any
  if (container._autoPlayTimer) {
    clearInterval(container._autoPlayTimer);
  }

  // Remove existing window resize listener if any
  if (container._resizeHandler) {
    window.removeEventListener('resize', container._resizeHandler);
  }

  // Clone next/prev buttons to strip old listeners
  let nextBtn = document.getElementById('doc-next');
  let prevBtn = document.getElementById('doc-prev');
  if (nextBtn) {
    const newNext = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    nextBtn = newNext;
  }
  if (prevBtn) {
    const newPrev = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    prevBtn = newPrev;
  }

  const dotsNav = document.getElementById('doc-dots');
  let slideWidth = slides[0].getBoundingClientRect().width;
  let gap = 24; // standard grid gap in pixels
  let currentIndex = 0;

  function getItemsPerView() {
    const w = window.innerWidth;
    if (w > 1024) return 3;
    if (w > 768) return 2;
    return 1;
  }

  function updateSlidePosition() {
    const itemsPerView = getItemsPerView();
    const maxIndex = Math.max(0, slides.length - itemsPerView);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    // Recalculate slide width to handle layout changes dynamically
    slideWidth = slides[0].getBoundingClientRect().width;
    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    updateDots();
    
    if (prevBtn) prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
    if (nextBtn) nextBtn.style.display = currentIndex >= maxIndex ? 'none' : 'flex';
  }

  function updateDots() {
    if (!dotsNav) return;
    dotsNav.innerHTML = '';
    const itemsPerView = getItemsPerView();
    const dotsCount = Math.max(1, slides.length - itemsPerView + 1);

    if (dotsCount <= 1) {
      dotsNav.style.display = 'none';
      return;
    }
    dotsNav.style.display = 'flex';

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => {
        stopAutoPlay();
        currentIndex = i;
        updateSlidePosition();
        startAutoPlay();
      });
      dotsNav.appendChild(dot);
    }
  }

  // Create resize handler and save reference for potential removal
  container._resizeHandler = () => {
    updateSlidePosition();
  };
  window.addEventListener('resize', container._resizeHandler);

  // Autoplay Logic
  const autoPlayDelay = 4000; // 4 seconds

  function startAutoPlay() {
    stopAutoPlay();
    container._autoPlayTimer = setInterval(() => {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      if (maxIndex <= 0) return;

      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateSlidePosition();
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (container._autoPlayTimer) {
      clearInterval(container._autoPlayTimer);
      container._autoPlayTimer = null;
    }
  }

  // Start autoplay initially
  startAutoPlay();

  // Clean mouse events: remove first to avoid duplicates
  container.removeEventListener('mouseenter', stopAutoPlay);
  container.removeEventListener('mouseleave', startAutoPlay);
  container.addEventListener('mouseenter', stopAutoPlay);
  container.addEventListener('mouseleave', startAutoPlay);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      const itemsPerView = getItemsPerView();
      if (currentIndex < slides.length - itemsPerView) {
        currentIndex++;
        updateSlidePosition();
      }
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      if (currentIndex > 0) {
        currentIndex--;
        updateSlidePosition();
      }
      startAutoPlay();
    });
  }

  // Initial update
  setTimeout(updateSlidePosition, 100);
}

/* --- Dynamic LocalStorage Content Renderer --- */
function initDynamicContent() {
  const defaultDoctors = [
    {
      id: "dr-r-k-sharma",
      name: "Dr. R. K. Sharma",
      tag: "Chief Cardiologist",
      spec: "General Medicine & Cardiology",
      qual: "M.D. Medicine, M.R.C.P (London)",
      exp: "18+ Years of Experience",
      image: "assets/images/dr-r-k-sharma.png",
      departments: ["General Medicine", "Cardiology", "ICU", "Neurology"]
    },
    {
      id: "dr-lata-rajput",
      name: "Dr. Lata Rajput",
      tag: "Senior Gynecologist",
      spec: "Obstetrics & Gynecology",
      qual: "M.S. Obstetrics & Gynecology, D.G.O",
      exp: "12+ Years of Experience",
      image: "assets/images/dr-lata-rajput.jpg?v=1.0.1",
      departments: ["Gynecology"]
    },
    {
      id: "dr-amit-gupta",
      name: "Dr. Amit Gupta",
      tag: "Surgeon",
      spec: "Orthopedics & Joint Surgery",
      qual: "M.S. Orthopedics, Joint Specialist",
      exp: "15+ Years of Experience",
      image: "assets/images/dr-amit-gupta.png",
      departments: ["Orthopedics", "Trauma Care", "Physiotherapy"]
    },
    {
      id: "dr-paras-rajput",
      name: "Dr. Paras Rajput",
      tag: "Pediatrician",
      spec: "Pediatrics & Neonatal Care",
      qual: "M.D. Pediatrics, D.C.H (Pediatrics)",
      exp: "10+ Years of Experience",
      image: "assets/images/dr-paras-rajput.jpg?v=1.0.1",
      departments: ["Pediatrics"]
    },
    {
      id: "dr-ajay-bahadur-singh",
      name: "Dr. Ajay Bahadur Singh",
      tag: "Chief Surgeon",
      spec: "General & Laparoscopic Surgery",
      qual: "M.S. General Surgery, F.I.A.G.E.S",
      exp: "14+ Years of Experience",
      image: "assets/images/dr-ajay-bahadur-singh.jpg",
      departments: ["General Surgery"]
    },
    {
      id: "dr-sunita-khandelwal",
      name: "Dr. Sunita Khandelwal",
      tag: "ENT Specialist",
      spec: "ENT & Head-Neck Surgery",
      qual: "M.S. ENT, D.L.O",
      exp: "11+ Years of Experience",
      image: "assets/images/dr-sunita-khandelwal.png",
      departments: ["ENT"]
    },
    {
      id: "dr-mohammad-shafiq",
      name: "Dr. Mohammad Shafiq",
      tag: "Orthopedic & Trauma Surgeon",
      spec: "Orthopedics & Spine Surgery",
      qual: "M.B.B.S, M.S. (Orthopedics)",
      exp: "12+ Years of Experience",
      image: "assets/images/dr-mohammad-shafiq.jpg?v=1.0.1",
      departments: ["Orthopedics", "Trauma Care", "Joint Replacement", "Emergency Care"]
    },
    {
      id: "dr-piyush-taneja",
      name: "Dr. Piyush Taneja",
      tag: "Consultant Physician",
      spec: "General Medicine & Lifestyle Health",
      qual: "M.B.B.S., M.D. Medicine",
      exp: "15+ Years of Experience",
      image: "assets/images/dr-piyush-taneja.jpg",
      departments: ["General Medicine", "ICU", "Emergency Care"]
    },
    {
      id: "dr-sachin-tiwari",
      name: "Dr. Sachin Tiwari",
      tag: "Consultant Anesthesiologist & Intensivist",
      spec: "Critical Care & Anesthesia",
      qual: "MBBS, D.A., C.C.P.M.I.C.",
      exp: "12+ Years of Experience",
      image: "assets/images/dr-sachin-tiwari.jpg",
      departments: ["ICU", "Emergency Care", "Trauma Care"]
    },
    {
      id: "dr-premraj",
      name: "Dr. Premraj",
      tag: "Senior Orthopedic Surgeon",
      spec: "Orthopedics & Joint Care",
      qual: "MBBS, MS (Orthopedics)",
      exp: "18+ Years of Experience",
      image: "assets/images/dr-premraj.jpg",
      departments: ["Orthopedics", "Trauma Care", "Joint Replacement"]
    }
  ];

  const defaultReviews = [
    {
      id: "rev-1",
      stars: 5,
      text: "When my wife had unexpected clinical complications in the middle of the night during labor, we rushed to Laxmi Hospital. Dr. Lata Rajput handled the case with ultimate precision. Her medical authority saved both my child and my wife. We are eternally grateful!",
      author: "Manoj Kumar",
      authorSub: "Firozabad Resident",
      avatar: "MK"
    },
    {
      id: "rev-2",
      stars: 5,
      text: "My grandfather had severe joint erosion and could not walk. Dr. Amit Gupta completed a total knee replacement surgery at Laxmi Hospital. The post-operative physiotherapy care was exceptional. He is walking absolutely independently now!",
      author: "Amit Yadav",
      authorSub: "Shikohabad Patient Relative",
      avatar: "AY"
    },
    {
      id: "rev-3",
      stars: 5,
      text: "Laxmi Hospital is by far the cleanest and most professional medical facility in Firozabad district. From their level-3 ICU monitors to the transparent billing on health insurance cards, they operate on corporate brand levels.",
      author: "Ramesh Gupta",
      authorSub: "Local Businessman",
      avatar: "RG"
    }
  ];

  // 1. Initialize data in LocalStorage if not exists
  const defaultDepartments = [
    { id: "general-medicine", title: "General Medicine", icon: "assets/images/dept-medicine.png", isActive: true },
    { id: "orthopedics", title: "Orthopedics", icon: "assets/images/dept-orthopedic.png", isActive: true },
    { id: "general-surgery", title: "General Surgery", icon: "assets/images/dept-surgery.png", isActive: true },
    { id: "pediatrics", title: "Pediatrics", icon: "assets/images/dept-pediatrics.png", isActive: true },
    { id: "urology", title: "Urology", icon: "assets/images/dept-urology.png", isActive: true },
    { id: "gastrology", title: "Gastrology", icon: "assets/images/dept-gastrology.png", isActive: true },
    { id: "ent", title: "ENT", icon: "assets/images/dept-ent.png", isActive: true },
    { id: "icu", title: "Critical Care", icon: "assets/images/dept-icu.png", isActive: true },
    { id: "trauma-care", title: "Trauma Care", icon: "assets/images/dept-trauma.png", isActive: true },
    { id: "joint-replacement", title: "Joint Replacement", icon: "assets/images/dept-joint.png", isActive: true }
  ];

  const defaultBlogs = [
    {
      id: "dengue-symptoms",
      title: "Dengue Symptoms, Prevention & Platelet Management",
      authorId: "dr-r-k-sharma",
      authorName: "Dr. R. K. Sharma",
      date: "2026-06-01",
      tag: "General Medicine",
      image: "assets/images/blog-dengue.png",
      summary: "Understand standard guidelines for managing Dengue fever in Uttar Pradesh, monitoring warning triggers, and avoiding self-medication dangers.",
      tip: "Prevent mosquito breeding by clearing standing water around your home and wear protective clothing.",
      content: "Dengue fever is a significant health issue in Uttar Pradesh. It is vital to recognize the early symptoms such as high fever, severe headache, muscle and joint pain, and skin rash. Early clinical consultation is critical to avoid complications. Monitoring warning signs like severe abdominal pain, persistent vomiting, mucosal bleeding, and sudden platelet count drops is essential. Managing Dengue requires proper hydration, symptom relief, and absolute avoidance of self-medication with NSAIDs, which can worsen bleeding. Preventive actions such as clearing standing water and mosquito containment remain the primary defense mechanisms.",
      isActive: true
    },
    {
      id: "pregnancy-care",
      title: "Healthy Pregnancy Care Tips: First Trimester to Labor",
      authorId: "dr-lata-rajput",
      authorName: "Dr. Lata Rajput",
      date: "2026-05-28",
      tag: "Obstetrics & Gynecology",
      image: "assets/images/blog-pregnancy.png",
      summary: "A comprehensive clinical timeline mapping maternal nutrition targets, required vaccine dates, and early markers of high-risk pregnancy.",
      tip: "Plan regular antenatal health checkups and maintain a healthy, nutrient-rich diet rich in iron and calcium.",
      content: "Maternal wellness requires targeted clinical care from the early stages of pregnancy up to labor. Essential steps include regular antenatal checks, precise screening schedules, proper intake of folic acid, iron, and calcium, and customized diet plans. Special emphasis must be placed on detecting warning markers like high blood pressure, gestational diabetes, and fetal distress early. Adhering to the recommended vaccine dates and mapping out birth plans under expert clinical supervision reduces complications during delivery.",
      isActive: true
    },
    {
      id: "child-health-tips",
      title: "Newborn Vaccination & Essential Nutrition Guides",
      authorId: "dr-paras-rajput",
      authorName: "Dr. Paras Rajput",
      date: "2026-05-15",
      tag: "Pediatrics",
      image: "assets/images/blog-child.png",
      summary: "Important guidelines detailing standard pediatric vaccination timings, physical developmental charts, and infantile allergy precautions.",
      tip: "Adhere strictly to the vaccination chart schedule given by your pediatrician to build strong immunity.",
      content: "Newborn care demands structured clinical timelines for vaccinations, tracking physical development, and managing pediatric nutrition. Timely immunizations shield children from lethal viral and bacterial pathogens. This guide provides information on vital vaccines like BCG, HepB, Polio, DPT, and MMR. It also offers advice on exclusive breastfeeding timelines, introduction of solid foods, and early detection of childhood allergies or developmental delays.",
      isActive: true
    },
    {
      id: "diabetes-management",
      title: "Diabetes Management: HbA1c Control & Nutrition",
      authorId: "dr-r-k-sharma",
      authorName: "Dr. R. K. Sharma",
      date: "2026-05-10",
      tag: "General Medicine",
      image: "assets/images/blog-diabetes.png",
      summary: "A structured clinical manual to lower high blood glucose levels, plan low-glycemic diets, and monitor vascular diabetic neuropathy complications.",
      tip: "Exercise for 30 minutes daily, choose low-glycemic index foods, and measure blood glucose regularly.",
      content: "Effective diabetes management is centered on strict blood glucose regulation, lowering HbA1c, and preventing vascular complications. Patients should combine lifestyle modifications, low-glycemic nutrition, and daily physical activity. Regular checkups for kidney, retina, and diabetic foot conditions are vital to intercept microvascular damage early. Constant monitoring and consultation help stabilize blood sugar levels and preserve organ function.",
      isActive: true
    },
    {
      id: "heart-care-tips",
      title: "Preventive Heart Care Tips: Exercise & Stress Control",
      authorId: "dr-r-k-sharma",
      authorName: "Dr. R. K. Sharma",
      date: "2026-05-02",
      tag: "Cardiology",
      image: "assets/images/blog-heart.png",
      summary: "Five cardiac-boosting strategies to reduce arterial cholesterol plaque, regulate blood pressure parameters, and identify early chest pain markers.",
      tip: "Reduce sodium intake, walk briskly for 30 minutes, avoid smoking, and control daily stress levels.",
      content: "Cardiovascular health is maintained through proactive screening, cholesterol management, blood pressure control, and cardiorespiratory exercise. This guide outlines key methods to avoid arterial plaque, restrict sodium intake, manage emotional stress, and spot critical signals like radiating chest pain or sudden shortness of breath. Implementing these heart-healthy habits significantly lowers the risk of acute coronary syndromes.",
      isActive: true
    }
  ];

  const defaultPackages = [
    {
      id: "pkg-basic",
      name: "Basic Full Body Checkup",
      icon: "fas fa-user-check",
      includes: "Includes 45 Vital Parameters",
      originalPrice: "₹2,499",
      price: "₹1,499",
      badge: "",
      tests: [
        "Complete Hemogram (CBC)",
        "Kidney Function Profile",
        "Fasting Blood Glucose",
        "Lipid Cardiac Profile (Cholesterol)",
        "Urine Routine Examination"
      ]
    },
    {
      id: "pkg-diabetes",
      name: "Diabetes Care Package",
      icon: "fas fa-tint",
      includes: "Includes 28 Targeted Diagnostics",
      originalPrice: "₹1,999",
      price: "₹999",
      badge: "Best Seller",
      tests: [
        "HbA1c (Average 3-Months Sugar)",
        "Fasting & PP Blood Sugar",
        "Serum Creatinine (Kidney)",
        "Complete Urine Microalbumin",
        "Supervised Diabetologist Consult"
      ]
    },
    {
      id: "pkg-women",
      name: "Women Health Package",
      icon: "fas fa-female",
      includes: "Includes 52 Specialized Tests",
      originalPrice: "₹3,499",
      price: "₹1,999",
      badge: "",
      tests: [
        "Thyroid Stimulating Hormone (TSH)",
        "Serum Calcium & Vitamin D3",
        "Complete Blood Counts & Iron",
        "Pelvic Ultrasound screening (USG)",
        "Gynecologist Consult"
      ]
    },
    {
      id: "pkg-senior",
      name: "Senior Citizen Screening",
      icon: "fas fa-blind",
      includes: "Includes 60 Geriatric Diagnostics",
      originalPrice: "₹4,499",
      price: "₹2,499",
      badge: "",
      tests: [
        "Cardiac Screening (ECG Profile)",
        "Liver & Kidney Function Panels",
        "Uric Acid & Joint Profiling",
        "Vision & Auditory screenings",
        "Chief Physician Consult"
      ]
    }
  ];

  if (!localStorage.getItem('laxmi_packages')) {
    localStorage.setItem('laxmi_packages', JSON.stringify(defaultPackages));
  }

  if (!localStorage.getItem('laxmi_doctors')) {
    localStorage.setItem('laxmi_doctors', JSON.stringify(defaultDoctors));
  }
  if (!localStorage.getItem('laxmi_reviews')) {
    localStorage.setItem('laxmi_reviews', JSON.stringify(defaultReviews));
  }
  if (!localStorage.getItem('laxmi_departments')) {
    localStorage.setItem('laxmi_departments', JSON.stringify(defaultDepartments));
  }
  if (!localStorage.getItem('laxmi_blog')) {
    localStorage.setItem('laxmi_blog', JSON.stringify(defaultBlogs));
  }

  // Helper to safely parse local storage entries
  function safeParseLocalStorage(key, fallback) {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    try {
      return JSON.parse(data) || fallback;
    } catch (e) {
      console.error(`Failed to parse localStorage key "${key}":`, e);
      return fallback;
    }
  }

  // Load from LocalStorage
  const doctorsList = safeParseLocalStorage('laxmi_doctors', []);
  const reviewsList = safeParseLocalStorage('laxmi_reviews', []);
  const departmentsList = safeParseLocalStorage('laxmi_departments', []);
  const blogsList = safeParseLocalStorage('laxmi_blog', []);
  const packagesList = safeParseLocalStorage('laxmi_packages', []);

  // Self-healing database injection/updates for doctors
  let docListModified = false;
  if (doctorsList.length > 0) {
    // 1. Remove Dr. Sneha Singh if present
    const snehaIndex = doctorsList.findIndex(d => d.id === 'dr-sneha-singh');
    if (snehaIndex !== -1) {
      doctorsList.splice(snehaIndex, 1);
      docListModified = true;
    }

    // 2. Check/Inject Dr. Lata Rajput
    if (!doctorsList.some(d => d.id === 'dr-lata-rajput')) {
      const lata = {
        id: "dr-lata-rajput",
        name: "Dr. Lata Rajput",
        tag: "Senior Gynecologist",
        spec: "Obstetrics & Gynecology",
        qual: "M.S. Obstetrics & Gynecology, D.G.O",
        exp: "12+ Years of Experience",
        image: "assets/images/dr-lata-rajput.jpg?v=1.0.1",
        departments: ["Gynecology"]
      };
      const sharmaIndex = doctorsList.findIndex(d => d.id === 'dr-r-k-sharma');
      if (sharmaIndex !== -1) {
        doctorsList.splice(sharmaIndex + 1, 0, lata);
      } else {
        doctorsList.unshift(lata);
      }
      docListModified = true;
    }

    // 3. Check/Inject Dr. Mohammad Shafiq
    if (!doctorsList.some(d => d.id === 'dr-mohammad-shafiq')) {
      const shafiq = {
        id: "dr-mohammad-shafiq",
        name: "Dr. Mohammad Shafiq",
        tag: "Orthopedic & Trauma Surgeon",
        spec: "Orthopedics & Spine Surgery",
        qual: "M.B.B.S, M.S. (Orthopedics)",
        exp: "12+ Years of Experience",
        image: "assets/images/dr-mohammad-shafiq.jpg?v=1.0.1",
        departments: ["Orthopedics", "Trauma Care", "Joint Replacement", "Emergency Care"]
      };
      doctorsList.push(shafiq);
      docListModified = true;
    }
    
    // 3.5. Check/Inject Dr. Piyush Taneja
    if (!doctorsList.some(d => d.id === 'dr-piyush-taneja')) {
      const taneja = {
        id: "dr-piyush-taneja",
        name: "Dr. Piyush Taneja",
        tag: "Consultant Physician",
        spec: "General Medicine & Lifestyle Health",
        qual: "M.B.B.S., M.D. Medicine",
        exp: "15+ Years of Experience",
        image: "assets/images/dr-piyush-taneja.jpg",
        departments: ["General Medicine", "ICU", "Emergency Care"]
      };
      doctorsList.push(taneja);
      docListModified = true;
    }
    
    // 3.6. Check/Inject Dr. Sachin Tiwari
    if (!doctorsList.some(d => d.id === 'dr-sachin-tiwari')) {
      const tiwari = {
        id: "dr-sachin-tiwari",
        name: "Dr. Sachin Tiwari",
        tag: "Consultant Anesthesiologist & Intensivist",
        spec: "Critical Care & Anesthesia",
        qual: "MBBS, D.A., C.C.P.M.I.C.",
        exp: "12+ Years of Experience",
        image: "assets/images/dr-sachin-tiwari.jpg",
        departments: ["ICU", "Emergency Care", "Trauma Care"]
      };
      doctorsList.push(tiwari);
      docListModified = true;
    }
    
    // 3.7. Check/Inject Dr. Premraj
    if (!doctorsList.some(d => d.id === 'dr-premraj')) {
      const premraj = {
        id: "dr-premraj",
        name: "Dr. Premraj",
        tag: "Senior Orthopedic Surgeon",
        spec: "Orthopedics & Joint Care",
        qual: "MBBS, MS (Orthopedics)",
        exp: "18+ Years of Experience",
        image: "assets/images/dr-premraj.jpg",
        departments: ["Orthopedics", "Trauma Care", "Joint Replacement"]
      };
      doctorsList.push(premraj);
      docListModified = true;
    }
    
    // 4. Force cache-busting version query for Dr. Shafiq, Dr. Paras Rajput, and Dr. Lata Rajput image paths
    doctorsList.forEach(d => {
      if (d.id === 'dr-mohammad-shafiq' && d.image.startsWith('assets/images/') && !d.image.includes('?v=')) {
        d.image = 'assets/images/dr-mohammad-shafiq.jpg?v=1.0.1';
        docListModified = true;
      }
      if (d.id === 'dr-paras-rajput' && d.image.startsWith('assets/images/') && !d.image.includes('?v=')) {
        d.image = 'assets/images/dr-paras-rajput.jpg?v=1.0.1';
        docListModified = true;
      }
      if (d.id === 'dr-lata-rajput' && d.image.startsWith('assets/images/') && !d.image.includes('?v=')) {
        d.image = 'assets/images/dr-lata-rajput.jpg?v=1.0.1';
        docListModified = true;
      }
    });

    if (docListModified) {
      localStorage.setItem('laxmi_doctors', JSON.stringify(doctorsList));
    }
  }

  // Self-healing database reviews sync
  if (reviewsList.length > 0) {
    let reviewsListModified = false;
    reviewsList.forEach(r => {
      if (r.text && r.text.includes("Dr. Sneha Singh")) {
        r.text = r.text.replace(/Dr\. Sneha Singh/g, "Dr. Lata Rajput");
        reviewsListModified = true;
      }
    });
    if (reviewsListModified) {
      localStorage.setItem('laxmi_reviews', JSON.stringify(reviewsList));
    }
  }

  // Self-healing database blogs sync
  if (blogsList.length > 0) {
    let blogsListModified = false;
    blogsList.forEach(b => {
      if (b.authorId === 'dr-sneha-singh') {
        b.authorId = 'dr-lata-rajput';
        b.authorName = 'Dr. Lata Rajput';
        blogsListModified = true;
      }
      if (b.content && b.content.includes("Dr. Sneha Singh")) {
        b.content = b.content.replace(/Dr\. Sneha Singh/g, "Dr. Lata Rajput");
        blogsListModified = true;
      }
      if (b.summary && b.summary.includes("Dr. Sneha Singh")) {
        b.summary = b.summary.replace(/Dr\. Sneha Singh/g, "Dr. Lata Rajput");
        blogsListModified = true;
      }
    });
    if (blogsListModified) {
      localStorage.setItem('laxmi_blog', JSON.stringify(blogsList));
    }
  }

  // Calculate dynamic path prefix for links and assets depending on directory depth
  const isSubfolder = window.location.pathname.includes('/doctors/') || window.location.pathname.includes('/departments/') || window.location.pathname.includes('/blog/');
  const pathPrefix = isSubfolder ? '../' : '';

  const defaultBlogIds = [
    "child-health-tips", "dengue-symptoms", "diabetes-management", "heart-care-tips", "pregnancy-care"
  ];
  const defaultDeptIds = [
    "cardiology", "emergency-care", "ent", "gastrology", "general-medicine", 
    "general-surgery", "gynecology", "icu", "joint-replacement", 
    "neurology", "orthopedics", "pediatrics", "physiotherapy", "trauma-care", "urology"
  ];

  // Helper escape function
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 1.5 Check Blog Reader Mode
  let isReaderMode = false;
  if (window.location.pathname.includes('blog.html') && window.location.search.includes('read=')) {
    const urlParams = new URLSearchParams(window.location.search);
    const readId = urlParams.get('read');
    const blog = blogsList.find(b => b.id === readId);
    if (blog) {
      isReaderMode = true;
      // Update hero
      const heroSection = document.querySelector('.page-hero');
      if (heroSection) {
        heroSection.innerHTML = `
          <div class="container">
            <h1>Health Portal Article</h1>
            <div class="page-hero-breadcrumbs">
              <a href="index.html">Home</a> &nbsp;/&nbsp; <a href="blog.html">Blog</a> &nbsp;/&nbsp; Article
            </div>
          </div>
        `;
      }

      // Replace main list section with reader canvas
      const mainSection = document.querySelector('.section');
      if (mainSection) {
        mainSection.innerHTML = `
          <div class="container dept-page-grid">
            <div class="dept-content-section" style="line-height:1.8; text-align: left;">
              <span class="section-tag">${escapeHTML(blog.tag)}</span>
              <h1 style="font-size:2.2rem;margin-bottom:16px;line-height:1.2;color:var(--primary);font-weight:800;">${escapeHTML(blog.title)}</h1>
              
              <div class="blog-card-meta" style="margin-bottom:24px;border-bottom:1px solid var(--border-color);padding-bottom:12px;display:flex;gap:16px;font-size:0.85rem;color:var(--text-muted);">
                <span><i class="far fa-calendar"></i> Published: ${new Date(blog.date).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</span>
                <span><i class="far fa-user"></i> By: ${escapeHTML(blog.authorName)}</span>
                <span><i class="far fa-clock"></i> 5 Mins Read</span>
              </div>

              <div class="blog-article-image-box" style="margin-bottom: 24px; border-radius: var(--radius-lg); overflow: hidden; max-height: 400px; box-shadow: var(--shadow-sm);">
                <img src="${blog.image}" alt="${escapeHTML(blog.title)}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>

              <div style="font-size:1.15rem; line-height:1.75; color:var(--text-dark); margin-bottom: 24px; white-space: pre-line;">
                ${escapeHTML(blog.content)}
              </div>

              <div class="blog-card-tip" style="background-color: var(--primary-light); border-left: 4px solid var(--primary); padding: 20px; border-radius: 4px; margin-bottom: 30px; display: flex; gap: 12px; align-items: flex-start; text-align: left;">
                <i class="fas fa-lightbulb" style="color: var(--primary); font-size: 1.2rem; margin-top: 2px;"></i>
                <span><strong style="color: var(--primary);">Health Tip:</strong> ${escapeHTML(blog.tip)}</span>
              </div>

              <div style="margin-top: 30px;">
                <a href="blog.html" class="btn btn-outline" style="padding: 10px 24px;"><i class="fas fa-arrow-left"></i> Back to Blog Portal</a>
              </div>
            </div>

            <!-- SIDEBAR -->
            <div class="dept-sidebar" style="text-align: left;">
              <div class="sidebar-widget">
                <h3>Other Active Articles</h3>
                <div class="sidebar-menu-list" id="sidebar-other-articles">
                  <!-- populated dynamically -->
                </div>
              </div>

              <div class="sidebar-widget" style="background-color:var(--primary);color:var(--white);text-align:center;border-radius: var(--radius-md);">
                <h3 style="color:var(--white);border-bottom-color:rgba(255,255,255,0.2);">Consult Doctor</h3>
                <p style="font-size:0.875rem;opacity:0.9;margin-bottom:20px;">Want a direct diagnostic consultation? Schedule your OPD ticket online now.</p>
                <a href="appointment.html?doctor=${blog.authorId}" class="btn btn-secondary" style="width:100%;">Book Ticket</a>
              </div>
            </div>
          </div>
        `;

        // Render other articles in the sidebar
        const otherArticlesContainer = document.getElementById('sidebar-other-articles');
        if (otherArticlesContainer) {
          const otherBlogs = blogsList.filter(b => b.isActive && b.id !== readId).slice(0, 5);
          otherBlogs.forEach(ob => {
            const item = document.createElement('a');
            item.href = `blog.html?read=${ob.id}`;
            item.className = 'sidebar-menu-item';
            item.textContent = ob.title;
            otherArticlesContainer.appendChild(item);
          });
        }
      }
    }
  }

  // 1.6 Render Specialties / Departments
  const deptGrid = document.querySelector('.dept-grid');
  if (deptGrid) {
    deptGrid.innerHTML = '';
    const activeDepts = departmentsList.filter(d => d.isActive);
    activeDepts.forEach(dept => {
      const isDefaultDept = defaultDeptIds.includes(dept.id);
      const link = isDefaultDept 
        ? `${pathPrefix}departments/${dept.id}.html` 
        : `${pathPrefix}appointment.html?dept=${dept.id}`;
      
      let iconSrc = dept.icon;
      if (iconSrc && iconSrc.startsWith('assets/')) {
        iconSrc = pathPrefix + iconSrc;
      }

      const card = document.createElement('a');
      card.href = link;
      card.className = 'dept-card';
      card.innerHTML = `
        <div class="dept-icon-wrapper">
          <img src="${iconSrc}" alt="${escapeHTML(dept.title)}" class="dept-icon-img">
        </div>
        <h3 class="dept-title">${escapeHTML(dept.title)}</h3>
      `;
      deptGrid.appendChild(card);
    });
  }

  // 2. Render Doctors Carousel on homepage
  const docsCarouselTrack = document.querySelector('.docs-carousel-track');
  if (docsCarouselTrack) {
    docsCarouselTrack.innerHTML = '';
    const defaultDocIds = ["dr-r-k-sharma", "dr-lata-rajput", "dr-amit-gupta", "dr-paras-rajput", "dr-ajay-bahadur-singh", "dr-sunita-khandelwal", "dr-mohammad-shafiq", "dr-piyush-taneja", "dr-sachin-tiwari", "dr-premraj"];

    doctorsList.forEach(doc => {
      const isDefaultDoc = defaultDocIds.includes(doc.id);
      const bioLink = isDefaultDoc ? `${pathPrefix}doctors/${doc.id}.html` : `${pathPrefix}appointment.html?doctor=${doc.id}`;
      const bioLabel = isDefaultDoc ? 'View Bio' : 'Consult Desk';
      let imageSrc = doc.image;
      if (imageSrc && imageSrc.startsWith('assets/')) {
        imageSrc = pathPrefix + imageSrc;
      }

      const card = document.createElement('div');
      card.className = 'doc-card';
      card.innerHTML = `
        <div class="doc-img-wrapper">
          <div class="doc-avatar-container">
            <img src="${imageSrc}" alt="${escapeHTML(doc.name)}" class="doc-img">
          </div>
        </div>
        <div class="doc-info">
          <h3>${escapeHTML(doc.name)}</h3>
          <div class="doc-spec">${escapeHTML(doc.spec)}</div>
          <div class="doc-qual"><i class="fas fa-graduation-cap"></i> ${escapeHTML(doc.qual)}</div>
          <div class="doc-exp"><i class="fas fa-briefcase"></i> ${escapeHTML(doc.exp)}</div>
          <div class="doc-cta">
            <a href="${pathPrefix}appointment.html?doctor=${doc.id}" class="doc-btn doc-btn-book">Book OPD</a>
            <a href="${bioLink}" class="doc-btn doc-btn-profile">${bioLabel}</a>
          </div>
        </div>
      `;
      docsCarouselTrack.appendChild(card);
    });
  }

  // 3. Render Doctors Grid on doctors directory page (doctors.html)
  const docsGrid = document.querySelector('.docs-grid');
  if (docsGrid) {
    docsGrid.innerHTML = '';
    const defaultDocIds = ["dr-r-k-sharma", "dr-lata-rajput", "dr-amit-gupta", "dr-paras-rajput", "dr-ajay-bahadur-singh", "dr-sunita-khandelwal", "dr-mohammad-shafiq", "dr-piyush-taneja", "dr-sachin-tiwari", "dr-premraj"];

    doctorsList.forEach(doc => {
      const isDefaultDoc = defaultDocIds.includes(doc.id);
      const bioLink = isDefaultDoc ? `${pathPrefix}doctors/${doc.id}.html` : `${pathPrefix}appointment.html?doctor=${doc.id}`;
      const bioLabel = isDefaultDoc ? 'View Bio' : 'Consult Desk';
      let imageSrc = doc.image;
      if (imageSrc && imageSrc.startsWith('assets/')) {
        imageSrc = pathPrefix + imageSrc;
      }

      const card = document.createElement('div');
      card.className = 'doc-card';
      card.innerHTML = `
        <div class="doc-img-wrapper">
          <div class="doc-avatar-container">
            <img src="${imageSrc}" alt="${escapeHTML(doc.name)}" class="doc-img">
          </div>
        </div>
        <div class="doc-info">
          <h3>${escapeHTML(doc.name)}</h3>
          <div class="doc-spec">${escapeHTML(doc.spec)}</div>
          <div class="doc-qual"><i class="fas fa-graduation-cap"></i> ${escapeHTML(doc.qual)}</div>
          <div class="doc-exp"><i class="fas fa-briefcase"></i> ${escapeHTML(doc.exp)}</div>
          <div class="doc-cta">
            <a href="${pathPrefix}appointment.html?doctor=${doc.id}" class="doc-btn doc-btn-book">Book OPD</a>
            <a href="${bioLink}" class="doc-btn doc-btn-profile">${bioLabel}</a>
          </div>
        </div>
      `;
      docsGrid.appendChild(card);
    });
  }

  // 4. Render Testimonials on homepage
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    // Remove existing testi-cards
    const existingCards = slider.querySelectorAll('.testi-card');
    existingCards.forEach(card => card.remove());

    // Insert new cards before the slider controls
    const controls = slider.querySelector('.slider-controls');
    reviewsList.forEach((rev, idx) => {
      const card = document.createElement('div');
      card.className = `testi-card${idx === 0 ? ' active' : ''}`;
      
      let starsHtml = '';
      for (let i = 0; i < rev.stars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
      }

      card.innerHTML = `
        <div class="testi-stars">
          ${starsHtml}
        </div>
        <p class="testi-text">"${escapeHTML(rev.text)}"</p>
        <div class="testi-user">
          <div class="testi-user-avatar">${escapeHTML(rev.avatar || (rev.author ? rev.author.substring(0,2).toUpperCase() : 'LH'))}</div>
          <div class="testi-user-info">
            <h4>${escapeHTML(rev.author)}</h4>
            <p>${escapeHTML(rev.authorSub)}</p>
          </div>
        </div>
      `;

      if (controls) {
        slider.insertBefore(card, controls);
      } else {
        slider.appendChild(card);
      }
    });
  }

  // 5. Render Health Blog Grid dynamically
  if (!isReaderMode) {
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
      blogGrid.innerHTML = '';
      const activeBlogs = blogsList.filter(b => b.isActive);
      
      // On the homepage, limit to the latest 3 articles
      const isHomepage = !window.location.pathname.includes('blog.html') && !isSubfolder;
      const blogsToRender = isHomepage ? activeBlogs.slice(0, 3) : activeBlogs;

      blogsToRender.forEach(blog => {
        const isDefaultBlog = defaultBlogIds.includes(blog.id);
        const articleLink = isDefaultBlog 
          ? `${pathPrefix}blog/${blog.id}.html` 
          : `${pathPrefix}blog.html?read=${blog.id}`;
        
        let imgUrl = blog.image;
        if (imgUrl && imgUrl.startsWith('assets/')) {
          imgUrl = pathPrefix + imgUrl;
        }

        const formattedDate = new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
          <div class="blog-card-img-wrapper">
            <img src="${imgUrl}" alt="${escapeHTML(blog.title)}" class="blog-card-img">
            <span class="blog-card-tag">${escapeHTML(blog.tag)}</span>
          </div>
          <div class="blog-card-content">
            <div class="blog-card-meta">
              <span><i class="far fa-calendar"></i> ${formattedDate}</span>
              <span><i class="far fa-user"></i> ${escapeHTML(blog.authorName)}</span>
            </div>
            <h3><a href="${articleLink}">${escapeHTML(blog.title)}</a></h3>
            <p>${escapeHTML(blog.summary)}</p>
            <div class="blog-card-tip">
              <i class="fas fa-lightbulb"></i>
              <span><strong>Health Tip:</strong> ${escapeHTML(blog.tip)}</span>
            </div>
            <a href="${articleLink}" class="blog-card-link">Read Full Guide <i class="fas fa-arrow-right"></i></a>
          </div>
        `;
      });
    }
  }

  // 4.5 Render Health Packages dynamically on homepage
  const pkgGrid = document.querySelector('.pkg-grid');
  if (pkgGrid) {
    pkgGrid.innerHTML = '';
    packagesList.forEach(pkg => {
      const card = document.createElement('div');
      const hasBadge = pkg.badge && pkg.badge.trim() !== '';
      card.className = `pkg-card${hasBadge ? ' popular' : ''}`;
      
      let badgeHtml = '';
      if (hasBadge) {
        badgeHtml = `<div class="pkg-badge">${escapeHTML(pkg.badge)}</div>`;
      }
      
      let testsHtml = '';
      if (pkg.tests && Array.isArray(pkg.tests)) {
        testsHtml = pkg.tests.map(test => `
          <li class="pkg-test-item"><i class="fas fa-check"></i> ${escapeHTML(test)}</li>
        `).join('');
      }
      
      const btnClass = hasBadge ? 'btn btn-secondary' : 'btn btn-primary';
      
      card.innerHTML = `
        ${badgeHtml}
        <div class="pkg-icon"><i class="${escapeHTML(pkg.icon || 'fas fa-user-check')}"></i></div>
        <h3>${escapeHTML(pkg.name)}</h3>
        <div class="pkg-includes">${escapeHTML(pkg.includes)}</div>
        <div class="pkg-price-box">
          ${pkg.originalPrice ? `<span class="pkg-original-price">${escapeHTML(pkg.originalPrice)}</span>` : ''}
          <div class="pkg-price">${escapeHTML(pkg.price)}</div>
        </div>
        <ul class="pkg-tests-list">
          ${testsHtml}
        </ul>
        <a href="#appointment" class="btn ${btnClass}" style="margin-top:auto;">Book Package</a>
      `;
      pkgGrid.appendChild(card);
    });
  }

  // 5. If on a doctor profile bio page, dynamically update it with database values
  if (window.location.pathname.includes('/doctors/')) {
    const filename = window.location.pathname.split('/').pop();
    const docId = filename.replace('.html', '');
    const docData = doctorsList.find(d => d.id === docId);
    if (docData) {
      // Update Name
      const nameHeader = document.querySelector('.doc-profile-name');
      if (nameHeader) nameHeader.textContent = docData.name;
      
      const heroHeader = document.querySelector('.page-hero h1');
      if (heroHeader) heroHeader.textContent = `${docData.name} Profile`;

      const breadcrumb = document.querySelector('.page-hero-breadcrumbs');
      if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="../index.html">Home</a> &nbsp;/&nbsp; <a href="../doctors.html">Doctors</a> &nbsp;/&nbsp; ${escapeHTML(docData.name)}`;
      }

      // Update Image
      const imgEl = document.querySelector('.doc-profile-img');
      if (imgEl) {
        let imgPath = docData.image;
        if (imgPath && imgPath.startsWith('assets/')) {
          imgPath = '../' + imgPath;
        }
        imgEl.src = imgPath;
        imgEl.alt = docData.name;
      }

      // Update Title/Tag
      const titleEl = document.querySelector('.doc-profile-title');
      if (titleEl) {
        titleEl.textContent = docData.tag;
      }
    }
  }

  // 6. Generic scanner to update doctor cards on static pages (like departments)
  doctorsList.forEach(doc => {
    const bioLinks = document.querySelectorAll(`a[href*="doctors/${doc.id}.html"]`);
    bioLinks.forEach(link => {
      const card = link.closest('.about-pillar-card') || link.closest('.doc-card');
      if (card) {
        const img = card.querySelector('img');
        if (img) {
          let imgPath = doc.image;
          if (imgPath && imgPath.startsWith('assets/')) {
            imgPath = pathPrefix + imgPath;
          }
          img.src = imgPath;
          img.alt = doc.name;
        }
        const nameHeader = card.querySelector('h3, h4');
        if (nameHeader) {
          nameHeader.textContent = doc.name;
        }
        const subtitle = card.querySelector('.doc-spec, p[style*="uppercase"]');
        if (subtitle) {
          subtitle.textContent = doc.tag;
        }
      }
    });
  });

  // 7. Generic scanner to update blog post authors
  blogsList.forEach(blog => {
    const blogLinks = document.querySelectorAll(`a[href*="blog/${blog.id}.html"]`);
    blogLinks.forEach(link => {
      const card = link.closest('.blog-card');
      if (card) {
        const authorMeta = card.querySelector('.blog-card-meta span:nth-child(2)');
        if (authorMeta) {
          authorMeta.innerHTML = `<i class="far fa-user"></i> ${escapeHTML(blog.authorName)}`;
        }
      }
    });
  });

  // 8. If on a static blog page, dynamically update it
  if (window.location.pathname.includes('/blog/')) {
    const filename = window.location.pathname.split('/').pop();
    const blogId = filename.replace('.html', '');
    const blogData = blogsList.find(b => b.id === blogId);
    if (blogData) {
      const authorMeta = document.querySelector('.blog-card-meta span:nth-child(2)');
      if (authorMeta) {
        authorMeta.innerHTML = `<i class="far fa-user"></i> By: ${escapeHTML(blogData.authorName)}`;
      }
    }
  }
}

/* --- Cross-tab Real-time Synchronization --- */
window.addEventListener('storage', (e) => {
  const laxmiKeys = ['laxmi_doctors', 'laxmi_reviews', 'laxmi_departments', 'laxmi_blog', 'laxmi_settings', 'laxmi_packages'];
  if (laxmiKeys.includes(e.key)) {
    // Reload dynamic content from localStorage
    initDynamicContent();
    // Re-initialize Testimonials to bind new DOM cards and reset timer safely
    initTestimonials();
    // Re-initialize Doctors Carousel to bind new DOM cards and reset timer/resize safely
    initDoctorsCarousel();
  }
});
