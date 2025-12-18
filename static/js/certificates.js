export function setupCertificateTooltips() {
    const tooltipWrappers = document.querySelectorAll('.certificate-description-wrapper');
    
    tooltipWrappers.forEach(wrapper => {
        const tooltip = wrapper.querySelector('.certificate-description-tooltip');
        if (!tooltip) return;
        
        wrapper.addEventListener('mouseenter', function() {
            const wrapperRect = wrapper.getBoundingClientRect();
            
            tooltip.classList.remove('tooltip-right', 'tooltip-top', 'active');
            
            const tooltipWidth = 320;
            const tooltipHeight = 200;
            
            const viewportWidth = window.innerWidth;
            const spaceRight = viewportWidth - wrapperRect.right;
            const spaceTop = wrapperRect.top;
            
            const minSpaceRight = tooltipWidth + 30;
            const minSpaceTop = tooltipHeight + 30;
            
            if (spaceRight >= minSpaceRight) {
                tooltip.classList.add('tooltip-right');
            } else {
                tooltip.classList.add('tooltip-top');
            }
            
            tooltip.style.display = 'block';
            requestAnimationFrame(() => {
                tooltip.classList.add('active');
            });
        });
        
        wrapper.addEventListener('mouseleave', function() {
            tooltip.classList.remove('active');
            setTimeout(() => {
                if (!tooltip.classList.contains('active')) {
                    tooltip.style.display = 'none';
                }
            }, 200);
        });
    });
}

