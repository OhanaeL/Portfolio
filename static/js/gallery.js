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
        let loadingPromise = null;
        
        // Update mouse position
        function updateMousePosition(e) {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
        }
        
        // Mouse move handler to follow cursor
        function handleMouseMove(e) {
            updateMousePosition(e);
            if (!activeTrigger) return;
            
            // Update position whether loading or loaded
            if (preview.classList.contains('active')) {
                updatePreviewPosition(currentMouseX, currentMouseY);
            }
        }
        
        // Update preview position based on mouse coordinates
        function updatePreviewPosition(mouseX, mouseY) {
            const offsetY = 20; // 20 pixels above cursor
            
            // Get dimensions from preview container itself (works for both loading and loaded states)
            const previewWidth = preview.offsetWidth || 200;
            const previewHeight = preview.offsetHeight || 200;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate position - center horizontally on cursor
            let left = mouseX - (previewWidth / 2);
            let top = mouseY - previewHeight - offsetY;
            
            // Keep preview within viewport bounds
            if (left < 10) {
                left = 10;
            } else if (left + previewWidth > viewportWidth - 10) {
                left = viewportWidth - previewWidth - 10;
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
                
                // Cancel any previous loading
                if (loadingPromise) {
                    loadingPromise = null;
                }
                
                // Update mouse position from the enter event
                if (e) {
                    updateMousePosition(e);
                }
                
                // Show loading state immediately
                preview.classList.remove('active', 'loading');
                preview.innerHTML = '';
                preview.classList.add('loading');
                
                // Set loading dimensions
                const loadingWidth = 200;
                const loadingHeight = 200;
                preview.style.width = loadingWidth + 'px';
                preview.style.height = loadingHeight + 'px';
                preview.style.minWidth = loadingWidth + 'px';
                preview.style.minHeight = loadingHeight + 'px';
                
                // Create loading spinner
                const loadingSpinner = document.createElement('div');
                loadingSpinner.className = 'image-loading-spinner';
                loadingSpinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                preview.appendChild(loadingSpinner);
                
                // Set initial position
                preview.style.position = 'fixed';
                preview.style.zIndex = '10000';
                updatePreviewPosition(currentMouseX, currentMouseY);
                preview.classList.add('active');
                
                // Create a promise for this specific load
                const loadId = Date.now();
                loadingPromise = loadId;
                
                try {
                    const img = await preloadImage(imageSrc);
                    
                    if (activeTrigger !== trigger || currentImageSrc !== imageSrc || loadingPromise !== loadId) {
                        return;
                    }
                    
                    const actualWidth = img.naturalWidth || img.width;
                    const actualHeight = img.naturalHeight || img.height;
                    
                    if (activeTrigger !== trigger || currentImageSrc !== imageSrc || loadingPromise !== loadId) {
                        return;
                    }
                    
                    const previewImg = document.createElement('img');
                    previewImg.src = imageSrc;
                    previewImg.alt = 'Preview';
                    previewImg.style.opacity = '0';
                    previewImg.style.transition = 'opacity 0.3s ease';
                    const maxWidth = window.innerWidth < 768 ? 300 : 400;
                    const maxHeight = window.innerWidth < 768 ? 250 : 350;
                    
                    let displayWidth = actualWidth;
                    let displayHeight = actualHeight;
                    const aspectRatio = actualWidth / actualHeight;
                    
                    if (displayWidth > maxWidth) {
                        displayWidth = maxWidth;
                        displayHeight = maxWidth / aspectRatio;
                    }
                    if (displayHeight > maxHeight) {
                        displayHeight = maxHeight;
                        displayWidth = maxHeight * aspectRatio;
                    }
                    
                    preview.innerHTML = '';
                    preview.classList.remove('loading');
                    preview.appendChild(previewImg);
                    
                    preview.style.width = displayWidth + 'px';
                    preview.style.height = displayHeight + 'px';
                    preview.style.minWidth = displayWidth + 'px';
                    preview.style.minHeight = displayHeight + 'px';
                    
                    if (activeTrigger !== trigger || currentImageSrc !== imageSrc || loadingPromise !== loadId) {
                        return;
                    }
                    
                    isImageLoaded = true;
                    
                    requestAnimationFrame(() => {
                        if (activeTrigger === trigger && currentImageSrc === imageSrc) {
                            previewImg.style.opacity = '1';
                        }
                    });
                
                    updatePreviewPosition(currentMouseX, currentMouseY);
                    loadingPromise = null;
                } catch (error) {
                    console.error('Failed to load image:', imageSrc, error);
                    if (activeTrigger === trigger && currentImageSrc === imageSrc) {
                        preview.classList.remove('active', 'loading');
                        activeTrigger = null;
                        currentImageSrc = null;
                    }
                    loadingPromise = null;
                }
            });
            
            trigger.addEventListener('mouseleave', function() {
                if (activeTrigger === trigger) {
                    activeTrigger = null;
                    currentImageSrc = null;
                    isImageLoaded = false;
                    loadingPromise = null;
                    preview.classList.remove('active', 'loading');
                    preview.innerHTML = '';
                }
            });
        });
    }
}

