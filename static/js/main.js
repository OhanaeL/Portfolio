// Main entry point - imports and initializes all modules
import { setupMobileMenu } from './mobile-menu.js';
import { createSparkles, startShootingStars } from './effects.js';
import { setupScrollReveal, setupTitleEcho, setupScrollArrow } from './animations.js';
import { setupSmoothScroll } from './navigation.js';
import { setupImageHover, setupImagePreview } from './gallery.js';
import { setupTagFilters, setupProjectSearch } from './filters.js';
import { setupCertificateTooltips } from './certificates.js';
// import { setupContactForm } from './contact.js'; // Removed - no contact form

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Setup effects
    createSparkles();
    startShootingStars();
    
    // Setup UI components
    setupMobileMenu();
    setupScrollReveal();
    setupTagFilters();
    setupProjectSearch();
    setupTitleEcho();
    setupScrollArrow();
    setupSmoothScroll();
    setupImageHover();
    setupImagePreview();
    setupCertificateTooltips();
    // setupContactForm(); // Removed - no contact form
});

