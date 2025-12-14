// Image hover preview functionality
export function setupImageHover() {
    const imageHoverTriggers = document.querySelectorAll('.image-hover-trigger');
    if (imageHoverTriggers.length > 0) {
        // Create a portal container at the very root to avoid all stacking context issues
        let portal = document.getElementById('image-preview-portal');
        if (!portal) {
            portal = document.createElement('div');
            portal.id = 'image-preview-portal';
            portal.style.cssText = 'position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 99999; pointer-events: none;';
            document.body.appendChild(portal);
        }
        
        // Create a single preview element
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        portal.appendChild(preview);
        
        imageHoverTriggers.forEach(trigger => {
            const imageSrc = trigger.getAttribute('data-image');
            
            trigger.addEventListener('mouseenter', function() {
                // Create image element
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = 'Preview';
                
                // Clear previous content
                preview.innerHTML = '';
                preview.appendChild(img);
                
                // Position preview above the trigger element
                const rect = trigger.getBoundingClientRect();
                preview.style.position = 'fixed';
                preview.style.zIndex = '10000';
                preview.style.bottom = 'auto';
                
                img.onload = function() {
                    const imageHeight = img.offsetHeight;
                    const imageWidth = img.offsetWidth;
                    // Position below navbar (navbar is ~80px tall) and below the trigger
                    const navbarHeight = 80;
                    const spacing = 20;
                    preview.style.top = Math.max(rect.bottom + spacing, navbarHeight + spacing) + 'px';
                    preview.style.left = (rect.left + imageWidth / 4) + 'px';
                };
                
                // Show preview
                preview.classList.add('active');
            });
            
            trigger.addEventListener('mouseleave', function() {
                // Hide preview
                preview.classList.remove('active');
            });
        });
    }
}

// Image preview modal functionality (click to view)
export function setupImagePreview() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) {
        return; // No gallery items, nothing to do
    }
    
    // Remove any existing modal first
    const existingModal = document.getElementById('image-preview-modal-portal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal portal directly in body
    const modal = document.createElement('div');
    modal.id = 'image-preview-modal-portal';
    modal.className = 'image-preview-modal';
    modal.innerHTML = `
        <button class="image-preview-close" aria-label="Close"><i class="fas fa-times"></i></button>
        <div class="image-preview-content">
            <img src="" alt="" id="image-preview-img">
            <div class="image-preview-title" id="image-preview-title"></div>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(modal);
    
    const modalImg = document.getElementById('image-preview-img');
    const modalTitle = document.getElementById('image-preview-title');
    const closeBtn = modal.querySelector('.image-preview-close');
    
    function openPreview(imgSrc, title) {
        if (modalImg) {
            modalImg.src = imgSrc;
        }
        if (modalTitle) {
            modalTitle.textContent = title || '';
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closePreview(e) {
        if (e) {
            e.stopPropagation();
        }
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Add click handlers to gallery items
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const titleEl = item.querySelector('.gallery-title');
        
        if (img) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const title = titleEl ? titleEl.textContent : '';
                openPreview(img.src, title);
            });
        }
    });
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closePreview);
    }
    
    // Close on overlay click (but not on the content)
    modal.addEventListener('click', function(e) {
        // Only close if clicking directly on the modal background, not on content
        if (e.target === modal || (e.target.classList.contains('image-preview-modal') && !e.target.closest('.image-preview-content'))) {
            closePreview(e);
        }
    });
    
    // Prevent clicks on content from closing
    const content = modal.querySelector('.image-preview-content');
    if (content) {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePreview();
        }
    });
}


