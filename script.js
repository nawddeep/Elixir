/**
 * ELIXIR EDUCATION ECOSYSTEM
 * Complete JavaScript Implementation
 */

// ============================================
// 1. DOM ELEMENTS & STATE
// ============================================
const gateway = document.getElementById('gateway');
const mainContent = document.getElementById('mainContent');
const institutePage = document.getElementById('institute-page');
const schoolPage = document.getElementById('school-page');
const backBtn = document.getElementById('backBtn');

let currentPage = null;
let chatOpen = false;
let currentTestimonial = 0;
let facultyPosition = 0;

// ============================================
// 2. PAGE NAVIGATION
// ============================================
function openPage(type) {
    if (currentPage !== null) return;
    currentPage = type;
    
    if (navigator.vibrate) navigator.vibrate(50);
    
    // Slide gateway up
    gateway.classList.add('slide-up');
    
    setTimeout(() => {
        // Activate main content
        mainContent.classList.add('active');
        
        // CRITICAL: Hide BOTH pages first
        institutePage.style.display = 'none';
        schoolPage.style.display = 'none';
        
        // Show ONLY the selected page
        if (type === 'institute') {
            institutePage.style.display = 'block';
        } else if (type === 'school') {
            schoolPage.style.display = 'block';
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Initialize animations
        initPageAnimations();
        initCounters();
    }, 500);
    
    setTimeout(() => {
        backBtn.classList.add('show');
        initCountdowns();
    }, 800);
    
    trackPageView(type);
}

function showGateway() {
    if (currentPage === null) return;
    if (navigator.vibrate) navigator.vibrate(50);
    
    gateway.classList.remove('slide-up');
    mainContent.classList.remove('active');
    backBtn.classList.remove('show');
    
    setTimeout(() => {
        institutePage.style.display = 'none';
        schoolPage.style.display = 'none';
        currentPage = null;
        window.scrollTo(0, 0);
    }, 800);
}

function handleGatewayKeypress(event, type) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPage(type);
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// 3. MODAL MANAGEMENT
// ============================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
        
        if (currentPage !== null) {
            showGateway();
        }
    }
});

// ============================================
// 4. MULTI-STEP FORM
// ============================================
let currentFormStep = 1;

function nextStep(step) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
    let valid = true;
    
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            valid = false;
        }
    });
    
    if (!valid) return;
    
    currentStepEl.classList.remove('active');
    document.querySelector(`.form-step[data-step="${step + 1}"]`).classList.add('active');
    
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('completed');
    document.querySelector(`.progress-step[data-step="${step + 1}"]`).classList.add('active');
    
    currentFormStep = step + 1;
}

function prevStep(step) {
    document.querySelector(`.form-step[data-step="${step}"]`).classList.remove('active');
    document.querySelector(`.form-step[data-step="${step - 1}"]`).classList.add('active');
    
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${step - 1}"]`).classList.remove('completed');
    
    currentFormStep = step - 1;
}

function submitInquiry(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('inqName').value,
        phone: document.getElementById('inqPhone').value,
        email: document.getElementById('inqEmail').value,
        course: document.getElementById('inqCourse').value,
        message: document.getElementById('inqMessage').value,
        callback: document.getElementById('inqCallback').checked,
        callbackTime: document.getElementById('inqCallbackTime').value
    };
    
    console.log('Inquiry submitted:', formData);
    
    // Simulate API call
    showToast('success', 'Inquiry Submitted!', 'We will contact you within 24 hours.');
    closeModal('inquiryModal');
    
    // Reset form
    document.getElementById('inquiryForm').reset();
    currentFormStep = 1;
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.querySelector('.form-step[data-step="1"]').classList.add('active');
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.querySelector('.progress-step[data-step="1"]').classList.add('active');
}

// Callback checkbox toggle
document.getElementById('inqCallback')?.addEventListener('change', function() {
    const timeGroup = document.getElementById('callbackTimeGroup');
    if (this.checked) {
        timeGroup.classList.remove('hidden');
    } else {
        timeGroup.classList.add('hidden');
    }
});

// ============================================
// 5. TOAST NOTIFICATIONS
// ============================================
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div>
            <strong>${title}</strong>
            <p style="margin:0;font-size:0.9rem;color:#666">${message}</p>
        </div>
        <button class="toast-close" onclick="removeToast(this.parentElement)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove with smooth animation
    setTimeout(() => {
        removeToast(toast);
    }, 5000);
}

