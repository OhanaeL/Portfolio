// Sparkles effect
export function createSparkles() {
    const container = document.querySelector('.sparkles-container');
    if (!container) return;
    
    const sparkleCount = 50;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = Math.random() > 0.7 ? 'sparkle purple' : 'sparkle';
        
        // Random position
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        
        // Random animation duration and delay
        sparkle.style.setProperty('--duration', (2 + Math.random() * 3) + 's');
        sparkle.style.setProperty('--delay', Math.random() * 5 + 's');
        
        container.appendChild(sparkle);
    }
}

// Create shooting star effect
function createShootingStar() {
    const container = document.querySelector('.sparkles-container');
    if (!container) return;
    
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    // Random starting position (from top-right area)
    const startX = 60 + Math.random() * 40; // 60-100% from left
    const startY = Math.random() * 30; // 0-30% from top
    
    star.style.left = startX + '%';
    star.style.top = startY + '%';
    
    // Random duration (2-4 seconds)
    const duration = 2 + Math.random() * 2;
    star.style.animation = `shootingStar ${duration}s ease-out forwards`;
    
    container.appendChild(star);
    
    // Remove the star after animation completes
    setTimeout(() => {
        star.remove();
    }, duration * 1000);
}

// Track shooting star timeouts for cleanup
let shootingStarTimeouts = [];

// Trigger shooting stars at random intervals
export function startShootingStars() {
    // Clear any existing shooting star timeouts
    stopShootingStars();
    
    function scheduleNextStar() {
        // Random interval between 8-15 seconds
        const interval = 8000 + Math.random() * 7000;
        
        const timeoutId = setTimeout(() => {
            createShootingStar();
            scheduleNextStar();
        }, interval);
        
        shootingStarTimeouts.push(timeoutId);
    }
    
    // Start the first shooting star after a random delay
    const initialTimeout = setTimeout(() => {
        createShootingStar();
        scheduleNextStar();
    }, 3000 + Math.random() * 5000);
    
    shootingStarTimeouts.push(initialTimeout);
}

// Stop shooting stars and clean up
export function stopShootingStars() {
    shootingStarTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    shootingStarTimeouts = [];
}

// Create constellation background with twinkling stars
export function createConstellation() {
    const container = document.querySelector('.sparkles-container');
    if (!container) return;
    
    const constellationContainer = document.createElement('div');
    constellationContainer.className = 'constellation-background';
    container.appendChild(constellationContainer);
    
    const starCount = 80;
    const stars = [];
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'constellation-star';
        
        const size = Math.random() * 2 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const brightness = Math.random() * 0.4 + 0.2;
        
        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.opacity = brightness;
        star.style.setProperty('--twinkle-delay', Math.random() * 3 + 's');
        star.style.setProperty('--twinkle-duration', (2 + Math.random() * 2) + 's');
        
        constellationContainer.appendChild(star);
        stars.push({ element: star, x, y });
    }
    
    // Create constellation lines (connect nearby stars)
    const maxDistance = 15;
    const lines = [];
    
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance && Math.random() > 0.7) {
                const line = document.createElement('div');
                line.className = 'constellation-line';
                
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                const length = distance;
                
                line.style.left = stars[i].x + '%';
                line.style.top = stars[i].y + '%';
                line.style.width = length + '%';
                line.style.transform = `rotate(${angle}deg)`;
                line.style.opacity = Math.random() * 0.15 + 0.05;
                
                constellationContainer.appendChild(line);
                lines.push(line);
            }
        }
    }
}

// Create light mode background elements (white circles)
export function createLightModeBackground() {
    const container = document.querySelector('.sparkles-container');
    if (!container) return;
    
    // Check if light mode background already exists
    const existingBg = container.querySelector('.light-mode-background');
    if (existingBg) {
        existingBg.remove();
    }
    
    const lightBgContainer = document.createElement('div');
    lightBgContainer.className = 'light-mode-background';
    container.appendChild(lightBgContainer);
    
    const shapeCount = 8;
    const minSize = 200;
    const maxSize = 350;
    const minGap = 50;
    const circles = [];
    const maxAttempts = 200;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    for (let i = 0; i < shapeCount; i++) {
        let attempts = 0;
        let validPosition = false;
        let x, y, size;
        
        while (!validPosition && attempts < maxAttempts) {
            size = Math.random() * (maxSize - minSize) + minSize;
            x = Math.random() * 100;
            y = Math.random() * 100;
            
            const radius = size / 2;
            const xPx = (x / 100) * viewportWidth;
            const yPx = (y / 100) * viewportHeight;
            
            validPosition = true;
            
            for (const circle of circles) {
                const circleXPx = (circle.x / 100) * viewportWidth;
                const circleYPx = (circle.y / 100) * viewportHeight;
                const circleRadius = circle.size / 2;
                
                const dx = xPx - circleXPx;
                const dy = yPx - circleYPx;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minRequiredDistance = radius + circleRadius + minGap;
                
                if (distance < minRequiredDistance) {
                    validPosition = false;
                    break;
                }
            }
            
            if (validPosition) {
                const edgeBuffer = radius;
                if (xPx - edgeBuffer < 0 || xPx + edgeBuffer > viewportWidth ||
                    yPx - edgeBuffer < 0 || yPx + edgeBuffer > viewportHeight) {
                    validPosition = false;
                }
            }
            
            attempts++;
        }
        
        if (validPosition) {
            const shape = document.createElement('div');
            shape.className = 'light-mode-shape';
            
            shape.style.width = size + 'px';
            shape.style.height = size + 'px';
            shape.style.left = x + '%';
            shape.style.top = y + '%';
            shape.style.transform = 'translate(-50%, -50%)';
            
            lightBgContainer.appendChild(shape);
            circles.push({ x, y, size });
        }
    }
}

