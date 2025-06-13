document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const petitionModal = document.getElementById('petitionModal');
    const successMessage = document.getElementById('successMessage');
    const kenyanPetitionsForm = document.getElementById('KenyanPetitions');
    const dateField = document.getElementById('date');

    // Initialize modal buttons
    document.querySelectorAll('[data-petition-button], [onclick^="openModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const petitionId = this.dataset.petitionId || 
                             (this.getAttribute('onclick') && this.getAttribute('onclick').match(/openModal\('(.+?)'\)/)?.[1]);
            openModal(petitionId);
        });
    });

    // Form submission handler - Using the working approach from your second script
    if (kenyanPetitionsForm) {
        kenyanPetitionsForm.addEventListener('submit', submitToGoogleSheet);
    }

    // Modal functions (unchanged)
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

    // Updated submission function using working approach
    async function submitToGoogleSheet(e) {
        e.preventDefault();
        e.stopPropagation();

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

        try {
            const formData = new FormData(kenyanPetitionsForm);
            
            // Add timestamp (like in your working script)
            formData.append('created_at', new Date().toISOString());

            // Use the same submission pattern as your working script
            const response = await fetch(kenyanPetitionsForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            // Success case - maintain your original popup behavior
            closeModal();
            successMessage.classList.remove('hidden');
            
            // Optional: Auto-close success message after delay (like in working script)
            setTimeout(() => closeSuccessMessage(), 3000);
            
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your signature. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    // Close modals when clicking outside (unchanged)
    window.addEventListener('click', function(event) {
        if (event.target === petitionModal) closeModal();
        if (event.target === successMessage) closeSuccessMessage();
    });
});