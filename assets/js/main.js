/* ==========================================================================
   Laxmi Hospital, Firozabad - Main Interactive Script
   Core JS logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initCounters();
  initTestimonials();
  initFAQs();
  initActiveNavLink();
  initFooterStatus();
  initHeroSlider();
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
  const testimonials = document.querySelectorAll('.testi-card');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const nextBtn = document.querySelector('.slider-btn-next');
  
  if (testimonials.length === 0) return;
  
  let currentIndex = 0;
  
  function showTestimonial(index) {
    testimonials.forEach(card => card.classList.remove('active'));
    testimonials[index].classList.add('active');
  }
  
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
  setInterval(() => {
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
    
    // Exact or relative match
    if (currentPath.endsWith(href) || (href === 'index.html' && currentPath.endsWith('/'))) {
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
  statusBadge.innerHTML = '<span class="open">● Open 24 Hours (Everyday)</span>';
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
