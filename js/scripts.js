// Main Application
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const petitionModal = document.getElementById('petitionModal');
    const successMessage = document.getElementById('successMessage');
    const kenyanPetitionsForm = document.getElementById('KenyanPetitions');
    const dateField = document.getElementById('date');

    // Google Sheet Integration - Updated with your credentials
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw6t5U51uYmyK0w1K5XbJ1R3K1qBcDeW2nUy4rVw1SKa4h69UeAv97F3EWXjCfPy-IE/exec';
    const sheetId = '1PsDXFSbTCCXijgQgPGBltjDDnIitfnNXvmUmOCZolpo';

    // Initialize modal buttons - both data attribute and onclick handlers
    document.querySelectorAll('[data-petition-button], [onclick^="openModal"]').forEach(button => {
        button.addEventListener('click', function() {
            // Handle both data attribute and onclick approaches
            const petitionId = this.dataset.petitionId || 
                             (this.getAttribute('onclick') && this.getAttribute('onclick').match(/openModal\('(.+?)'\)/)?.[1]);
            openModal(petitionId);
        });
    });

    // Form submission handler
    if (kenyanPetitionsForm) {
        kenyanPetitionsForm.addEventListener('submit', submitToGoogleSheet);
    }

    // Expose modal functions to global scope for onclick handlers
    window.openModal = function(petitionId) {
        // Set current date
        if (dateField) {
            dateField.valueAsDate = new Date();
        }

        // Show modal
        petitionModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // You can use petitionId to load specific petition data if needed
        console.log('Opening modal for petition:', petitionId);
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

    async function submitToGoogleSheet(e) {
        e.preventDefault();

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

        try {
            const formData = new FormData(kenyanPetitionsForm);
            const data = {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                county: formData.get('county'),
                constituency: formData.get('constituency'),
                ward: formData.get('ward'),
                declaration: formData.get('declaration'),
                signature: formData.get('signature'),
                date: formData.get('date'),
                timestamp: new Date().toISOString(),
                // Add sheetId to the data if your Google Script needs it
                sheetId: sheetId
            };

            // Add cache-buster to URL to prevent CORS issues
            const urlWithCacheBuster = `${scriptURL}?t=${Date.now()}`;

            const response = await fetch(urlWithCacheBuster, {
                method: 'POST',
                mode: 'no-cors', // Important for CORS handling
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // For no-cors mode, we can't read the response, so we assume success
            closeModal();
            successMessage.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your signature. Please try again.');
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