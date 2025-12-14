// Contact form functionality
export function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formStatus = document.getElementById('form-status');
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                formStatus.className = 'form-status success';
                formStatus.textContent = result.message;
                contactForm.reset();
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = result.message;
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'An error occurred. Please try again or email directly.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            formStatus.style.display = 'block';
        }
    });
}

