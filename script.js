// Global variables
let isLoading = true;
let scrollY = 0;
let showFloatingButton = false;
let isScrolling = false;

// DOM elements
const preloader = document.getElementById('preloader');
const floatingBookingBtn = document.getElementById('floatingBookingBtn');
const heroBackground = document.getElementById('heroBackground');
const appContainer = document.querySelector('.app-container');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Start preloader
    startPreloader();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize intersection observer for animations
    initializeIntersectionObserver();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
}

// Preloader functionality
function startPreloader() {
    setTimeout(() => {
        isLoading = false;
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
    }, 1500);
}

// Scroll effects
function initializeScrollEffects() {
    if (appContainer) {
        appContainer.addEventListener('scroll', handleScroll, { passive: true });
    } else {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

function handleScroll() {
    const scrollElement = appContainer || window;
    const currentScrollY = scrollElement.scrollY || scrollElement.scrollTop;
    scrollY = currentScrollY;
    showFloatingButton = currentScrollY > 300;
    
    // Update floating button visibility
    if (floatingBookingBtn) {
        if (showFloatingButton) {
            floatingBookingBtn.style.display = 'flex';
        } else {
            floatingBookingBtn.style.display = 'none';
        }
    }
    
    // Update hero background parallax effect
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${currentScrollY * 0.3}px)`;
    }
}

// Intersection Observer for reveal animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe all sections with reveal-on-scroll class
    const sections = document.querySelectorAll('.reveal-on-scroll');
    sections.forEach(section => observer.observe(section));
    
    // Service cards animation with delay
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('revealed');
        }, 200 * index);
    });
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    // Add smooth scrolling for all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Disable aggressive wheel handling to prevent unwanted auto-scrolling
    // Let CSS scroll-snap handle the scrolling naturally
    return;
    
    // Add wheel event listener for better scroll control - but make it less aggressive
    if (appContainer) {
        appContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    // Add touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    if (appContainer) {
        appContainer.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        appContainer.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            // Only trigger on significant swipe
            if (Math.abs(diff) > 50 && !isScrolling) {
                const sections = document.querySelectorAll('.hero, .about, .services, .contact');
                const currentSection = getCurrentSection(sections);
                
                if (diff > 0 && currentSection < sections.length - 1) {
                    // Swipe up - go to next section
                    scrollToSectionByIndex(currentSection + 1);
                } else if (diff < 0 && currentSection > 0) {
                    // Swipe down - go to previous section
                    scrollToSectionByIndex(currentSection - 1);
                }
            }
        }, { passive: true });
    }
}

// Handle wheel scrolling for better snap behavior
function handleWheel(e) {
    if (isScrolling) {
        e.preventDefault();
        return;
    }
    
    // Add a small delay to prevent rapid scrolling
    const now = Date.now();
    if (now - lastScrollTime < 1000) {
        e.preventDefault();
        return;
    }
    
    const sections = document.querySelectorAll('.hero, .about, .services, .contact');
    const currentSection = getCurrentSection(sections);
    
    if (e.deltaY > 0 && currentSection < sections.length - 1) {
        // Scrolling down
        e.preventDefault();
        lastScrollTime = now;
        scrollToSectionByIndex(currentSection + 1);
    } else if (e.deltaY < 0 && currentSection > 0) {
        // Scrolling up
        e.preventDefault();
        lastScrollTime = now;
        scrollToSectionByIndex(currentSection - 1);
    }
}

// Add global variable for scroll timing
let lastScrollTime = 0;

// Get current section index
function getCurrentSection(sections) {
    const scrollElement = appContainer || window;
    const scrollTop = scrollElement.scrollY || scrollElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop >= sectionTop - windowHeight / 2 && 
            scrollTop < sectionTop + sectionHeight - windowHeight / 2) {
            return i;
        }
    }
    return 0;
}

// Scroll to section by index
function scrollToSectionByIndex(index) {
    const sections = document.querySelectorAll('.hero, .about, .services, .contact');
    if (sections[index]) {
        isScrolling = true;
        sections[index].scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

// Booking functionality
function handleBooking() {
    window.open('https://bestill.timma.no/hairzonelilleng', '_blank');
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        isScrolling = true;
        section.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

// Add fade-in animation to hero elements
document.addEventListener('DOMContentLoaded', function() {
    const heroFadeElements = document.querySelectorAll('.hero-fade-in');
    heroFadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 800 + (index * 200));
    });
});

// Add CSS classes for animations
document.addEventListener('DOMContentLoaded', function() {
    // Add revealed class to elements that should animate in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all reveal-on-scroll elements
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
});

// Handle image loading errors
function handleImageError(img) {
    img.style.display = 'none';
}

// Add mobile menu functionality if needed
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    // Recalculate any responsive elements if needed
    if (window.innerWidth > 768) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    }
});

// Add loading state for buttons
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Laster...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Handle form submissions if any forms are added later
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton) {
        addLoadingState(submitButton);
    }
    
    // Add form submission logic here
    console.log('Form submitted:', form);
}

// Add event listeners for forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Escape key to close mobile menu
    if (event.key === 'Escape') {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }
    
    // Enter key for booking buttons
    if (event.key === 'Enter' && event.target.classList.contains('btn-primary')) {
        handleBooking();
    }
    
    // Disable arrow key navigation to prevent unwanted scrolling
    // Let users scroll naturally with mouse/touch
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(handleScroll, 10);
if (appContainer) {
    appContainer.removeEventListener('scroll', handleScroll);
    appContainer.addEventListener('scroll', debouncedScrollHandler, { passive: true });
} else {
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
}

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('button, a, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #2d3748';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add ARIA labels where needed
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            button.setAttribute('aria-label', 'Button');
        }
    });
});

// Add error handling for external resources
window.addEventListener('error', function(event) {
    if (event.target.tagName === 'IMG') {
        event.target.style.display = 'none';
        console.warn('Image failed to load:', event.target.src);
    }
});

// Add analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Add your analytics tracking code here
    console.log('Event tracked:', eventName, eventData);
}

// Track booking clicks
document.addEventListener('DOMContentLoaded', function() {
    const bookingButtons = document.querySelectorAll('button[onclick*="handleBooking"]');
    bookingButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('booking_click', {
                location: this.textContent.trim(),
                timestamp: new Date().toISOString()
            });
        });
    });
});