// Image preview modal functionality (click to view)
export function setupImagePreview() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) {
        return;
    }
    
    // Image cache for modal
    const modalImageCache = new Map();
    
    function preloadModalImage(src) {
        return new Promise((resolve, reject) => {
            if (modalImageCache.has(src)) {
                const cached = modalImageCache.get(src);
                if (cached.complete) {
                    resolve(cached);
                    return;
                }
            }
            
            const img = new Image();
            img.onload = () => {
                modalImageCache.set(src, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // Remove any existing modal first
    const existingModal = document.getElementById('image-preview-modal-portal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Collect all gallery images and their titles
    const galleryImages = [];
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const titleEl = item.querySelector('.gallery-title');
        if (img) {
            galleryImages.push({
                src: img.src,
                title: titleEl ? titleEl.textContent : ''
            });
        }
    });
    
    let currentImageIndex = -1;
    
    // Create modal portal directly in body
    const modal = document.createElement('div');
    modal.id = 'image-preview-modal-portal';
    modal.className = 'image-preview-modal';
    modal.innerHTML = `
        <button class="image-preview-close" aria-label="Close"><i class="fas fa-times"></i></button>
        <button class="image-preview-nav image-preview-prev" aria-label="Previous image" style="display: none;">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="image-preview-nav image-preview-next" aria-label="Next image" style="display: none;">
            <i class="fas fa-chevron-right"></i>
        </button>
        <div class="image-preview-content">
            <div class="image-preview-loading">
                <div class="image-loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>
            </div>
            <div class="image-preview-wrapper">
                <img src="" alt="" id="image-preview-img" style="display: none;">
            </div>
            <div class="image-preview-title" id="image-preview-title"></div>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(modal);
    
    const modalImg = document.getElementById('image-preview-img');
    const modalTitle = document.getElementById('image-preview-title');
    const modalLoading = modal.querySelector('.image-preview-loading');
    const closeBtn = modal.querySelector('.image-preview-close');
    const prevBtn = modal.querySelector('.image-preview-prev');
    const nextBtn = modal.querySelector('.image-preview-next');
    
    function updateNavigationButtons() {
        if (galleryImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        
        prevBtn.disabled = currentImageIndex === 0;
        nextBtn.disabled = currentImageIndex === galleryImages.length - 1;
    }
    
    async function openPreview(imgSrc, title) {
        // Find the index of the clicked image
        currentImageIndex = galleryImages.findIndex(img => img.src === imgSrc);
        if (currentImageIndex === -1) {
            currentImageIndex = 0;
        }
        
        await showImage(currentImageIndex);
    }
    
    async function showImage(index) {
        if (index < 0 || index >= galleryImages.length) return;
        
        currentImageIndex = index;
        const imageData = galleryImages[index];
        
        if (modalTitle) {
            modalTitle.textContent = imageData.title || '';
        }
        
        updateNavigationButtons();
        
        // Show loading state
        if (modalLoading) {
            modalLoading.style.display = 'flex';
        }
        if (modalImg) {
            modalImg.style.display = 'none';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        try {
            const img = await preloadModalImage(imageData.src);
            
            if (modalImg) {
                const currentSrc = modalImg.src || '';
                if (currentSrc !== imageData.src) {
                    modalImg.src = imageData.src;
                }
                modalImg.style.display = 'block';
            }
            
            if (modalLoading) {
                modalLoading.style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to load modal image:', imageData.src, error);
            if (modalLoading) {
                modalLoading.style.display = 'none';
            }
        }
    }
    
    function showNextImage() {
        if (currentImageIndex < galleryImages.length - 1) {
            showImage(currentImageIndex + 1);
        }
    }
    
    function showPrevImage() {
        if (currentImageIndex > 0) {
            showImage(currentImageIndex - 1);
        }
    }
    
    function closePreview(e) {
        if (e) {
            e.stopPropagation();
        }
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Add click handlers and loading states to gallery items
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const titleEl = item.querySelector('.gallery-title');
        
        if (img) {
            // Create loading overlay
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'gallery-item-loading';
            loadingOverlay.innerHTML = '<div class="image-loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
            item.appendChild(loadingOverlay);
            
            // Handle image load
            if (img.complete) {
                img.classList.add('loaded');
                loadingOverlay.remove();
            } else {
                img.addEventListener('load', function() {
                    img.classList.add('loaded');
                    loadingOverlay.remove();
                });
                
                img.addEventListener('error', function() {
                    loadingOverlay.remove();
                });
            }
            
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
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closePreview(e);
        });
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPrevImage();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextImage();
        });
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
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closePreview();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
}


