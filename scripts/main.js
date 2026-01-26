/**
 * Taqadum Investment LLC - Main JavaScript
 * Handles navigation, animations, and interactions
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('.reveal');
    const yearElement = document.getElementById('year');

    // ============================================
    // Utility Functions
    // ============================================
    
    /**
     * Debounce function to limit execution rate
     */
    function debounce(func, wait = 10) {
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
     * Throttle function for scroll events
     */
    function throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // Navigation
    // ============================================
    
    /**
     * Handle navbar scroll effect
     */
    function handleNavbarScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /**
     * Toggle mobile navigation menu
     */
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    /**
     * Close mobile navigation
     */
    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Smooth scroll to section
     */
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const navHeight = navbar.offsetHeight;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Handle navigation link click
     */
    function handleNavLinkClick(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            smoothScrollTo(href);
            closeMobileNav();
        }
    }

    /**
     * Update active navigation link based on scroll position
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============================================
    // Scroll Reveal Animation
    // ============================================
    
    /**
     * Reveal elements on scroll using Intersection Observer
     */
    function initScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add stagger effect for service cards
                    if (entry.target.classList.contains('service-card') || 
                        entry.target.classList.contains('feature-item')) {
                        const siblings = entry.target.parentElement.children;
                        const index = Array.from(siblings).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }
                    
                    // Unobserve after revealing
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(revealCallback, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ============================================
    // Dynamic Year
    // ============================================
    
    /**
     * Set current year in footer
     */
    function setCurrentYear() {
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // ============================================
    // Keyboard Navigation
    // ============================================
    
    /**
     * Handle keyboard navigation for accessibility
     */
    function handleKeyboardNav(e) {
        // Close mobile nav on Escape
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    }

    // ============================================
    // Performance Optimization
    // ============================================
    
    /**
     * Lazy load images (if any added later)
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ============================================
    // Parallax Effect (subtle)
    // ============================================
    
    /**
     * Subtle parallax effect for hero shapes
     */
    function initParallax() {
        const shapes = document.querySelectorAll('.shape');
        
        if (shapes.length === 0) return;
        
        window.addEventListener('scroll', throttle(() => {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;
            
            if (scrollY < heroHeight) {
                shapes.forEach((shape, index) => {
                    const speed = 0.1 + (index * 0.05);
                    shape.style.transform = `translateY(${scrollY * speed}px)`;
                });
            }
        }, 16));
    }

    // ============================================
    // Form Handling (if contact form added)
    // ============================================
    
    /**
     * Handle form submission
     */
    function initFormHandling() {
        const contactForm = document.querySelector('#contact-form');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add form validation and submission logic here
            const formData = new FormData(this);
            console.log('Form submitted:', Object.fromEntries(formData));
            
            // Show success message
            alert('Thank you for your message. We will get back to you soon!');
            this.reset();
        });
    }

    // ============================================
    // Click Outside Handler
    // ============================================
    
    /**
     * Close mobile nav when clicking outside
     */
    function handleClickOutside(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMobileNav();
        }
    }

    // ============================================
    // Initialize
    // ============================================
    
    function init() {
        // Set current year
        setCurrentYear();
        
        // Navigation events
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });
        
        // Scroll events
        window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
        window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
        
        // Keyboard events
        document.addEventListener('keydown', handleKeyboardNav);
        
        // Click outside
        document.addEventListener('click', handleClickOutside);
        
        // Initialize scroll reveal
        initScrollReveal();
        
        // Initialize lazy loading
        initLazyLoading();
        
        // Initialize parallax (optional - can be disabled for better performance)
        // initParallax();
        
        // Initialize form handling
        initFormHandling();
        
        // Initial navbar state check
        handleNavbarScroll();
        
        // Log initialization
        console.log('Taqadum Investment LLC - Website Initialized');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
