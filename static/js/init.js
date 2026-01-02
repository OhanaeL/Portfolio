
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

function initLoadingBar() {
    const loadingBar = document.getElementById('top-loading-bar');
    if (!loadingBar) return;
    
    let progress = 0;
    let loadingInterval = null;
    
    function startLoading() {
        loadingBar.classList.add('loading');
        loadingBar.style.width = '0%';
        progress = 0;
        
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
    
    startLoading();
    
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
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            startLoading();
            setTimeout(completeLoading, 300);
        }
    });
}

initLoadingBar();

document.addEventListener('DOMContentLoaded', function() {
    const scrollMediaBtn = document.querySelector('.scroll-media-cta');
    if (scrollMediaBtn) {
        scrollMediaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    const teamOthersToggle = document.querySelector('.team-others-toggle');
    
    if (teamOthersToggle) {
        const othersText = teamOthersToggle.getAttribute('data-others');
        const originalText = teamOthersToggle.textContent;
        let isExpanded = false;
        
        teamOthersToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isExpanded) {
                this.textContent = originalText;
                isExpanded = false;
            } else {
                this.textContent = othersText;
                isExpanded = true;
            }
        });
    }
});