function removeToast(toast) {
    if (!toast || toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
}

// ============================================
// 6. CHAT WIDGET
// ============================================
function toggleChat() {
    const chatBody = document.querySelector('.chat-body');
    chatBody.classList.toggle('hidden');
    chatOpen = !chatOpen;
}

function sendQuickReply(message) {
    addChatMessage(message, 'user');
    
    setTimeout(() => {
        const responses = {
            'Course Information': 'We offer JEE Advanced, NEET Medical, and Foundation programs. Each program includes comprehensive study material, mock tests, and personal mentorship. Would you like details about any specific course?',
            'Fee Structure': 'Our fee structure varies by program:\n• JEE Advanced: ₹1,50,000/year\n• NEET Medical: ₹1,25,000/year\n• Foundation: ₹75,000/year\n\nScholarships up to 50% available based on entrance test!',
            'Admission Process': 'Admission process:\n1. Fill online inquiry form\n2. Appear for ELSAT entrance test\n3. Counseling session\n4. Fee payment & enrollment\n\nWould you like to schedule a campus visit?'
        };
        addChatMessage(responses[message] || 'Thank you for your message. Our team will get back to you shortly.', 'bot');
    }, 1000);
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            addChatMessage('Thank you for your message! Our counselor will respond shortly. For immediate assistance, call us at +91 98765 43210.', 'bot');
        }, 1500);
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================
// 7. FAQ ACCORDION
// ============================================
function toggleFaq(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const answer = button.nextElementSibling;
    const icon = button.querySelector('i');
    
    // Close all other FAQs in the same container
    const container = button.closest('.faq-container');
    container.querySelectorAll('.faq-question').forEach(btn => {
        if (btn !== button) {
            btn.setAttribute('aria-expanded', 'false');
            btn.nextElementSibling.classList.remove('open');
            btn.querySelector('i').classList.replace('fa-minus', 'fa-plus');
        }
    });
    
    // Toggle current FAQ
    button.setAttribute('aria-expanded', !isExpanded);
    answer.classList.toggle('open');
    
    if (isExpanded) {
        icon.classList.replace('fa-minus', 'fa-plus');
    } else {
        icon.classList.replace('fa-plus', 'fa-minus');
    }
}

// ============================================
// 8. NEWSLETTER SUBSCRIPTION
// ============================================
function subscribeNewsletter(event, type) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    console.log(`Newsletter subscription (${type}):`, email);
    
    showToast('success', 'Subscribed!', 'You will receive our latest updates.');
    form.reset();
}

// ============================================
// 9. RESULTS FILTER
// ============================================
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.topper-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ============================================
// 10. FACULTY CAROUSEL
// ============================================
function slideFaculty(direction) {
    const track = document.getElementById('facultyTrack');
    const cardWidth = 310; // card width + gap
    const maxScroll = track.scrollWidth - track.clientWidth;
    
    facultyPosition += direction * cardWidth;
    facultyPosition = Math.max(0, Math.min(facultyPosition, maxScroll));
    
    track.scrollTo({ left: facultyPosition, behavior: 'smooth' });
}

// ============================================
// 11. FEE CALCULATOR
// ============================================
function calculateFee() {
    const course = parseInt(document.getElementById('calcCourse').value);
    const duration = parseInt(document.getElementById('calcDuration').value);
    const scholarship = parseInt(document.getElementById('calcScholarship').value);
    
    document.getElementById('durationDisplay').textContent = duration + ' Year' + (duration > 1 ? 's' : '');
    document.getElementById('scholarshipDisplay').textContent = scholarship + '%';
    
    const total = course * duration * (1 - scholarship / 100);
    document.getElementById('calcTotal').textContent = '₹' + total.toLocaleString('en-IN');
}

// ============================================
// 12. COUNTDOWN TIMERS
// ============================================
function initCountdowns() {
    document.querySelectorAll('.countdown').forEach(el => {
        const targetDate = new Date(el.dataset.date);
        updateCountdown(el, targetDate);
        setInterval(() => updateCountdown(el, targetDate), 60000);
    });
}

function updateCountdown(element, targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        element.textContent = 'Started!';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    element.textContent = days + ' days left';
}

