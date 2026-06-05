document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Select Dropdown logic ---
    const customSelect = document.getElementById('service-select-container');
    const selectedDisplay = document.getElementById('selected-service-display');
    const optionsList = document.getElementById('service-options-list');
    const hiddenInput = document.getElementById('hidden-service-input');
    
    customSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelect.classList.toggle('active');
        optionsList.classList.toggle('select-hide');
    });
    
    document.addEventListener('click', () => {
        customSelect.classList.remove('active');
        optionsList.classList.add('select-hide');
    });
    
    optionsList.querySelectorAll('div').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = option.getAttribute('data-val');
            const text = option.textContent;
            
            selectedDisplay.textContent = text;
            hiddenInput.value = val;
            
            customSelect.classList.remove('active');
            optionsList.classList.add('select-hide');
        });
    });
    
    // --- 2. Stats counter animation logic ---
    const stats = document.querySelectorAll('.stat-num');
    let animatedStats = false;
    
    const animateStats = () => {
        if (animatedStats) return;
        animatedStats = true;
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-val'), 10);
            let current = 0;
            const duration = 1500; // ms
            const stepTime = Math.abs(Math.floor(duration / target));
            
            const timer = setInterval(() => {
                current += Math.ceil(target / 40); // larger increments for faster counter
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = current;
            }, 30);
        });
    };
    
    // --- 3. Scroll snappable active nav highlight & dot updater ---
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const obsOptions = {
        root: document.getElementById('main-scroll'),
        threshold: 0.5 // trigger active link when section occupies 50%+ viewport
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Highlight corresponding navbar link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                    // special handler for service section
                    if (sectionId === 'service' && link.getAttribute('href') === '#service') {
                        link.classList.add('active');
                    }
                });
                
                // If it is the about section, trigger stats counting
                if (sectionId === 'about') {
                    animateStats();
                }
            }
        });
    }, obsOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // --- 4. Service Section scroll-interactive behavior ---
    const serviceSection = document.getElementById('service');
    const introView = document.getElementById('services-intro-view');
    
    // Add smooth mouse-wheel horizontal scrolling inside services list container
    const serviceContainer = document.querySelector('.services-wrapper');
    serviceContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            serviceContainer.scrollBy({
                left: e.deltaY * 1.2,
                behavior: 'smooth'
            });
        }
    }, { passive: false });
    
    // Fade out introductory title after viewing service section
    const serviceObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    introView.classList.add('fade-out');
                }, 800); // 800ms of visual branding before revealing list
            } else {
                introView.classList.remove('fade-out');
            }
        });
    }, { threshold: 0.2 });
    
    serviceObs.observe(serviceSection);
    
    // Testimonials horizontal wheel scrolling helper
    const testimonialContainer = document.querySelector('.testimonials-horizontal-scroll');
    testimonialContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            testimonialContainer.scrollBy({
                left: e.deltaY * 1.2,
                behavior: 'smooth'
            });
        }
    }, { passive: false });
    
    // --- 5. Contact Form submission demonstration ---
    const contactForm = document.getElementById('agency-contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('form-submit-btn');
        submitBtn.style.background = 'var(--brand-teal)';
        submitBtn.style.color = '#ffffff';
        submitBtn.innerHTML = '<span>Message Sent!</span>';
        
        setTimeout(() => {
            contactForm.reset();
            selectedDisplay.textContent = 'Select...';
            hiddenInput.value = '';
            submitBtn.style.background = 'var(--brand-green)';
            submitBtn.style.color = 'var(--brand-teal)';
            submitBtn.innerHTML = '<span>Submit</span>';
        }, 3000);
    });

    // --- 6. Project Card Video Lightbox ---
    const overlay     = document.getElementById('video-modal-overlay');
    const modalPlayer = document.getElementById('modal-video-player');
    const modalSource = document.getElementById('modal-video-source');
    const modalTitle  = document.getElementById('video-modal-title');
    const modalTag    = document.getElementById('video-modal-tag');
    const closeBtn    = document.getElementById('video-modal-close');

    function openModal(videoSrc, title, tag) {
        // Pause all looping card preview videos
        document.querySelectorAll('.project-video').forEach(v => v.pause());

        modalSource.src = videoSrc;
        modalTitle.textContent = title;
        modalTag.textContent = tag;
        modalPlayer.load();
        modalPlayer.play();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('active');
        modalPlayer.pause();
        modalPlayer.currentTime = 0;
        modalSource.src = '';
        document.body.style.overflow = '';
        // Resume looping card preview videos
        document.querySelectorAll('.project-video').forEach(v => v.play());
    }

    document.querySelectorAll('.project-card[data-video]').forEach(card => {
        card.addEventListener('click', () => {
            openModal(
                card.getAttribute('data-video'),
                card.getAttribute('data-title'),
                card.getAttribute('data-tag')
            );
        });
    });

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on X button
    closeBtn.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });
});
