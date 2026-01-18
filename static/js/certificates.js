export function setupCertificateTooltips() {
    const tooltipWrappers = document.querySelectorAll('.certificate-description-wrapper');
    
    if (tooltipWrappers.length === 0) {
        return;
    }
    
    let tooltip = document.getElementById('certificate-tooltip-portal');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'certificate-tooltip-portal';
        tooltip.className = 'certificate-description-tooltip';
        tooltip.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 10000; pointer-events: none; display: none;';
        document.body.appendChild(tooltip);
    }
    
    let activeWrapper = null;
    let currentMouseX = 0;
    let currentMouseY = 0;
    
    function updateMousePosition(e) {
        currentMouseX = e.clientX;
        currentMouseY = e.clientY;
    }
    
    function updateTooltipPosition(mouseX, mouseY) {
        const offsetY = 20;
        const tooltipWidth = tooltip.offsetWidth || 320;
        const tooltipHeight = tooltip.offsetHeight || 200;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = mouseX - (tooltipWidth / 2);
        let top = mouseY - tooltipHeight - offsetY;
        
        if (left < 10) {
            left = 10;
        } else if (left + tooltipWidth > viewportWidth - 10) {
            left = viewportWidth - tooltipWidth - 10;
        }
        
        if (top < 10) {
            top = mouseY + offsetY;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
    
    function handleMouseMove(e) {
        updateMousePosition(e);
        if (activeWrapper && tooltip.style.display !== 'none') {
            updateTooltipPosition(currentMouseX, currentMouseY);
        }
    }
    
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    
    tooltipWrappers.forEach(wrapper => {
        const descriptionText = wrapper.querySelector('.certificate-description');
        if (!descriptionText) return;
        
        wrapper.addEventListener('mouseenter', function(e) {
            if (isMobile()) return;
            
            activeWrapper = wrapper;
            
            if (e) {
                updateMousePosition(e);
            }
            
            tooltip.textContent = descriptionText.textContent;
            tooltip.style.display = 'block';
            tooltip.offsetHeight;
            updateTooltipPosition(currentMouseX, currentMouseY);
                tooltip.classList.add('active');
        });
        
        wrapper.addEventListener('mouseleave', function() {
            if (isMobile()) return;
            
            if (activeWrapper === wrapper) {
                activeWrapper = null;
            tooltip.classList.remove('active');
            setTimeout(() => {
                if (!tooltip.classList.contains('active')) {
                    tooltip.style.display = 'none';
                }
            }, 200);
            }
        });
    });
}

export function setupCertificateExpand() {
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    function handleResize() {
        certificateCards.forEach(card => {
            if (window.innerWidth > 768) {
                card.classList.remove('expanded');
            }
        });
    }
    
    window.addEventListener('resize', handleResize);
    
    certificateCards.forEach(card => {
        const toggle = card.querySelector('.certificate-toggle');
        const expandBtn = card.querySelector('.certificate-expand-btn');
        
        if (!toggle || !expandBtn) return;
        
        function toggleExpand(e) {
            if (window.innerWidth > 768) return;
            
            e.stopPropagation();
            card.classList.toggle('expanded');
        }
        
        toggle.addEventListener('click', toggleExpand);
        expandBtn.addEventListener('click', toggleExpand);
        
        const links = card.querySelectorAll('.certificate-btn');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    });
}