// ============================================
// 13. ANIMATED COUNTERS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const startTime = performance.now();
    
    const numEl = element.querySelector('.stat-num, .stat-number');
    if (!numEl) return;
    
    const originalText = numEl.textContent;
    const hasPlus = originalText.includes('+');
    const hasAIR = originalText.includes('AIR');
    
    // Easing function for smooth animation
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);
        
        if (hasAIR) {
            numEl.textContent = 'AIR ' + current;
        } else if (hasPlus) {
            numEl.textContent = current + '+';
        } else {
            numEl.textContent = current;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ============================================
// 14. PARENT TESTIMONIALS SLIDER
// ============================================
function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.parent-testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    // Smooth transition
    testimonials.forEach((t, i) => {
        if (i === index) {
            t.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });
    
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
    
    currentTestimonial = index;
}

// Auto-rotate testimonials
setInterval(() => {
    const testimonials = document.querySelectorAll('.parent-testimonial');
    if (testimonials.length > 0 && document.getElementById('school-page')?.style.display === 'block') {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
}, 5000);

// ============================================
// 15. LIGHTBOX & VIRTUAL TOUR
// ============================================
function openLightbox(title, description) {
    document.getElementById('lightboxTitle').textContent = title;
    document.getElementById('lightboxDesc').textContent = description;
    openModal('lightboxModal');
}

function openVirtualTour() {
    openModal('tourModal');
}

// Tour navigation
document.querySelectorAll('.tour-nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tour-nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // In a real implementation, this would load different 360° views
        console.log('Loading tour location:', this.dataset.location);
    });
});

// ============================================
// 16. COOKIE CONSENT
// ============================================
function initCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        setTimeout(() => {
            document.getElementById('cookieConsent').classList.remove('hidden');
        }, 2000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieConsent').classList.add('hidden');
    showToast('info', 'Preferences Saved', 'Cookie preferences have been saved.');
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'essential');
    document.getElementById('cookieConsent').classList.add('hidden');
    showToast('info', 'Preferences Saved', 'Only essential cookies will be used.');
}

// ============================================
// 17. SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    const scrollProgress = document.getElementById('scrollProgress');
    const stickyCta = document.getElementById('stickyCta');
    
    // Use throttled scroll handler for better performance
    const handleScroll = throttle(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        // Use transform instead of width for better performance
        if (scrollProgress) {
            scrollProgress.style.transform = `scaleX(${progress / 100})`;
            scrollProgress.style.transformOrigin = 'left';
        }
        
        // Sticky CTA
        if (stickyCta) {
            if (scrollTop > 500 && currentPage !== null) {
                stickyCta.classList.add('show');
                stickyCta.classList.remove('hidden');
            } else {
                stickyCta.classList.remove('show');
            }
        }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ============================================
// 18. PAGE ANIMATIONS
// ============================================
function initPageAnimations() {
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
    
    const animatedElements = document.querySelectorAll(
        '.stat-card, .course-card, .value-card, .topper-card, .faculty-card, ' +
        '.fee-card, .facility-card, .academic-card, .event-card, .testimonial-card, ' +
        '.timeline-item, .faq-item, .why-card, .award-card, .infra-card, .calendar-card, ' +
        '.download-card, .gallery-item, .chart-card'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });
    
    // Animate bar charts when visible
    initBarChartAnimations();
}

// ============================================
// 19. MOBILE MENU (Legacy - replaced by improved version in section 27)
// ============================================
// See section 27 for improved mobile menu implementation

// ============================================
// 20. RIPPLE EFFECT (Legacy - now handled by initRippleEffect in section 30)
// ============================================
// Ripple effect is now initialized in DOMContentLoaded via initRippleEffect()

// ============================================
// 21. LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// 22. ANALYTICS & TRACKING
// ============================================
function trackPageView(page) {
    console.log(`Page viewed: ${page}`);
    // Integration point for Google Analytics, etc.
}

function trackEvent(category, action, label) {
    console.log(`Event: ${category} - ${action} - ${label}`);
    // Integration point for event tracking
}

