document.addEventListener('DOMContentLoaded', () => {

    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // 2. Mobile Menu Implementation
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');

    function toggleMenu(isOpen) {
        menuToggle.classList.toggle('open', isOpen);
        navMenu.classList.toggle('open', isOpen);
        if (navOverlay) navOverlay.classList.toggle('open', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar Menu' : 'Abrir Menu');
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const currentlyOpen = menuToggle.classList.contains('open');
            toggleMenu(!currentlyOpen);
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', () => toggleMenu(false));
        }

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close menu with Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // 3. Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Optimized Counter Animation using requestAnimationFrame
    const stats = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = +element.getAttribute('data-target');
        let current = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: easeOutExpo
            const easedProgress = 1 - Math.pow(2, -10 * progress);
            current = Math.floor(easedProgress * target);

            element.innerText = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.innerText = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    // 5. FAQ Accordion with Accessibility (ARIA)
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Close other open FAQ items
            faqTriggers.forEach(other => {
                if (other !== trigger) {
                    other.setAttribute('aria-expanded', 'false');
                    other.nextElementSibling.style.maxHeight = '0';
                }
            });

            // Toggle current item
            trigger.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? '0' : content.scrollHeight + 'px';
        });
    });
});
