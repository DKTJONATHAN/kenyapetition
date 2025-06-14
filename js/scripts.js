document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase 
    const supabaseUrl = 'https://hedmvlpbeleqczwgcfqb.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZG12bHBiZWxlcWN6d2djZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTU1MzAsImV4cCI6MjA2NTQ5MTUzMH0.CxaX7l1nEYRunmNXigej36DxTIzgniqlvfCFRPEwf34';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // DOM Elements
    const petitionModal = document.getElementById('petitionModal');
    const successMessage = document.getElementById('successMessage');
    const kenyanPetitionsForm = document.getElementById('KenyanPetitions');
    const dateField = document.getElementById('date');
    const modalTitle = petitionModal?.querySelector('h3');

    // Petition Data
    const petitions = {
        'petition1': {
            id: 'lagat-dismissal-2025',
            title: "Dismissal of DIG Eliud Lagat"
        }
    };

    // Modal Handlers
    document.querySelectorAll('[data-petition-button], [onclick^="openModal"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const petitionId = this.dataset.petitionId || 
                             this.getAttribute('onclick')?.match(/openModal\('(.+?)'\)/)?.[1];
            if (petitionId) openModal(petitionId);
        });
    });

    // Form Submission
    kenyanPetitionsForm?.addEventListener('submit', handleFormSubmit);

    // Modal Functions
    window.openModal = function(petitionId) {
        if (!petitions[petitionId]) return;

        modalTitle.textContent = `Sign Petition: ${petitions[petitionId].title}`;
        kenyanPetitionsForm.dataset.petitionId = petitionId;

        if (dateField) dateField.valueAsDate = new Date();
        petitionModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        petitionModal?.classList.add('hidden');
        document.body.style.overflow = 'auto';
        kenyanPetitionsForm?.reset();
    };

    window.closeSuccessMessage = function() {
        successMessage?.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    // Main Submission Handler
    async function handleFormSubmit(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

            // Get form data
            const petitionId = kenyanPetitionsForm.dataset.petitionId;
            const formData = {
                petition_id: petitionId,
                petition_title: petitions[petitionId].title,
                full_name: getInputValue('fullName'),
                phone: getInputValue('phone'),
                county: getInputValue('county'),
                constituency: getInputValue('constituency'),
                ward: getInputValue('ward'),
                declaration: getInputValue('declaration'),
                signature: getInputValue('signature'),
                date: getInputValue('date'),
                consent: document.querySelector('[name="consent"]').checked,
                ip_address: await getIPAddress()
            };

            // Validate
            validateForm(formData);

            // Submit to Supabase
            const { error } = await supabase
                .from('petition_signatures')
                .insert([formData]);

            if (error) throw error;

            // Success
            showSuccess();

        } catch (error) {
            console.error("Submission error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    // Helper Functions
    function getInputValue(name) {
        return kenyanPetitionsForm.querySelector(`[name="${name}"]`).value.trim();
    }

    function validateForm(data) {
        const errors = [];

        if (!data.full_name || data.full_name.length < 3) {
            errors.push("Full name must be at least 3 characters");
        }

        if (!/^(?:254|\+254|0)?(7\d{8})$/.test(data.phone)) {
            errors.push("Invalid Kenyan phone number");
        }

        if (data.signature !== data.full_name) {
            errors.push("Signature must match full name");
        }

        if (errors.length > 0) throw new Error(errors.join("\n"));
    }

    function showSuccess() {
        closeModal();
        successMessage.classList.remove('hidden');
        setTimeout(closeSuccessMessage, 5000);
    }

    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            return (await response.json()).ip;
        } catch {
            return null;
        }
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === petitionModal) closeModal();
        if (event.target === successMessage) closeSuccessMessage();
    });
});