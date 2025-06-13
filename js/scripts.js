document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const petitionModal = document.getElementById('petitionModal');
    const successMessage = document.getElementById('successMessage');
    const kenyanPetitionsForm = document.getElementById('KenyanPetitions');
    const dateField = document.getElementById('date');

    // Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyyimGwhuvLPEX6kWjfkTMYJ2D-a5nHz6yJM73SyUMgfzN3OuRz242h-SxeSR0ZBWtuYA/exec';

    // Initialize modal buttons
    document.querySelectorAll('[data-petition-button], [onclick^="openModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const petitionId = this.dataset.petitionId || 
                             (this.getAttribute('onclick') && this.getAttribute('onclick').match(/openModal\('(.+?)'\)/)?.[1]);
            openModal(petitionId);
        });
    });

    // Form submission handler
    if (kenyanPetitionsForm) {
        kenyanPetitionsForm.addEventListener('submit', submitToGoogleSheet);
    }

    // Modal functions
    window.openModal = function(petitionId) {
        if (dateField) {
            dateField.valueAsDate = new Date();
        }
        petitionModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        petitionModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        if (kenyanPetitionsForm) {
            kenyanPetitionsForm.reset();
        }
    };

    window.closeSuccessMessage = function() {
        successMessage.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    // Updated submission function with Google Sheets integration
    async function submitToGoogleSheet(e) {
        e.preventDefault();
        e.stopPropagation();

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

        try {
            const formData = new FormData(kenyanPetitionsForm);
            
            // Add timestamp
            formData.append('timestamp', new Date().toISOString());

            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Show success popup
                closeModal();
                successMessage.classList.remove('hidden');
                
                // Auto-close success message after 5 seconds
                setTimeout(() => closeSuccessMessage(), 5000);
                
                // Reset form
                kenyanPetitionsForm.reset();
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your signature: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === petitionModal) closeModal();
        if (event.target === successMessage) closeSuccessMessage();
    });
});
