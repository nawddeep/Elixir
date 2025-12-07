// DOM Elements
const gateway = document.getElementById('gateway');
const mainContent = document.getElementById('mainContent');
const institutePage = document.getElementById('institute-page');
const schoolPage = document.getElementById('school-page');
const backBtn = document.getElementById('backBtn');

// Page state management
let currentPage = null;

// Function to open specific page with enhanced animations
function openPage(type) {
    // Prevent multiple clicks during animation
    if (currentPage !== null) return;
    
    currentPage = type;
    
    // Add haptic feedback (if supported)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // 1. Animate Gateway Up
    gateway.classList.add('slide-up');
    
    // 2. Prepare Content area
    setTimeout(() => {
        mainContent.classList.add('active');
        
        // 3. Show specific section based on click
        if(type === 'institute') {
            institutePage.style.display = 'block';
            schoolPage.style.display = 'none';
            animatePageElements('.course-card');
        } else {
            institutePage.style.display = 'none';
            schoolPage.style.display = 'block';
            animatePageElements('.value-card');
        }
    }, 400);
    
    // 4. Show Back Button with delay
    setTimeout(() => {
        backBtn.classList.add('show');
    }, 800);
    
    // Track page view (for analytics)
    trackPageView(type);
}

// Function to return to Gateway
function showGateway() {
    // Prevent multiple clicks during animation
    if (currentPage === null) return;
    
    // Add haptic feedback (if supported)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // 1. Bring Gateway Down
    gateway.classList.remove('slide-up');
    
    // 2. Hide Content
    mainContent.classList.remove('active');
    backBtn.classList.remove('show');
    
    // 3. Reset internal displays after animation
    setTimeout(() => {
        institutePage.style.display = 'none';
        schoolPage.style.display = 'none';
        currentPage = null;
    }, 800);
}

// Animate page elements on load
function animatePageElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Track page views (placeholder for analytics)
function trackPageView(page) {
    console.log(`Page viewed: ${page}`);
    // Add your analytics code here (e.g., Google Analytics)
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key to go back
    if (e.key === 'Escape' && currentPage !== null) {
        showGateway();
    }
});

// Add smooth scroll behavior for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero sections
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.school-hero, .hero-section');
    
    parallaxElements.forEach(el => {
        if (el.offsetParent !== null) { // Check if element is visible
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements when pages load
function observeElements() {
    const elementsToObserve = document.querySelectorAll('.stat-card, .course-card, .value-card');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Preload images for better performance
    const imagesToPreload = [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000',
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1500'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Add hover sound effect (optional - commented out by default)
/*
function playHoverSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBhku+zooVARC0yl4fG5ZRwFNo3V7859LwUofsz');
    audio.volume = 0.1;
    audio.play().catch(() => {}); // Ignore errors if autoplay is blocked
}
*/

// Add click ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to buttons
document.querySelectorAll('.cta-btn, .back-btn, button').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
                console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['measure'] });
}

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.openPage = openPage;
window.showGateway = showGateway;
