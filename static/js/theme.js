export function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    const sparklesContainer = document.querySelector('.sparkles-container');
    
    const getTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    };
    
    let themeChangeTimeout = null;
    let isChangingTheme = false;
    
    const setTheme = (theme) => {
        // Prevent rapid theme changes
        if (isChangingTheme) {
            return;
        }
        
        isChangingTheme = true;
        
        // Clear any pending theme changes
        if (themeChangeTimeout) {
            clearTimeout(themeChangeTimeout);
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'light') {
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
            if (sparklesContainer) {
                sparklesContainer.style.display = '';
                sparklesContainer.innerHTML = '';
                import('./effects.js').then(({ createLightModeBackground, stopShootingStars }) => {
                    stopShootingStars();
                    createLightModeBackground();
                    isChangingTheme = false;
                });
            } else {
                isChangingTheme = false;
            }
        } else {
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
            if (sparklesContainer) {
                sparklesContainer.style.display = '';
                sparklesContainer.innerHTML = '';
                import('./effects.js').then(({ createSparkles, startShootingStars, createConstellation, stopShootingStars }) => {
                    stopShootingStars();
                    createSparkles();
                    startShootingStars();
                    createConstellation();
                    isChangingTheme = false;
                });
            } else {
                isChangingTheme = false;
            }
        }
    };
    
    const toggleTheme = () => {
        // Debounce rapid clicks
        if (themeChangeTimeout) {
            clearTimeout(themeChangeTimeout);
        }
        
        themeChangeTimeout = setTimeout(() => {
            const currentTheme = getTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            themeChangeTimeout = null;
        }, 100);
    };
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    const initialTheme = getTheme();
    setTheme(initialTheme);
}

