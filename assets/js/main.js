/**
 * Main JavaScript File for Nisreen Adel Baqatian Portfolio
 * Modern, High-Performance Front-End Animations & Interactive Behaviors:
 * - Interactive Canvas Particle System (Ambient Tech Constellation)
 * - Typewriter Hero Text Animation with dynamic Arabic phrases
 * - IntersectionObserver Scroll Reveal Animations (AOS-style)
 * - Top Scroll Reading Progress Bar
 * - 3D Tilt & Mouse Spotlight Glare on Cards
 * - Animated Skills Progress Bars & Number Counters
 * - Button Click Ripple Effects
 * - Dark / Light Mode with LocalStorage
 * - Mobile Navigation Drawer
 * - Project Category Filter
 * - Contact Form Handler & Toast System
 * - CV Modal & Print Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initCanvasParticles();
  initTypewriter();
  initScrollReveal();
  init3DTilt();
  initAnimatedSkills();
  initMobileMenu();
  initScrollSpy();
  initBackToTop();
  initStatsCounter();
  initProjectFilters();
  initContactForm();
  initCVModal();
  initButtonRipples();

  // Dynamic Current Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(newTheme === 'dark' ? 'تم تفعيل الوضع الليلي 🌙' : 'تم تفعيل الوضع النهاري ☀️');
      // Trigger canvas particle theme update if canvas exists
      if (window.updateCanvasTheme) window.updateCanvasTheme();
    });
  });
}

function applyTheme(theme) {
  const moonIcons = document.querySelectorAll('.theme-icon-moon');
  const sunIcons = document.querySelectorAll('.theme-icon-sun');

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('portfolio-theme', 'dark');
    moonIcons.forEach(icon => icon.classList.add('hidden'));
    sunIcons.forEach(icon => icon.classList.remove('hidden'));
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('portfolio-theme', 'light');
    moonIcons.forEach(icon => icon.classList.remove('hidden'));
    sunIcons.forEach(icon => icon.classList.add('hidden'));
  }
}

/* ==========================================================================
   2. Scroll Progress Bar at Top
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercentage))}%`;
  }, { passive: true });
}

/* ==========================================================================
   3. Interactive Canvas Particle Background
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let particles = [];
  const particleCount = Math.min(45, Math.floor(width / 32));
  let mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.65;
      this.speedY = (Math.random() - 0.5) * 0.65;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap boundaries
      if (this.x > width) this.x = 0;
      if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      if (this.y < 0) this.y = height;

      // Interactive mouse nudge
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;
          this.x -= forceDirectionX * force * 1.5;
          this.y -= forceDirectionY * force * 1.5;
        }
      }
    }

    draw(color) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.classList.contains('dark');
    const pColor = isDark ? 'rgba(99, 102, 241, 0.45)' : 'rgba(99, 102, 241, 0.3)';
    const lineColorBase = isDark ? '99, 102, 241' : '79, 70, 229';

    // Draw connecting lines
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * (isDark ? 0.22 : 0.14);
          ctx.strokeStyle = `rgba(${lineColorBase}, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw(pColor);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. Typewriter Dynamic Text Effect in Hero
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const phrases = [
    'مهندسة حاسوب ومطورة واجهات ويب',
    'متخصصة في HTML5, Tailwind & JavaScript',
    'خريجة جامعة حضرموت | هندسة وبترول',
    'تحويل الأفكار إلى واجهات عصرية تفاعلية'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at the end of typing
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

/* ==========================================================================
   5. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: unobserve once revealed to save performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. 3D Tilt and Spotlight Card Effects
   ========================================================================== */
function init3DTilt() {
  // Only apply on non-touch devices to keep mobile scrolling ultra smooth
  if (window.matchMedia('(hover: none)').matches) return;

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    // Add glare element if not already present
    if (!card.querySelector('.tilt-glare')) {
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (-7deg to +7deg)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   7. Animated Skills Progress Bars on Viewport Enter
   ========================================================================== */
function initAnimatedSkills() {
  const skillsSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillsSection || skillBars.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width') || '90%';
          bar.style.width = targetWidth;
        });
        observer.unobserve(skillsSection);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(skillsSection);
}

