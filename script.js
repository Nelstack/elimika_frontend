
// =============================================
// ELIMIKA - Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const updateNavbar = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-slate-100');
      navbar.classList.remove('bg-transparent');
    } else {
      navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-slate-100');
    }
  };
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ===== MOBILE MENU =====
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpenIcon = document.getElementById('menu-open-icon');
  const menuCloseIcon = document.getElementById('menu-close-icon');

  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
      mobileMenu.classList.add('hidden');
      menuOpenIcon.classList.remove('hidden');
      menuCloseIcon.classList.add('hidden');
    } else {
      mobileMenu.classList.remove('hidden');
      menuOpenIcon.classList.add('hidden');
      menuCloseIcon.classList.remove('hidden');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuOpenIcon.classList.remove('hidden');
      menuCloseIcon.classList.add('hidden');
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('.smooth-scroll, a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // ===== ANIMATED COUNTERS =====
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ===== HERO FLOAT ANIMATION =====
  const heroFloat = document.querySelector('.hero-float');
  if (heroFloat) {
    let t = 0;
    const float = () => {
      t += 0.02;
      heroFloat.style.transform = `translateY(${Math.sin(t) * 10}px)`;
      requestAnimationFrame(float);
    };
    float();
  }

  // ===== TESTIMONIAL SLIDER =====
  const slides = document.getElementById('testimonial-slides');
  const dots = document.querySelectorAll('.slide-dot');
  let currentSlide = 0;
  const totalSlides = 2;

  const goToSlide = (index) => {
    currentSlide = index;
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-white', i === currentSlide);
      dot.classList.toggle('bg-white/40', i !== currentSlide);
      dot.classList.toggle('w-6', i === currentSlide);
      dot.classList.toggle('w-3', i !== currentSlide);
    });
  };

  document.getElementById('next-slide').addEventListener('click', () => {
    goToSlide((currentSlide + 1) % totalSlides);
  });
  document.getElementById('prev-slide').addEventListener('click', () => {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Auto-advance slider
  setInterval(() => { goToSlide((currentSlide + 1) % totalSlides); }, 5000);
  goToSlide(0);

  // ===== COURSE FILTER + SEARCH =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseSearch = document.getElementById('course-search');
  const courseCards = document.querySelectorAll('.course-card');
  const noCourses = document.getElementById('no-courses');
  let activeFilter = 'all';

  const filterCourses = () => {
    const searchVal = courseSearch.value.toLowerCase().trim();
    let visible = 0;
    courseCards.forEach(card => {
      const curriculum = card.dataset.curriculum;
      const subject = card.dataset.subject;
      const matchesFilter = activeFilter === 'all' || curriculum === activeFilter;
      const matchesSearch = !searchVal || subject.includes(searchVal);
      if (matchesFilter && matchesSearch) {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });
    noCourses.classList.toggle('hidden', visible > 0);
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
      btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
      filterCourses();
    });
  });

  courseSearch.addEventListener('input', filterCourses);

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const chevron = item.querySelector('.faq-chevron');
      const icon = item.querySelector('.faq-icon');
      const isOpen = !answer.classList.contains('hidden');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.querySelector('.faq-answer').classList.add('hidden');
        const c = i.querySelector('.faq-chevron');
        const ic = i.querySelector('.faq-icon');
        if (c) c.style.transform = '';
        if (ic) {
          ic.classList.remove('bg-blue-600');
          ic.classList.add('bg-slate-100');
          const svg = ic.querySelector('svg');
          if (svg) svg.classList.remove('text-white');
          const svgPath = ic.querySelector('path');
        }
      });

      if (!isOpen) {
        answer.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        if (icon) {
          icon.classList.add('bg-blue-600');
          icon.classList.remove('bg-slate-100');
          const svg = icon.querySelector('svg');
          if (svg) svg.classList.add('text-white');
        }
      }
    });
  });

  // ===== NEWSLETTER FORM =====
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thanks for subscribing! Welcome to Elimika.', 'success');
    newsletterForm.reset();
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const curriculum = document.getElementById('contact-curriculum').value;
    const message = document.getElementById('contact-message').value.trim();

    const nameErr = document.getElementById('error-name');
    const emailErr = document.getElementById('error-email');
    const currErr = document.getElementById('error-curriculum');
    const msgErr = document.getElementById('error-message');

    // Reset errors
    [nameErr, emailErr, currErr, msgErr].forEach(e => e.classList.add('hidden'));
    [document.getElementById('contact-name'), document.getElementById('contact-email'),
     document.getElementById('contact-curriculum'), document.getElementById('contact-message')]
      .forEach(f => f.classList.remove('border-rose-400', 'ring-rose-200'));

    if (!name) { nameErr.classList.remove('hidden'); highlightField('contact-name'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailErr.classList.remove('hidden'); highlightField('contact-email'); valid = false; }
    if (!curriculum) { currErr.classList.remove('hidden'); highlightField('contact-curriculum'); valid = false; }
    if (!message) { msgErr.classList.remove('hidden'); highlightField('contact-message'); valid = false; }

    if (!valid) return;

    const btn = document.getElementById('contact-submit');
    const submitText = document.getElementById('submit-text');
    const spinner = document.getElementById('submit-spinner');
    btn.disabled = true;
    submitText.textContent = 'Sending...';
    spinner.classList.remove('hidden');

    setTimeout(() => {
      btn.disabled = false;
      submitText.textContent = 'Send Message';
      spinner.classList.add('hidden');
      showToast('Message sent! We will get back to you within 24 hours.', 'success');
      contactForm.reset();
    }, 1800);
  });

  const highlightField = (id) => {
    const field = document.getElementById(id);
    field.classList.add('border-rose-400');
    field.focus();
  };

  // ===== TOAST SYSTEM =====
  const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-sm w-full transition-all duration-300 translate-x-full opacity-0 ${
      isSuccess ? 'bg-white border-emerald-200' : 'bg-white border-rose-200'
    }`;
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isSuccess ? 'bg-emerald-100' : 'bg-rose-100'}">
        ${isSuccess
          ? '<svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
          : '<svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
        }
      </div>
      <p class="text-sm font-medium text-slate-800 flex-1">${message}</p>
      <button class="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0" onclick="this.closest('.pointer-events-auto').remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
      });
    });
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // ===== SCROLL TO TOP =====
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      scrollTopBtn.classList.add('opacity-100');
    } else {
      scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
      scrollTopBtn.classList.remove('opacity-100');
    }
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('text-blue-600', 'bg-blue-50');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-blue-600', 'bg-blue-50');
          }
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(section => activeNavObserver.observe(section));

});
