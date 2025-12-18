// Scroll reveal animation
export function setupScrollReveal() {
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
    
    const elementInView = (el, offset = 100) => {
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
            
            if (elementInView(el, 100)) {
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
export function setupTitleEcho() {
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
}

// Scroll arrow smooth scroll and bounce animation
export function setupScrollArrow() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        // Add bounce animation after fade in completes
        setTimeout(() => {
            scrollArrow.style.animation = 'fadeInContent 1.5s ease-out forwards, bounce 2s ease-in-out infinite';
            scrollArrow.style.animationDelay = '2.5s, 5.5s';
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
}

