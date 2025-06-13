
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

    // Combined submission function with field name mapping
    async function submitToGoogleSheet(e) {
        e.preventDefault();
        e.stopPropagation();

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

        try {
            // Map visible fields to hidden original names
            document.getElementById('name').value = document.getElementById('fullName').value;
            document.getElementById('created_at_hidden').value = new Date().toISOString();

            // Create a new form with only the original field names
            const originalForm = document.createElement('form');
            originalForm.style.display = 'none';
            originalForm.method = 'POST';
            originalForm.action = 'https://script.google.com/macros/s/AKfycbwExsTWLhfeCs6MMiUfqAHEbwjtcC1fkehAql-ZDecSq40VEov1GjaH03250zQafBoR8A/exec';
            
            // Add all hidden fields
            const hiddenFields = ['form-name', 'type', 'created_at', 'name'];
            hiddenFields.forEach(field => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = field;
                input.value = document.querySelector(`[name="${field}"]`).value;
                originalForm.appendChild(input);
            });
            
            // Add other fields that don't need renaming
            const directFields = ['phone', 'county', 'constituency', 'ward', 'declaration', 'signature', 'date', 'consent'];
            directFields.forEach(field => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = field;
                input.value = document.querySelector(`[name="${field}"]`).value;
                originalForm.appendChild(input);
            });
            
            document.body.appendChild(originalForm);
            
            // Submit and handle response
            const response = await fetch(originalForm.action, {
                method: 'POST',
                body: new FormData(originalForm),
                headers: { 'Accept': 'application/json' }
            });

            // Success handling with your popups
            closeModal();
            successMessage.classList.remove('hidden');
            setTimeout(() => closeSuccessMessage(), 3000);

            // Clean up
            originalForm.remove();

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
