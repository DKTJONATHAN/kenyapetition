document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase 
    const supabaseUrl = 'https://hedmvlpbeleqczwgcfqb.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZG12bHBiZWxlcWN6d2djZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTU1MzAsImV4cCI6MjA2NTQ5MTUzMH0.CxaX7l1nEYRunmNXigej36DxTIzgniqlvfCFRPEwf34';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // Cache DOM elements
    const petitionModal = document.getElementById('petitionModal');
    const successMessage = document.getElementById('successMessage');
    const kenyanPetitionsForm = document.getElementById('KenyanPetitions');
    const dateField = document.getElementById('date');
    const modalTitle = petitionModal?.querySelector('h3');

    // Petition data
    const petitions = {
        'petition1': {
            id: 'lagat-dismissal-2025',
            title: "Dismissal of DIG Eliud Lagat"
        }
    };

    // Initialize modal buttons - enhanced with error handling
    document.querySelectorAll('[data-petition-button], [onclick^="openModal"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                const petitionId = this.dataset.petitionId || 
                                 (this.getAttribute('onclick')?.match(/openModal\('(.+?)'\)/)?.[1]);
                if (petitionId) openModal(petitionId);
            } catch (error) {
                console.error('Error opening modal:', error);
            }
        });
    });

    // Form submission handler - updated for Supabase
    if (kenyanPetitionsForm) {
        kenyanPetitionsForm.addEventListener('submit', submitToSupabase);
    }

    // Modal functions - made more robust
    window.openModal = function(petitionId) {
        if (!petitionModal || !petitions[petitionId]) return;
        
        try {
            // Update modal title if element exists
            if (modalTitle) {
                modalTitle.textContent = `Sign Petition: ${petitions[petitionId].title}`;
            }
            
            // Set current date if field exists
            if (dateField) {
                dateField.valueAsDate = new Date();
            }
            
            // Store petition ID in form
            if (kenyanPetitionsForm) {
                kenyanPetitionsForm.dataset.petitionId = petitionId;
            }
            
            // Show modal - using both class and style for maximum compatibility
            petitionModal.classList.remove('hidden');
            petitionModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Error in openModal:', error);
        }
    };

    window.closeModal = function() {
        if (!petitionModal) return;
        petitionModal.classList.add('hidden');
        petitionModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (kenyanPetitionsForm) {
            kenyanPetitionsForm.reset();
        }
    };

    window.closeSuccessMessage = function() {
        if (!successMessage) return;
        successMessage.classList.add('hidden');
        successMessage.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Updated submission function for Supabase
    async function submitToSupabase(e) {
        e.preventDefault();
        e.stopPropagation();

        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

        try {
            // Get form data
            const petitionId = kenyanPetitionsForm?.dataset.petitionId;
            const formData = {
                petition_id: petitionId,
                petition_title: petitions[petitionId]?.title || '',
                full_name: kenyanPetitionsForm.querySelector('[name="fullName"]')?.value.trim() || '',
                phone: kenyanPetitionsForm.querySelector('[name="phone"]')?.value.trim() || '',
                county: kenyanPetitionsForm.querySelector('[name="county"]')?.value || '',
                constituency: kenyanPetitionsForm.querySelector('[name="constituency"]')?.value.trim() || '',
                ward: kenyanPetitionsForm.querySelector('[name="ward"]')?.value.trim() || '',
                declaration: kenyanPetitionsForm.querySelector('[name="declaration"]')?.value.trim() || '',
                signature: kenyanPetitionsForm.querySelector('[name="signature"]')?.value.trim() || '',
                date: kenyanPetitionsForm.querySelector('[name="date"]')?.value || '',
                consent: kenyanPetitionsForm.querySelector('[name="consent"]')?.checked || false,
                timestamp: new Date().toISOString()
            };

            // Basic validation
            if (!formData.full_name || formData.full_name.length < 3) {
                throw new Error('Full name must be at least 3 characters');
            }
            if (!/^(?:254|\+254|0)?(7\d{8})$/.test(formData.phone)) {
                throw new Error('Please enter a valid Kenyan phone number');
            }

            // Submit to Supabase
            const { data, error } = await supabase
                .from('petition_signatures')
                .insert([formData]);

            if (error) throw error;

            // Show success
            closeModal();
            if (successMessage) {
                successMessage.classList.remove('hidden');
                successMessage.style.display = 'flex';
                setTimeout(() => closeSuccessMessage(), 5000);
            }
            
            // Reset form
            if (kenyanPetitionsForm) kenyanPetitionsForm.reset();

        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your signature: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    // Close modals when clicking outside - made more robust
    window.addEventListener('click', function(event) {
        try {
            if (event.target === petitionModal) closeModal();
            if (event.target === successMessage) closeSuccessMessage();
        } catch (error) {
            console.error('Error handling click:', error);
        }
    });

    // Add temporary debug function
    window.debugModal = function() {
        console.log('Modal element:', petitionModal);
        console.log('Form element:', kenyanPetitionsForm);
        console.log('Current petitions:', petitions);
        openModal('petition1');
    };
});