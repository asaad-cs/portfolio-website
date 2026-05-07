/* ========================================
   AHMED SAAD – PORTFOLIO SCRIPTS
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initParticles();
    initNavbar();
    initScrollAnimations();
    initRoleCarousel();
    initStatCounters();
    initSkillBars();
    initProjectFilters();
    initContactForm();
});

/* ========================================
   CUSTOM CURSOR
======================================== */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
    });

    function animateFollower() {
        fx += (mx - fx) * 0.15;
        fy += (my - fy) * 0.15;
        follower.style.left = fx + 'px';
        follower.style.top = fy + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category, .cert-card, .timeline-content, .contact-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

/* ========================================
   PARTICLE BACKGROUND
======================================== */
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = Math.min(80, Math.floor(window.innerWidth / 18));

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.8 + 0.5,
            o: Math.random() * 0.35 + 0.08,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${p.o})`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(102, 126, 234, ${0.06 * (1 - dist / 140)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(draw);
    }
    draw();
}

/* ========================================
   NAVBAR
======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Active link based on scroll
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
        });
    });
}

/* ========================================
   SCROLL ANIMATIONS (Intersection Observer)
======================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => entry.target.classList.add('visible'), delay);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach(el => observer.observe(el));
}

/* ========================================
   ROLE CAROUSEL
======================================== */
function initRoleCarousel() {
    const roles = document.querySelectorAll('.role');
    if (roles.length === 0) return;
    let idx = 0;

    setInterval(() => {
        roles[idx].classList.remove('active');
        idx = (idx + 1) % roles.length;
        roles[idx].classList.add('active');
    }, 2600);
}

/* ========================================
   STAT COUNTER ANIMATION
======================================== */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    counters.forEach(c => observer.observe(c));
}

function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1600;
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

/* ========================================
   SKILL BARS
======================================== */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.dataset.width + '%';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );
    bars.forEach(b => observer.observe(b));
}

/* ========================================
   PROJECT FILTERS
======================================== */
function initProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.45s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ========================================
   CONTACT FORM
======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // تهيئة EmailJS (مرة وحدة)
    emailjs.init("GS8YCnEefIybKvf2l");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('#submit-btn');
        const origHTML = btn.innerHTML;

        // جلب القيم من الفورم
        const name = form.querySelector("[name='name']").value;
        const email = form.querySelector("[name='email']").value;
        const subject = form.querySelector("[name='subject']").value;
        const message = form.querySelector("[name='message']").value;

        // تغيير شكل الزر (loading)
        btn.innerHTML = '<span>Sending...</span>';
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';

        // إرسال الإيميل
        emailjs.send("service_exzj4sk", "template_za0a0u9", {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
        })
        .then(() => {
            btn.innerHTML = '<span>Success (Message Sent)</span>';
            form.reset();
        })
        .catch(() => {
            btn.innerHTML = '<span>Error</span>';
        })
        .finally(() => {
            setTimeout(() => {
                btn.innerHTML = origHTML;
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
            }, 2500);
        });
    });
}

/* ========================================
   UTILITY ANIMATION KEYFRAMES (injected)
======================================== */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
