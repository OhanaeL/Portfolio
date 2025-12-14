// Force scroll to top immediately
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Also force on load
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-nav-sidebar');
    const mobileOverlay = document.getElementById('mobile-sidebar-overlay');
    
    if (mobileMenuBtn && mobileSidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileSidebar.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            
            // Prevent body scrolling when sidebar is open
            if (mobileSidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            } else {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        });
        
        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileSidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        });
        
        // Close menu when clicking a nav link in mobile sidebar
        mobileSidebar.querySelectorAll('.nav-link:not(.dropdown-btn)').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileSidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            });
        });
        
        // Dropdown functionality for mobile sidebar
        const mobileDropdownBtns = mobileSidebar.querySelectorAll('.dropdown-btn');
        mobileDropdownBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = btn.closest('.dropdown');
                dropdown.classList.toggle('active');
            });
        });
    }
    
    // Desktop dropdown (hover-based only for desktop)
    const desktopDropdowns = document.querySelectorAll('.desktop-nav .dropdown');
    desktopDropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            dropdown.classList.add('active');
        });
        dropdown.addEventListener('mouseleave', () => {
            dropdown.classList.remove('active');
        });
    });
});

// Sparkles effect
function createSparkles() {
    const container = document.querySelector('.sparkles-container');
    if (!container) return;
    
    const sparkleCount = 50;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = Math.random() > 0.7 ? 'sparkle purple' : 'sparkle';
        
        // Random position
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        
        // Random animation duration and delay
        sparkle.style.setProperty('--duration', (2 + Math.random() * 3) + 's');
        sparkle.style.setProperty('--delay', Math.random() * 5 + 's');
        
        container.appendChild(sparkle);
    }
}

// Create shooting star effect
function createShootingStar() {
    const container = document.querySelector('.sparkles-container');
    if (!container) return;
    
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    // Random starting position (from top-right area)
    const startX = 60 + Math.random() * 40; // 60-100% from left
    const startY = Math.random() * 30; // 0-30% from top
    
    star.style.left = startX + '%';
    star.style.top = startY + '%';
    
    // Random duration (2-4 seconds)
    const duration = 2 + Math.random() * 2;
    star.style.animation = `shootingStar ${duration}s ease-out forwards`;
    
    container.appendChild(star);
    
    // Remove the star after animation completes
    setTimeout(() => {
        star.remove();
    }, duration * 1000);
}

// Trigger shooting stars at random intervals
function startShootingStars() {
    function scheduleNextStar() {
        // Random interval between 8-15 seconds
        const interval = 8000 + Math.random() * 7000;
        
        setTimeout(() => {
            createShootingStar();
            scheduleNextStar();
        }, interval);
    }
    
    // Start the first shooting star after a random delay
    setTimeout(() => {
        createShootingStar();
        scheduleNextStar();
    }, 3000 + Math.random() * 5000);
}

