import { setupMobileMenu } from './mobile-menu.js';
import { createSparkles, startShootingStars, createConstellation, createLightModeBackground } from './effects.js';
import { setupScrollReveal, setupTitleEcho, setupScrollArrow } from './animations.js';
import { setupSmoothScroll } from './navigation.js';
import { setupImageHover, setupImagePreview } from './gallery.js';
import { setupTagFilters, setupProjectSearch } from './filters.js';
import { setupCertificateTooltips } from './certificates.js';
import { setupThemeToggle } from './theme.js';

document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggle();
    
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
});
