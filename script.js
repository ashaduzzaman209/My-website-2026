// ===== Mobile Menu =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Sticky Navbar Scroll =====
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        scrollTopBtn.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        scrollTopBtn.classList.remove('visible');
    }
    updateActiveNav();
});

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Counter Animation =====
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            updateCounter();
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== Portfolio Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== Testimonial Slider =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % testimonialCards.length;
    showSlide(next);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
}

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        showSlide(i);
        clearInterval(slideInterval);
        startSlider();
    });
});

if (testimonialCards.length > 0) startSlider();

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Open clicked one
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            btn.style.background = '#3bb890';
            
            setTimeout(() => {
                alert('✅ Thank you! Your message has been sent successfully. We will contact you soon.');
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 500);
        }, 1500);
    });
}

// ===== Newsletter Form =====
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✅ Thank you! You have successfully subscribed.');
        newsletterForm.reset();
    });
}

// ===== Scroll Top =====
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Scroll Animation =====
const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animateObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .team-card, .blog-card, .pricing-card, .feature-box, .info-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    animateObserver.observe(el);
});

// ===== Console Message =====
console.log('%c🚀 TechHub Website Loaded Successfully!', 'color: #4ecca3; font-size: 20px; font-weight: bold;');
console.log('%c💻 Developed with ❤️', 'color: #1a1a2e; font-size: 14px;');