// Scroll reveal animation
function setupScrollReveal() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    const projectCards = document.querySelectorAll('.project-card');
    const contactCards = document.querySelectorAll('.contact-card');
    const skillItems = document.querySelectorAll('.skill-item');
    let hasScrolled = false;
    let projectsRevealed = false;
    let contactRevealed = false;
    let skillsRevealed = false;
    
    // Check if we're on the home page
    const isHomePage = window.location.pathname === '/';
    
    const elementInView = (el, offset = 200) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const revealProjects = () => {
        if (projectsRevealed) return;
        projectsRevealed = true;
        
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('reveal');
            }, index * 200); // 200ms delay between each card
        });
    };
    
    const revealContact = () => {
        if (contactRevealed) return;
        contactRevealed = true;
        
        contactCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('reveal');
            }, index * 150); // 150ms delay between each card
        });
    };
    
    const revealSkills = () => {
        if (skillsRevealed) return;
        skillsRevealed = true;
        
        skillItems.forEach((skill, index) => {
            setTimeout(() => {
                skill.classList.add('reveal');
                // Animate the progress bar
                const bar = skill.querySelector('.skill-bar');
                if (bar) {
                    setTimeout(() => {
                        bar.classList.add('animate');
                    }, 100);
                }
            }, index * 150); // 150ms delay between each skill
        });
    };
    
    const handleScrollAnimation = () => {
        // On home page, gate scroll reveals until user scrolls OR until initial check
        if (isHomePage && !hasScrolled) {
            if (window.scrollY > 50) {
                hasScrolled = true;
            }
        }
        
        // Check each scroll-reveal element
        scrollElements.forEach((el) => {
            // On home page, skip projects section until scrolled
            if (isHomePage && !hasScrolled && el.classList.contains('projects-section')) {
                return;
            }
            
            if (elementInView(el, 200)) {
                displayScrollElement(el);
                // If this is the projects section, reveal cards one by one
                if (el.classList.contains('projects-section')) {
                    revealProjects();
                }
                // If this is the contact section, reveal cards one by one
                if (el.classList.contains('contact-section')) {
                    revealContact();
                }
                // If this has skills, reveal them one by one
                if (el.classList.contains('skills-section') || el.querySelector('.skills-section')) {
                    revealSkills();
                }
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Initial check on page load
    // For home page, wait a bit for echo animation
    // For other pages, check immediately
    if (isHomePage) {
        setTimeout(() => {
            handleScrollAnimation();
        }, 100);
    } else {
        // Check immediately on other pages
        handleScrollAnimation();
        // Check again after a short delay to catch any late-loading elements
        setTimeout(() => {
            handleScrollAnimation();
        }, 100);
    }
}

// Title echo effect
document.addEventListener('DOMContentLoaded', function() {
    createSparkles();
    startShootingStars();
    setupScrollReveal();
    setupTagFilters();
    setupProjectSearch();
    // setupContactForm(); // Removed - no contact form
    
    const mainTitle = document.getElementById('mainTitle');
    if (mainTitle) {
        const wrapper = mainTitle.parentElement;
        const titleText = mainTitle.textContent;
        
        // Create 3 echo duplicates
        for (let i = 0; i < 3; i++) {
            const echo = document.createElement('div');
            echo.className = 'title-echo';
            echo.textContent = titleText;
            wrapper.appendChild(echo);
        }
    }
    
    // Scroll arrow smooth scroll and bounce animation
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        // Add bounce animation after fade in completes
        setTimeout(() => {
            scrollArrow.style.animation = 'fadeInContent 1.5s ease-out forwards, bounce 2s ease-in-out infinite';
            scrollArrow.style.animationDelay = '1.5s, 4.5s';
        }, 100);
        
        scrollArrow.addEventListener('click', function() {
            const projectsSection = document.querySelector('.projects-section');
            if (projectsSection) {
                const yOffset = -100; // Offset to account for navbar and add some spacing
                const y = projectsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    }
    
    // Contact nav link smooth scroll
    const contactNavLink = document.getElementById('contact-nav-link');
    if (contactNavLink) {
        contactNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const yOffset = -100; // Offset to account for navbar
                const y = contactSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    }
    
    // Resume scroll link
    const scrollToResume = document.getElementById('scroll-to-resume');
    if (scrollToResume) {
        scrollToResume.addEventListener('click', function(e) {
            e.preventDefault();
            const resumeSection = document.getElementById('resume-download');
            if (resumeSection) {
                const yOffset = -100; // Offset to account for navbar
                const y = resumeSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    }
    
    // Image hover preview functionality
    const imageHoverTriggers = document.querySelectorAll('.image-hover-trigger');
    if (imageHoverTriggers.length > 0) {
        // Create a single preview element
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        document.body.appendChild(preview);
        
        imageHoverTriggers.forEach(trigger => {
            const imageSrc = trigger.getAttribute('data-image');
            
            trigger.addEventListener('mouseenter', function() {
                // Create image element
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = 'Preview';
                
                // Clear previous content
                preview.innerHTML = '';
                preview.appendChild(img);
                
                // Position preview above the trigger element
                const rect = trigger.getBoundingClientRect();
                preview.style.position = 'fixed';
                
                img.onload = function() {
                    const imageHeight = img.offsetHeight;
                    const imageWidth = img.offsetWidth;
                    preview.style.top = (rect.top - imageHeight - 15) + 'px';
                    preview.style.left = (rect.left + imageWidth / 4) + 'px';
                };
                
                // Show preview
                preview.classList.add('active');
            });
            
            trigger.addEventListener('mouseleave', function() {
                // Hide preview
                preview.classList.remove('active');
            });
        });
    }
    
    // Lightbox gallery functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        let currentImageIndex = 0;
        const images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            title: item.querySelector('.gallery-title').textContent
        }));
        
        function showImage(index) {
            currentImageIndex = index;
            lightboxImage.src = images[index].src;
            lightboxTitle.textContent = images[index].title;
            lightbox.classList.add('active');
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
        }
        
        function showNext() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        }
        
        function showPrev() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(currentImageIndex);
        }
        
        // Event listeners
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => showImage(index));
        });
        
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        
        // Close on overlay click
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
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            } else if (e.key === 'ArrowRight') {
                showNext();
            }
        });
    }
});

