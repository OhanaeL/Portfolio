// Mobile menu functionality
export function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-nav-sidebar');
    const mobileOverlay = document.getElementById('mobile-sidebar-overlay');
    let scrollPosition = 0;
    
    if (mobileMenuBtn && mobileSidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileSidebar.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            
            // Prevent body scrolling when sidebar is open
            if (mobileSidebar.classList.contains('active')) {
                scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollPosition}px`;
                document.body.style.width = '100%';
            } else {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollPosition);
            }
        });
        
        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileSidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollPosition);
        });
        
        // Close menu when clicking a nav link in mobile sidebar
        mobileSidebar.querySelectorAll('.nav-link:not(.dropdown-btn)').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileSidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollPosition);
            });
        });
        
        // Dropdown functionality for mobile sidebar
        const mobileDropdownBtns = mobileSidebar.querySelectorAll('.dropdown-btn');
        mobileSidebar.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
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
    const desktopDropdowns = document.querySelectorAll('.navbar.desktop-navbar .dropdown');
    desktopDropdowns.forEach(dropdown => {
        let closeTimeout;
        
        dropdown.classList.remove('active');
        
        dropdown.addEventListener('mouseenter', () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            dropdown.classList.add('active');
        });
        
        dropdown.addEventListener('mouseleave', () => {
            closeTimeout = setTimeout(() => {
                dropdown.classList.remove('active');
                closeTimeout = null;
            }, 100);
        });
    });
}

