// Tag filtering functionality
export function setupTagFilters() {
    const tagsContainer = document.getElementById('tags-filter');
    const loadingElement = document.getElementById('tags-filter-loading');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!tagsContainer || projectCards.length === 0) {
        // Hide loading if no projects
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        return;
    }
    
    // Collect all unique tags from project cards
    const allTags = new Set();
    projectCards.forEach(card => {
        const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
        cardTags.forEach(tag => {
            if (tag.trim()) {
                allTags.add(tag.trim());
            }
        });
    });
    
    // Hide loading state
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // Create "All" button
    const allButton = document.createElement('button');
    allButton.className = 'tag-filter-btn active';
    allButton.dataset.tag = 'all';
    allButton.innerHTML = '<i class="fas fa-th"></i> All';
    tagsContainer.appendChild(allButton);
    
    // Create tag buttons
    Array.from(allTags).sort().forEach(tag => {
        const button = document.createElement('button');
        button.className = 'tag-filter-btn';
        button.dataset.tag = tag;
        button.textContent = tag;
        tagsContainer.appendChild(button);
    });
    
    // Add event listeners to all tag buttons
    const tagButtons = tagsContainer.querySelectorAll('.tag-filter-btn');
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tagButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const selectedTag = button.dataset.tag;
            
            // Clear search when switching tags
            const searchInput = document.getElementById('project-search');
            if (searchInput) {
                searchInput.value = '';
                const clearBtn = document.getElementById('search-clear');
                if (clearBtn) clearBtn.style.display = 'none';
            }
            
            projectCards.forEach(card => {
                if (selectedTag === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const cardTags = card.dataset.tags ? card.dataset.tags.split(',').map(t => t.trim()) : [];
                    if (cardTags.includes(selectedTag)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Search functionality
export function setupProjectSearch() {
    const searchInput = document.getElementById('project-search');
    const searchClear = document.getElementById('search-clear');
    const projectCards = document.querySelectorAll('.project-card');
    const tagButtons = document.querySelectorAll('.tag-filter-btn');
    
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
        }
        
        // Filter projects
        projectCards.forEach(card => {
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
        projectCards.forEach(card => card.classList.remove('hidden'));
    });
}

