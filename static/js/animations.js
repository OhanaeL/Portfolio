export function setupScrollReveal() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    const projectCards = document.querySelectorAll('.project-card');
    const experienceCards = document.querySelectorAll('.experience-card');
    const contactCards = document.querySelectorAll('.contact-card');
    const skillItems = document.querySelectorAll('.skill-item');
    let hasScrolled = false;
    let projectsRevealed = false;
    let experiencesRevealed = false;
    let contactRevealed = false;
    let skillsRevealed = false;
    
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
            }, index * 200);
        });
    };
    
    const revealExperiences = () => {
        if (experiencesRevealed) return;
        experiencesRevealed = true;
        
        experienceCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('reveal');
            }, index * 200);
        });
    };
    
    const revealContact = () => {
        if (contactRevealed) return;
        contactRevealed = true;
        
        contactCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('reveal');
            }, index * 150);
        });
    };
    
    const revealSkills = () => {
        if (skillsRevealed) return;
        skillsRevealed = true;
        
        skillItems.forEach((skill, index) => {
            setTimeout(() => {
                skill.classList.add('reveal');
                const bar = skill.querySelector('.skill-bar');
                if (bar) {
                    setTimeout(() => {
                        bar.classList.add('animate');
                    }, 100);
                }
            }, index * 150);
        });
    };
    
    const handleScrollAnimation = () => {
        if (isHomePage && !hasScrolled) {
            if (window.scrollY > 50) {
                hasScrolled = true;
            }
        }
        
        const isProjectsPage = window.location.pathname === '/projects';
        const isExperiencePage = window.location.pathname === '/experience';
        
        if (isProjectsPage && projectCards.length > 0 && !projectsRevealed) {
            revealProjects();
        }
        
        if (isExperiencePage && experienceCards.length > 0 && !experiencesRevealed) {
            revealExperiences();
        }
        
        scrollElements.forEach((el) => {
            if (isHomePage && !hasScrolled && el.classList.contains('projects-section')) {
                return;
            }
            
            if (elementInView(el, 100)) {
                displayScrollElement(el);
                if (el.classList.contains('projects-section')) {
                    revealProjects();
                }
                if (el.classList.contains('experience-section')) {
                    revealExperiences();
                }
                if (el.classList.contains('contact-section')) {
                    revealContact();
                }
                if (el.classList.contains('skills-section') || el.querySelector('.skills-section')) {
                    revealSkills();
                }
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    
    if (isHomePage) {
        setTimeout(() => {
            handleScrollAnimation();
        }, 100);
    } else {
        handleScrollAnimation();
        setTimeout(() => {
            handleScrollAnimation();
        }, 100);
    }
    
    const isProjectsPage = window.location.pathname === '/projects';
    if (isProjectsPage) {
        scrollElements.forEach((el) => {
            if (el.classList.contains('search-container') || el.classList.contains('tags-filter')) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, 100);
            }
        });
    }
}

export function setupTitleEcho() {
    const mainTitle = document.getElementById('mainTitle');
    if (mainTitle) {
        const wrapper = mainTitle.parentElement;
        const titleText = mainTitle.textContent;
        
        for (let i = 0; i < 3; i++) {
            const echo = document.createElement('div');
            echo.className = 'title-echo';
            echo.textContent = titleText;
            wrapper.appendChild(echo);
        }
    }
}

export function setupScrollArrow() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        setTimeout(() => {
            scrollArrow.style.animation = 'fadeInContent 1.5s ease-out forwards, bounce 2s ease-in-out infinite';
            scrollArrow.style.animationDelay = '2.5s, 5.5s';
        }, 100);
        
        scrollArrow.addEventListener('click', function() {
            const projectsSection = document.querySelector('.projects-section');
            if (projectsSection) {
                const yOffset = -100;
                const y = projectsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    }
}
