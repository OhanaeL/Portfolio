function applyTagFilter(selectedTag, projectCards, tagButtons, mobileDropdown) {
    if (tagButtons) {
        tagButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = Array.from(tagButtons).find(btn => btn.dataset.tag === selectedTag);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    if (mobileDropdown) {
        mobileDropdown.value = selectedTag;
    }
    
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.value = '';
        const clearBtn = document.getElementById('search-clear');
        if (clearBtn) clearBtn.style.display = 'none';
    }
    
    const visibleCards = [];
    
    projectCards.forEach((card) => {
        let shouldBeVisible = false;
        
        if (selectedTag === 'all') {
            shouldBeVisible = true;
            card.classList.remove('hidden');
        } else {
            const cardTags = card.dataset.tags ? card.dataset.tags.split(',').map(t => t.trim()) : [];
            if (cardTags.includes(selectedTag)) {
                shouldBeVisible = true;
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
        
        if (shouldBeVisible) {
            card.classList.remove('reveal');
            visibleCards.push(card);
        }
    });
    
    visibleCards.forEach((card, visibleIndex) => {
        setTimeout(() => {
            card.classList.add('reveal');
        }, visibleIndex * 200);
    });
}

export function setupTagFilters() {
    const tagsContainer = document.getElementById('tags-filter');
    const loadingElement = document.getElementById('tags-filter-loading');
    const mobileContainer = document.getElementById('tags-filter-mobile');
    const mobileLoadingElement = document.getElementById('tags-filter-mobile-loading');
    const mobileDropdown = document.getElementById('tags-filter-dropdown');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectCards.length === 0) {
        if (loadingElement) loadingElement.style.display = 'none';
        if (mobileLoadingElement) mobileLoadingElement.style.display = 'none';
        return;
    }
    
    const allTags = new Set();
    projectCards.forEach(card => {
        const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
        cardTags.forEach(tag => {
            if (tag.trim()) {
                allTags.add(tag.trim());
            }
        });
    });
    
    if (loadingElement) loadingElement.style.display = 'none';
    if (mobileLoadingElement) mobileLoadingElement.style.display = 'none';
    
    const sortedTags = Array.from(allTags).sort();
    
    if (tagsContainer) {
        const allButton = document.createElement('button');
        allButton.className = 'tag-filter-btn active';
        allButton.dataset.tag = 'all';
        allButton.innerHTML = '<i class="fas fa-th"></i> All';
        tagsContainer.appendChild(allButton);
        
        sortedTags.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'tag-filter-btn';
            button.dataset.tag = tag;
            button.textContent = tag;
            tagsContainer.appendChild(button);
        });
    }
    
    if (mobileDropdown) {
        mobileDropdown.style.display = 'block';
        
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Projects';
        allOption.selected = true;
        mobileDropdown.appendChild(allOption);
        
        sortedTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            mobileDropdown.appendChild(option);
        });
    }
    
    const tagButtons = tagsContainer ? tagsContainer.querySelectorAll('.tag-filter-btn') : [];
    
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            applyTagFilter(button.dataset.tag, projectCards, tagButtons, mobileDropdown);
        });
    });
    
    if (mobileDropdown) {
        mobileDropdown.addEventListener('change', (e) => {
            applyTagFilter(e.target.value, projectCards, tagButtons, mobileDropdown);
        });
    }
}

// Search functionality
export function setupProjectSearch() {
    const searchInput = document.getElementById('project-search');
    const searchClear = document.getElementById('search-clear');
    const projectCards = document.querySelectorAll('.project-card');
    const tagButtons = document.querySelectorAll('.tag-filter-btn');
    const mobileDropdown = document.getElementById('tags-filter-dropdown');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Show/hide clear button
        searchClear.style.display = searchTerm ? 'block' : 'none';
        
        // Reset tag filter when searching
        if (searchTerm) {
            tagButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tag === 'all') {
                    btn.classList.add('active');
                }
            });
            if (mobileDropdown) {
                mobileDropdown.value = 'all';
            }
        }
        
        projectCards.forEach((card) => {
            const projectName = card.querySelector('h3').textContent.toLowerCase();
            const projectDesc = card.querySelector('.project-short-desc').textContent.toLowerCase();
            const projectTags = card.dataset.tags ? card.dataset.tags.toLowerCase() : '';
            
            const matches = projectName.includes(searchTerm) || 
                          projectDesc.includes(searchTerm) || 
                          projectTags.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
    
    // Clear search button
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        
        const visibleCards = [];
        projectCards.forEach((card) => {
            card.classList.remove('hidden');
            card.classList.remove('reveal');
            visibleCards.push(card);
        });
        
        visibleCards.forEach((card, visibleIndex) => {
            setTimeout(() => {
                card.classList.add('reveal');
            }, visibleIndex * 200);
        });
    });
}

