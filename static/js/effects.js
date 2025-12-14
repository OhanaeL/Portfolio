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

// Trigger shooting stars at random intervals
export function startShootingStars() {
    function scheduleNextStar() {
        // Random interval between 8-15 seconds
        const interval = 8000 + Math.random() * 7000;
        
        setTimeout(() => {
            createShootingStar();
            scheduleNextStar();
        }, interval);
    }
    
    // Start the first shooting star after a random delay
    setTimeout(() => {
        createShootingStar();
        scheduleNextStar();
    }, 3000 + Math.random() * 5000);
}