// Tag filtering functionality
function setupTagFilters() {
    const tagsContainer = document.getElementById('tags-filter');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!tagsContainer || projectCards.length === 0) return;
    
    // Collect all unique tags from project cards
    const allTags = new Set();
    projectCards.forEach(card => {
        const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
        cardTags.forEach(tag => {
            if (tag.trim()) {
                allTags.add(tag.trim());
            }
        });
    });
    
    // Create "All" button
    const allButton = document.createElement('button');
    allButton.className = 'tag-filter-btn active';
    allButton.dataset.tag = 'all';
    allButton.innerHTML = '<i class="fas fa-th"></i> All';
    tagsContainer.appendChild(allButton);
    
    // Create tag buttons
    Array.from(allTags).sort().forEach(tag => {
        const button = document.createElement('button');
        button.className = 'tag-filter-btn';
        button.dataset.tag = tag;
        button.textContent = tag;
        tagsContainer.appendChild(button);
    });
    
    // Add event listeners to all tag buttons
    const tagButtons = tagsContainer.querySelectorAll('.tag-filter-btn');
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tagButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const selectedTag = button.dataset.tag;
            
            // Clear search when switching tags
            const searchInput = document.getElementById('project-search');
            if (searchInput) {
                searchInput.value = '';
                const clearBtn = document.getElementById('search-clear');
                if (clearBtn) clearBtn.style.display = 'none';
            }
            
            projectCards.forEach(card => {
                if (selectedTag === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const cardTags = card.dataset.tags ? card.dataset.tags.split(',').map(t => t.trim()) : [];
                    if (cardTags.includes(selectedTag)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formStatus = document.getElementById('form-status');
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                formStatus.className = 'form-status success';
                formStatus.textContent = result.message;
                contactForm.reset();
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = result.message;
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'An error occurred. Please try again or email directly.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            formStatus.style.display = 'block';
        }
    });
}

// Search functionality
function setupProjectSearch() {
    const searchInput = document.getElementById('project-search');
    const searchClear = document.getElementById('search-clear');
    const projectCards = document.querySelectorAll('.project-card');
    const tagButtons = document.querySelectorAll('.tag-filter-btn');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Show/hide clear button
        searchClear.style.display = searchTerm ? 'block' : 'none';
        
        // Reset tag filter when searching
        if (searchTerm) {
            tagButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tag === 'all') {
                    btn.classList.add('active');
                }
            });
        }
        
        // Filter projects
        projectCards.forEach(card => {
            const projectName = card.querySelector('h3').textContent.toLowerCase();
            const projectDesc = card.querySelector('.project-short-desc').textContent.toLowerCase();
            const projectTags = card.dataset.tags ? card.dataset.tags.toLowerCase() : '';
            
            const matches = projectName.includes(searchTerm) || 
                          projectDesc.includes(searchTerm) || 
                          projectTags.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
    
    // Clear search button
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        projectCards.forEach(card => card.classList.remove('hidden'));
    });
}