// ============================================
// 23. BOOKMARK SYSTEM (localStorage)
// ============================================
function toggleBookmark(itemId, itemType) {
    const bookmarks = JSON.parse(localStorage.getItem('elixirBookmarks') || '[]');
    const index = bookmarks.findIndex(b => b.id === itemId);
    
    if (index > -1) {
        bookmarks.splice(index, 1);
        showToast('info', 'Removed', 'Item removed from bookmarks');
    } else {
        bookmarks.push({ id: itemId, type: itemType, date: new Date().toISOString() });
        showToast('success', 'Bookmarked!', 'Item saved for later');
    }
    
    localStorage.setItem('elixirBookmarks', JSON.stringify(bookmarks));
}

function getBookmarks() {
    return JSON.parse(localStorage.getItem('elixirBookmarks') || '[]');
}

// ============================================
// 24. PRELOAD IMAGES
// ============================================
function preloadImages() {
    const imagesToPreload = [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000',
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1500'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onerror = () => console.warn('Failed to preload:', src);
    });
}

// ============================================
// 26. BAR CHART ANIMATIONS
// ============================================
function initBarChartAnimations() {
    const barFills = document.querySelectorAll('.bar-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.width;
                bar.style.width = '0';
                bar.style.setProperty('--target-width', targetWidth);
                
                requestAnimationFrame(() => {
                    bar.classList.add('animate');
                    bar.style.width = targetWidth;
                });
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    barFills.forEach(bar => observer.observe(bar));
}

// ============================================
// 27. IMPROVED MOBILE MENU
// ============================================
function toggleMobileMenu(type) {
    const nav = type === 'inst' ? document.querySelector('.inst-nav') : document.querySelector('.school-nav');
    const links = nav.querySelector('.nav-links');
    const btn = nav.querySelector('.mobile-menu-btn i');
    
    links.classList.toggle('active');
    
    if (links.classList.contains('active')) {
        btn.classList.replace('fa-bars', 'fa-times');
        links.style.display = 'flex';
    } else {
        btn.classList.replace('fa-times', 'fa-bars');
        links.style.display = 'none';
    }
}

// ============================================
// 28. PERFORMANCE OPTIMIZATIONS
// ============================================
// Debounce function for scroll events
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

// Throttle function for frequent events
function throttle(func, limit) {
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
// 25. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Ensure both pages are hidden on load
    if (institutePage) institutePage.style.display = 'none';
    if (schoolPage) schoolPage.style.display = 'none';
    
    // Smooth page load
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        document.body.style.opacity = '1';
    });
    
    // Initialize features
    initCookieConsent();
    initScrollEffects();
    initLazyLoading();
    preloadImages();
    
    // Initialize fee calculator if present
    if (document.getElementById('calcCourse')) {
        calculateFee();
    }
    
    // Add ripple effect to buttons
    initRippleEffect();
    
    console.log('Page initialized. Institute:', institutePage, 'School:', schoolPage);
});

// ============================================
// 29. SMOOTH REVEAL ON SCROLL
// ============================================
function initSmoothReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .stats-charts, .awards-grid, ' +
        '.infra-grid, .calendar-grid, .downloads-grid, .gallery-grid'
    );
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stagger children animation
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => {
        el.classList.add('reveal-stagger');
        revealObserver.observe(el);
    });
}

// ============================================
// 30. ENHANCED RIPPLE EFFECT
// ============================================
function initRippleEffect() {
    const buttons = document.querySelectorAll(
        '.cta-btn, .primary-btn, .secondary-btn, .nav-cta, .fee-cta, ' +
        '.batch-enroll, .cookie-btn, .filter-btn, .tour-btn'
    );
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Export functions for global access
window.openPage = openPage;
window.showGateway = showGateway;
window.openModal = openModal;
window.closeModal = closeModal;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitInquiry = submitInquiry;
window.toggleChat = toggleChat;
window.sendQuickReply = sendQuickReply;
window.sendChatMessage = sendChatMessage;
window.handleChatKeypress = handleChatKeypress;
window.toggleFaq = toggleFaq;
window.subscribeNewsletter = subscribeNewsletter;
window.slideFaculty = slideFaculty;
window.calculateFee = calculateFee;
window.showTestimonial = showTestimonial;
window.openLightbox = openLightbox;
window.openVirtualTour = openVirtualTour;
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.toggleMobileMenu = toggleMobileMenu;
window.handleGatewayKeypress = handleGatewayKeypress;
window.scrollToSection = scrollToSection;
window.toggleBookmark = toggleBookmark;
window.showToast = showToast;
window.removeToast = removeToast;
