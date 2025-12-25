// Initial setup and scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Top loading bar functionality
function initLoadingBar() {
    const loadingBar = document.getElementById('top-loading-bar');
    if (!loadingBar) return;
    
    let progress = 0;
    let loadingInterval = null;
    
    function startLoading() {
        loadingBar.classList.add('loading');
        loadingBar.style.width = '0%';
        progress = 0;
        
        // Simulate progress
        loadingInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 15;
                if (progress > 90) progress = 90;
                loadingBar.style.width = progress + '%';
            }
        }, 100);
    }
    
    function completeLoading() {
        if (loadingInterval) {
            clearInterval(loadingInterval);
        }
        loadingBar.style.width = '100%';
        setTimeout(() => {
            loadingBar.classList.add('complete');
            setTimeout(() => {
                loadingBar.classList.remove('loading', 'complete');
                loadingBar.style.width = '0%';
            }, 500);
        }, 200);
    }
    
    // Start loading immediately
    startLoading();
    
    // Complete when page is loaded
    if (document.readyState === 'complete') {
        completeLoading();
    } else {
        window.addEventListener('load', function() {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            completeLoading();
        });
    }
    
    // Also handle page visibility for navigation
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            startLoading();
            setTimeout(completeLoading, 300);
        }
    });
}

// Initialize loading bar
initLoadingBar();

