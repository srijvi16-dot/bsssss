document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const navWrapper = document.querySelector('.nav-wrapper');
  const navLinks = document.querySelectorAll('.nav-links a');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const progressBar = document.getElementById('scroll-progress');
  const backToTopButton = document.getElementById('back-to-top');
  const revealElements = document.querySelectorAll('.reveal');
  const counterElements = document.querySelectorAll('[data-target]');
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-nav.prev');
  const lightboxNext = document.querySelector('.lightbox-nav.next');
  const sections = [...document.querySelectorAll('main section[id], footer[id]')];

  const savedTheme = localStorage.getItem('bangladesh-sports-theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
  }

  const updateThemeIcon = () => {
    if (!themeIcon) return;
    themeIcon.textContent = body.classList.contains('dark') ? '☾' : '☼';
  };

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark');
      localStorage.setItem('bangladesh-sports-theme', isDark ? 'dark' : 'light');
      updateThemeIcon();
    });
  }

  if (navToggle && navWrapper) {
    navToggle.addEventListener('click', () => {
      const isOpen = navWrapper.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 980) {
        navWrapper.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const updateActiveNav = () => {
    let currentSection = 'home';
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === `#${currentSection}`;
      link.classList.toggle('active', isActive);
    });
  };

  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${progress}%`;

    if (backToTopButton) {
      backToTopButton.classList.toggle('visible', window.scrollY > 600);
    }
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const animateCounter = (element) => {
    const target = Number(element.dataset.target || 0);
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * easedProgress);
      element.textContent = currentValue;

      if (frame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(counter);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((element) => counterObserver.observe(element));

  let activeGalleryIndex = 0;

  const openLightbox = (index) => {
    if (!galleryItems[index]) return;

    activeGalleryIndex = index;
    const item = galleryItems[index];
    lightboxImage.src = item.dataset.image;
    lightboxTitle.textContent = item.dataset.title || 'Gallery item';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNextImage = (direction) => {
    const nextIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
    openLightbox(nextIndex);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => showNextImage(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => showNextImage(1));
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.dataset.close === 'true') {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowRight') {
      showNextImage(1);
    }

    if (event.key === 'ArrowLeft') {
      showNextImage(-1);
    }
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', () => {
    updateActiveNav();
    updateScrollProgress();
  });

  updateActiveNav();
  updateScrollProgress();
});
