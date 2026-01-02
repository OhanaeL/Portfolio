export function setupImageHover() {
    const imageHoverTriggers = document.querySelectorAll('.image-hover-trigger');
    if (imageHoverTriggers.length > 0) {
        let portal = document.getElementById('image-preview-portal');
        if (!portal) {
            portal = document.createElement('div');
            portal.id = 'image-preview-portal';
            portal.style.cssText = 'position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 99999; pointer-events: none;';
            document.body.appendChild(portal);
        }
        
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        portal.appendChild(preview);
        
        const imageCache = new Map();
        
        function preloadImage(src) {
            return new Promise((resolve, reject) => {
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
        
        let activeTrigger = null;
        let currentImageSrc = null;
        let isImageLoaded = false;
        let currentMouseX = 0;
        let currentMouseY = 0;
        let loadingPromise = null;
        
        function updateMousePosition(e) {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
        }
        
        function handleMouseMove(e) {
            updateMousePosition(e);
            if (!activeTrigger) return;
            
            if (preview.classList.contains('active')) {
                updatePreviewPosition(currentMouseX, currentMouseY);
            }
        }
        
        function updatePreviewPosition(mouseX, mouseY) {
            const offsetY = 20;
            
            const previewWidth = preview.offsetWidth || 200;
            const previewHeight = preview.offsetHeight || 200;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let left = mouseX - (previewWidth / 2);
            let top = mouseY - previewHeight - offsetY;
            
            if (left < 10) {
                left = 10;
            } else if (left + previewWidth > viewportWidth - 10) {
                left = viewportWidth - previewWidth - 10;
            }
            
            if (top < 10) {
                top = mouseY + offsetY;
            }
            
            preview.style.left = left + 'px';
            preview.style.top = top + 'px';
        }
        
        document.addEventListener('mousemove', handleMouseMove);
        
        imageHoverTriggers.forEach(trigger => {
            const imageSrc = trigger.getAttribute('data-image');
            
            trigger.addEventListener('mouseenter', async function(e) {
                activeTrigger = trigger;
                currentImageSrc = imageSrc;
                isImageLoaded = false;
                
                if (loadingPromise) {
                    loadingPromise = null;
                }
                
                if (e) {
                    updateMousePosition(e);
                }
                
                preview.classList.remove('active', 'loading');
                preview.innerHTML = '';
                preview.classList.add('loading');
                
                const loadingWidth = 200;
                const loadingHeight = 200;
                preview.style.width = loadingWidth + 'px';
                preview.style.height = loadingHeight + 'px';
                preview.style.minWidth = loadingWidth + 'px';
                preview.style.minHeight = loadingHeight + 'px';
                
                const loadingSpinner = document.createElement('div');
                loadingSpinner.className = 'image-loading-spinner';
                loadingSpinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                preview.appendChild(loadingSpinner);
                
                preview.style.position = 'fixed';
                preview.style.zIndex = '10000';
                updatePreviewPosition(currentMouseX, currentMouseY);
                preview.classList.add('active');
                
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

export function setupImagePreview() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) {
        return;
    }
    
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
    
    const existingModal = document.getElementById('image-preview-modal-portal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const galleryItemsArray = [];
    galleryItems.forEach(item => {
        const type = item.getAttribute('data-type') || 'image';
        const titleEl = item.querySelector('.gallery-title');
        const title = titleEl ? titleEl.textContent : '';
        
        if (type === 'image') {
            const img = item.querySelector('img');
            if (img) {
                galleryItemsArray.push({
                    type: 'image',
                    src: img.src,
                    title: title,
                    element: item
                });
            }
        } else if (type === 'video') {
            const videoType = item.getAttribute('data-video-type');
            if (videoType === 'youtube') {
                const videoId = item.getAttribute('data-video-id');
                galleryItemsArray.push({
                    type: 'video',
                    videoType: 'youtube',
                    videoId: videoId,
                    title: title,
                    element: item
                });
            } else if (videoType === 'local') {
                const videoSrc = item.getAttribute('data-video-src');
                galleryItemsArray.push({
                    type: 'video',
                    videoType: 'local',
                    src: videoSrc,
                    title: title,
                    element: item
                });
            }
        }
    });
    
    let currentImageIndex = -1;
    
    const modal = document.createElement('div');
    modal.id = 'image-preview-modal-portal';
    modal.className = 'image-preview-modal';
    modal.innerHTML = `
        <button class="image-preview-close" aria-label="Close"><i class="fas fa-times"></i></button>
        <button class="image-preview-nav image-preview-prev" aria-label="Previous" style="display: none;">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="image-preview-nav image-preview-next" aria-label="Next" style="display: none;">
            <i class="fas fa-chevron-right"></i>
        </button>
        <div class="image-preview-content">
            <div class="image-preview-loading">
                <div class="image-loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>
            </div>
            <div class="image-preview-wrapper">
                <img src="" alt="" id="image-preview-img" style="display: none;">
                <div id="image-preview-video" style="display: none;"></div>
            </div>
            <div class="image-preview-title" id="image-preview-title"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const modalImg = document.getElementById('image-preview-img');
    const modalVideo = document.getElementById('image-preview-video');
    const modalTitle = document.getElementById('image-preview-title');
    const modalLoading = modal.querySelector('.image-preview-loading');
    const closeBtn = modal.querySelector('.image-preview-close');
    const prevBtn = modal.querySelector('.image-preview-prev');
    const nextBtn = modal.querySelector('.image-preview-next');
    
    function updateNavigationButtons() {
        if (galleryItemsArray.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        
        prevBtn.disabled = currentImageIndex === 0;
        nextBtn.disabled = currentImageIndex === galleryItemsArray.length - 1;
    }
    
    async function openPreview(index) {
        if (index < 0 || index >= galleryItemsArray.length) {
            index = 0;
        }
        await showItem(index);
    }
    
    async function showItem(index) {
        if (index < 0 || index >= galleryItemsArray.length) return;
        
        currentImageIndex = index;
        const itemData = galleryItemsArray[index];
        
        if (modalTitle) {
            modalTitle.textContent = itemData.title || '';
        }
        
        updateNavigationButtons();
        
        if (modalLoading) {
            modalLoading.style.display = 'flex';
        }
        if (modalImg) {
            modalImg.style.display = 'none';
        }
        if (modalVideo) {
            modalVideo.style.display = 'none';
            modalVideo.innerHTML = '';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (itemData.type === 'image') {
            try {
                const img = await preloadModalImage(itemData.src);
                
                if (modalImg) {
                    const currentSrc = modalImg.src || '';
                    if (currentSrc !== itemData.src) {
                        modalImg.src = itemData.src;
                    }
                    modalImg.style.display = 'block';
                }
                
                if (modalLoading) {
                    modalLoading.style.display = 'none';
                }
            } catch (error) {
                console.error('Failed to load modal image:', itemData.src, error);
                if (modalLoading) {
                    modalLoading.style.display = 'none';
                }
            }
        } else if (itemData.type === 'video') {
            if (modalLoading) {
                modalLoading.style.display = 'none';
            }
            
            if (itemData.videoType === 'youtube') {
                modalVideo.innerHTML = `
                    <iframe 
                        src="https://www.youtube.com/embed/${itemData.videoId}" 
                        title="${itemData.title}"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        style="width: 100%; max-width: 900px; aspect-ratio: 16/9;">
                    </iframe>
                `;
            } else if (itemData.videoType === 'local') {
                modalVideo.innerHTML = `
                    <video controls style="width: 100%; max-width: 900px;">
                        <source src="${itemData.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
            }
            modalVideo.style.display = 'block';
        }
    }
    
    function showNextItem() {
        if (currentImageIndex < galleryItemsArray.length - 1) {
            showItem(currentImageIndex + 1);
        }
    }
    
    function showPrevItem() {
        if (currentImageIndex > 0) {
            showItem(currentImageIndex - 1);
        }
    }
    
    function closePreview(e) {
        if (e) {
            e.stopPropagation();
        }
        if (modalVideo) {
            modalVideo.innerHTML = '';
        }
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    galleryItems.forEach((item, index) => {
        const type = item.getAttribute('data-type') || 'image';
        
        if (type === 'image') {
            const img = item.querySelector('img');
            if (img) {
                const loadingOverlay = document.createElement('div');
                loadingOverlay.className = 'gallery-item-loading';
                loadingOverlay.innerHTML = '<div class="image-loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
                item.appendChild(loadingOverlay);
                
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
                    openPreview(index);
                });
            }
        } else if (type === 'video') {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openPreview(index);
            });
        }
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closePreview(e);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPrevItem();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextItem();
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal || (e.target.classList.contains('image-preview-modal') && !e.target.closest('.image-preview-content'))) {
            closePreview(e);
        }
    });
    
    const content = modal.querySelector('.image-preview-content');
    if (content) {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closePreview();
        } else if (e.key === 'ArrowLeft') {
            showPrevItem();
        } else if (e.key === 'ArrowRight') {
            showNextItem();
        }
    });
    
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isPointerDown = false;
    
    const handlePointerDown = (e) => {
        if (!modal.classList.contains('active')) return;
        isPointerDown = true;
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
    };
    
    const handlePointerMove = (e) => {
        if (!isPointerDown || !modal.classList.contains('active')) return;
    };
    
    const handlePointerUp = (e) => {
        if (!isPointerDown || !modal.classList.contains('active')) {
            isPointerDown = false;
            return;
        }
        
        const deltaX = e.clientX - pointerStartX;
        const deltaY = e.clientY - pointerStartY;
        
        const minSwipeDistance = 50;
        const maxVerticalSwipe = 100;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaY) < maxVerticalSwipe) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    showPrevItem();
                } else {
                    showNextItem();
                }
            }
        }
        
        isPointerDown = false;
    };
    
    modal.addEventListener('pointerdown', handlePointerDown, { passive: true });
    modal.addEventListener('pointermove', handlePointerMove, { passive: true });
    modal.addEventListener('pointerup', handlePointerUp, { passive: true });
    modal.addEventListener('pointercancel', handlePointerUp, { passive: true });
}


