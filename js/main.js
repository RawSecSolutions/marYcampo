/**
 * Mar y Campo - Landing Page JavaScript
 * =====================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initCarousel();
    initLightbox();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
    initVideoBackgrounds();
});

/**
 * Navbar functionality
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Hero Carousel
 */
function initCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    let currentSlide = 0;
    let autoplayInterval;
    const autoplayDelay = 5000;

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            const video = slide.querySelector('video');
            if (video) {
                if (i === index) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            }
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // Event listeners
    prevBtn.addEventListener('click', function() {
        prevSlide();
        startAutoplay();
    });

    nextBtn.addEventListener('click', function() {
        nextSlide();
        startAutoplay();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            goToSlide(index);
            startAutoplay();
        });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        }
    });

    // Start autoplay
    startAutoplay();
}

/**
 * Lightbox for gallery
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.galeria-item');

    let currentIndex = 0;
    const images = [];

    // Collect image sources
    galleryItems.forEach((item, index) => {
        const src = item.getAttribute('data-src');
        if (src) {
            images.push(src);

            item.addEventListener('click', function() {
                openLightbox(index);
            });
        }
    });

    function openLightbox(index) {
        currentIndex = index;
        lightboxImage.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImage.src = images[currentIndex];
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentIndex];
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    });
}

/**
 * Scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-header, .zona-content, .zona-map, .inversion-card, ' +
        '.agua-text, .agua-visual, .timeline-item, .amenidad-item, ' +
        '.galeria-item, .masterplan-container, ' +
        '.contacto-info, .contacto-simple'
    );

    // Add fade-in class
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    // Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Smooth scroll for navigation links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Contact form handling (demo)
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Demo: show alert (in production, you'd send this to a server)
        alert(
            'Gracias por tu mensaje. Este es un formulario demostrativo.\n\n' +
            'Para una respuesta inmediata, contáctanos por WhatsApp.'
        );

        // Reset form
        form.reset();
    });
}

/**
 * Masterplan 360 Integration
 * --------------------------
 * To integrate Masterplan360, replace the placeholder content in the
 * #masterplanViewer div with your iframe code.
 *
 * Example:
 * <iframe
 *   src="YOUR_MASTERPLAN360_URL"
 *   width="100%"
 *   height="100%"
 *   frameborder="0"
 *   allowfullscreen>
 * </iframe>
 *
 * You can also use this function to dynamically load the viewer:
 */
function loadMasterplan360(url) {
    const viewer = document.getElementById('masterplanViewer');
    if (!viewer || !url) return;

    viewer.innerHTML = `
        <iframe
            src="${url}"
            width="100%"
            height="100%"
            frameborder="0"
            allowfullscreen
            style="border: none;">
        </iframe>
    `;
}

// Expose function globally for easy configuration
window.loadMasterplan360 = loadMasterplan360;

/**
 * Video background sections — lazy load + play/pause on visibility.
 * Avoids relying on the `autoplay` attribute so Chrome's autoplay
 * policies can't block the videos silently.
 */
function initVideoBackgrounds() {
    const bgVideos = document.querySelectorAll('.video-bg-wrap video');
    if (!bgVideos.length) return;

    function startVideo(video) {
        if (video.dataset.loaded) {
            video.play().catch(() => {});
            return;
        }
        video.setAttribute('preload', 'auto');
        video.load();
        video.dataset.loaded = '1';
        video.addEventListener('canplay', function handler() {
            video.play().catch(() => {});
            video.removeEventListener('canplay', handler);
        });
    }

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                startVideo(video);
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.05 });

    bgVideos.forEach(video => observer.observe(video));
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
