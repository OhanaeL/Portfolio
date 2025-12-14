// Smooth scroll navigation
export function setupSmoothScroll() {
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
}

