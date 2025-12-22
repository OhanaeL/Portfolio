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
        
        // Image cache to preload images
        const imageCache = new Map();
        
        // Preload function
        function preloadImage(src) {
            return new Promise((resolve, reject) => {
                // Check cache first
                if (imageCache.has(src)) {
                    const cached = imageCache.get(src);
                    if (cached.complete) {
                        resolve(cached);
                        return;
                    }
                }
                
                const img = new Image();
                img.onload = () => {
                    imageCache.set(src, img);
                    resolve(img);
                };
                img.onerror = reject;
                img.src = src;
            });
        }
        
        // Track current active trigger and image
        let activeTrigger = null;
        let currentImageSrc = null;
        let isImageLoaded = false;
        let currentMouseX = 0;
        let currentMouseY = 0;
        
        // Update mouse position
        function updateMousePosition(e) {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
        }
        
        // Mouse move handler to follow cursor
        function handleMouseMove(e) {
            updateMousePosition(e);
            if (!activeTrigger || !isImageLoaded) return;
            
            updatePreviewPosition(currentMouseX, currentMouseY);
        }
        
        // Update preview position based on mouse coordinates
        function updatePreviewPosition(mouseX, mouseY) {
            const offsetY = 20; // 20 pixels above cursor
            const previewImg = preview.querySelector('img');
            if (!previewImg) return;
            
            const imgWidth = previewImg.offsetWidth || 300;
            const imgHeight = previewImg.offsetHeight || 250;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate position - center horizontally on cursor
            let left = mouseX - (imgWidth / 2);
            let top = mouseY - imgHeight - offsetY;
            
            // Keep preview within viewport bounds
            if (left < 10) {
                left = 10;
            } else if (left + imgWidth > viewportWidth - 10) {
                left = viewportWidth - imgWidth - 10;
            }
            
            if (top < 10) {
                // If not enough space above, show below cursor
                top = mouseY + offsetY;
            }
            
            preview.style.left = left + 'px';
            preview.style.top = top + 'px';
        }
        
        // Add global mousemove listener
        document.addEventListener('mousemove', handleMouseMove);
        
        imageHoverTriggers.forEach(trigger => {
            const imageSrc = trigger.getAttribute('data-image');
            
            trigger.addEventListener('mouseenter', async function(e) {
                activeTrigger = trigger;
                currentImageSrc = imageSrc;
                isImageLoaded = false;
                
                // Update mouse position from the enter event
                if (e) {
                    updateMousePosition(e);
                }
                
                // Hide preview while loading
                preview.classList.remove('active');
                preview.innerHTML = '';
                
                try {
                    // Preload image before showing
                    const img = await preloadImage(imageSrc);
                    
                    // Check if still hovering over the same trigger
                    if (activeTrigger !== trigger || currentImageSrc !== imageSrc) {
                        return;
                    }
                    
                    // Create image element from preloaded image
                    const previewImg = document.createElement('img');
                    previewImg.src = img.src;
                    previewImg.alt = 'Preview';
                    
                    // Clear and add image
                    preview.innerHTML = '';
                    preview.appendChild(previewImg);
                    
                    // Wait for image to render to get dimensions
                    await new Promise(resolve => {
                        if (previewImg.complete) {
                            resolve();
                        } else {
                            previewImg.onload = resolve;
                        }
                    });
                    
                    // Check again if still active
                    if (activeTrigger !== trigger || currentImageSrc !== imageSrc) {
                        return;
                    }
                    
                    isImageLoaded = true;
                    
                    // Set initial position based on current mouse position
                    preview.style.position = 'fixed';
                    preview.style.zIndex = '10000';
                    
                    // Update position to follow cursor
                    updatePreviewPosition(currentMouseX, currentMouseY);
                    
                    // Show preview
                    preview.classList.add('active');
                } catch (error) {
                    console.error('Failed to load image:', imageSrc, error);
                    activeTrigger = null;
                    currentImageSrc = null;
                }
            });
            
            trigger.addEventListener('mouseleave', function() {
                if (activeTrigger === trigger) {
                    activeTrigger = null;
                    currentImageSrc = null;
                    isImageLoaded = false;
                    preview.classList.remove('active');
                }
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


