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
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'light') {
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
            if (sparklesContainer) {
                sparklesContainer.style.display = '';
                sparklesContainer.innerHTML = '';
                import('./effects.js').then(({ createLightModeBackground }) => {
                    createLightModeBackground();
                });
            }
        } else {
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
            if (sparklesContainer) {
                sparklesContainer.style.display = '';
                sparklesContainer.innerHTML = '';
                import('./effects.js').then(({ createSparkles, startShootingStars, createConstellation }) => {
                    createSparkles();
                    startShootingStars();
                    createConstellation();
                });
            }
        }
    };
    
    const toggleTheme = () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
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

