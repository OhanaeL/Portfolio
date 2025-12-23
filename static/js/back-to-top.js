export function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    const scrollThreshold = 300;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    backToTopButton.addEventListener('click', scrollToTop);

    handleScroll();
}

