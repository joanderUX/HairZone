// App state and DOM elements
const state = {
    scrollY: 0,
    showFloatingButton: false,
};

const dom = {
    preloader: document.getElementById('preloader'),
    floatingBookingBtn: document.getElementById('floatingBookingBtn'),
    heroBackground: document.getElementById('heroBackground'),
    appContainer: document.querySelector('.app-container'),
};

/**
 * Main initialization function.
 */
function initializeApp() {
    // The app container must exist for the script to run.
    if (!dom.appContainer) {
        console.error('Error: .app-container element not found. App cannot initialize.');
        return;
    }

    startPreloader();
    initializeScrollEffects();
    initializeAnimations();
    initializeEventListeners();
}

/**
 * Hides the preloader after a delay.
 */
function startPreloader() {
    setTimeout(() => {
        if (dom.preloader) {
            dom.preloader.style.opacity = '0';
            dom.preloader.style.visibility = 'hidden';
        }
    }, 1500);
}

/**
 * Sets up scroll-related effects like the parallax hero and the floating button.
 */
function initializeScrollEffects() {
    // Debounce the scroll handler to improve performance.
    const debouncedScrollHandler = debounce(handleScroll, 10);
    dom.appContainer.addEventListener('scroll', debouncedScrollHandler, { passive: true });
}

/**
 * Initializes Intersection Observers for reveal-on-scroll animations.
 */
function initializeAnimations() {
    // Observer for sections and elements that reveal on scroll.
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

    // Staggered animation for service cards.
    document.querySelectorAll('.service-card').forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('revealed');
        }, 200 * index);
    });

    // Fade-in animation for hero elements.
    document.querySelectorAll('.hero-fade-in').forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 800 + (index * 200));
    });
}

/**
 * Sets up all other event listeners.
 */
function initializeEventListeners() {
    // Smooth scrolling for internal anchor links.
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Keyboard accessibility for booking buttons.
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.target.matches('button.btn-primary, .floating-booking-btn')) {
            handleBooking();
        }
    });
}

/**
 * Handles the scroll event to update UI elements.
 */
function handleScroll() {
    state.scrollY = dom.appContainer.scrollTop;
    state.showFloatingButton = state.scrollY > 300;

    // Toggle floating booking button visibility.
    if (dom.floatingBookingBtn) {
        dom.floatingBookingBtn.style.display = state.showFloatingButton ? 'flex' : 'none';
    }

    // Apply parallax effect to hero background.
    if (dom.heroBackground) {
        dom.heroBackground.style.transform = `translateY(${state.scrollY * 0.3}px)`;
    }
}

/**
 * Opens the external booking page in a new tab.
 */
function handleBooking() {
    window.open('https://bestill.timma.no/hairzonelilleng', '_blank');
}

/**
 * Smoothly scrolls to a section by its ID.
 * @param {string} sectionId - The ID of the element to scroll to.
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Utility function to debounce a function call.
 * @param {Function} func The function to debounce.
 * @param {number} wait The debounce delay in milliseconds.
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

// Start the application once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', initializeApp);