/* ==========================================================================
   8. Button Ripple Micro-Interaction
   ========================================================================== */
function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn-ripple');

  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = button.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-circle');

      const existingRipple = button.querySelector('.ripple-circle');
      if (existingRipple) existingRipple.remove();

      button.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}

/* ==========================================================================
   9. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');
  const navLinks = drawer ? drawer.querySelectorAll('a') : [];

  function openMenu() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    document.body.classList.add('overflow-hidden');
  }

  function closeMenu() {
    if (!drawer || !backdrop) return;
    drawer.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.classList.contains('translate-x-full')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   10. Scroll Spy & Navbar Blur on Scroll
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('#desktop-nav a[href^="#"]');
  const navbar = document.getElementById('main-navbar');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('shadow-md', 'border-slate-200/80', 'dark:border-slate-800/80');
      } else {
        navbar.classList.remove('shadow-md', 'border-slate-200/80', 'dark:border-slate-800/80');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-indigo-600', 'dark:text-indigo-400', 'font-bold');
            link.classList.remove('text-slate-600', 'dark:text-slate-300');
          } else {
            link.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'font-bold');
            link.classList.add('text-slate-600', 'dark:text-slate-300');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   11. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
      backToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   12. Animated Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  if (statElements.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statElements.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          let count = 0;
          const speed = Math.max(20, Math.floor(1800 / target));

          const updateCount = () => {
            count += 1;
            stat.textContent = count;
            if (count < target) {
              setTimeout(updateCount, speed);
            } else {
              stat.textContent = target;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-container');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   13. Project Category Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-indigo-500/25', 'shadow-lg');
        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      });
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-indigo-500/25', 'shadow-lg');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.classList.remove('opacity-0', 'scale-95');
            card.classList.add('opacity-100', 'scale-100');
          }, 40);
        } else {
          card.classList.add('opacity-0', 'scale-95');
          setTimeout(() => {
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   14. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showToast('يرجى ملء جميع الحقول المطلوبة بشكل صحيح ⚠️', 'warning');
      return;
    }

    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <i class="fa-solid fa-circle-notch fa-spin ml-2"></i>
      <span>جارٍ الإرسال...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      form.reset();
      showToast(`شكراً لك يا ${name}! تم استلام رسالتك بنجاح وسأتواصل معك قريباً 🚀`, 'success');
    }, 900);
  });
}

/* ==========================================================================
   15. CV Modal & Print Action
   ========================================================================== */
function initCVModal() {
  const modal = document.getElementById('cv-modal');
  const openButtons = document.querySelectorAll('.open-cv-modal');
  const closeButtons = document.querySelectorAll('.close-cv-modal');
  const printBtn = document.getElementById('print-cv-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      const inner = modal.querySelector('.modal-content');
      if (inner) inner.classList.remove('scale-95');
    }, 10);
    document.body.classList.add('overflow-hidden');
  }

  function closeModal() {
    modal.classList.add('opacity-0');
    const inner = modal.querySelector('.modal-content');
    if (inner) inner.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 250);
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   16. Helper: Copy to Clipboard
   ========================================================================== */
function copyToClipboard(text, label = 'النص') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`تم نسخ ${label} إلى الحافظة بنجاح: ${text} 📋`, 'success');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(`تم نسخ ${label} بنجاح! 📋`, 'success');
  });
}

window.copyToClipboard = copyToClipboard;

/* ==========================================================================
   17. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'warning'
    ? 'bg-amber-600 text-white'
    : 'bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-700 dark:border-slate-300';

  toast.className = `transform translate-y-8 opacity-0 pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md font-medium text-sm transition-all duration-300 ${bgClass}`;

  toast.innerHTML = `
    <span class="text-base">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-8', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-8', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
