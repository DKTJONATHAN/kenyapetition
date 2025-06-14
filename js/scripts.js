document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase
    const supabase = supabase.createClient(
        'https://hedmvlpbeleqczwgcfqb.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZG12bHBiZWxlcWN6d2djZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTU1MzAsImV4cCI6MjA2NTQ5MTUzMH0.CxaX7l1nEYRunmNXigej36DxTIzgniqlvfCFRPEwf34'
    );

    // DOM elements
    const petitionModal = document.getElementById('petitionModal');
    const successMessage = document.getElementById('successMessage');
    const kenyanPetitionsForm = document.getElementById('KenyanPetitions');
    const dateField = document.getElementById('date');
    const modalTitle = petitionModal.querySelector('h3');

    // Petition data
    const petitions = {
        'petition1': {
            id: 'lagat-dismissal-2025',
            title: "Dismissal of DIG Eliud Lagat"
        }
        // Add more petitions as needed
    };

    // Modal buttons
    document.querySelectorAll('[data-petition-button], [onclick^="openModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const petitionId = this.dataset.petitionId || 
                             (this.getAttribute('onclick')?.match(/openModal\('(.+?)'\)/)?.[1]);
            openModal(petitionId);
        });
    });

    // Form submission
    if (kenyanPetitionsForm) {
        kenyanPetitionsForm.addEventListener('submit', submitToSupabase);
    }

    // Modal functions
    window.openModal = function(petitionId) {
        if (petitions[petitionId]) {
            modalTitle.textContent = `Sign Petition: ${petitions[petitionId].title}`;
            kenyanPetitionsForm.dataset.petitionId = petitionId;
            
            if (dateField) {
                dateField.valueAsDate = new Date();
            }
            petitionModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function() {
        petitionModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        if (kenyanPetitionsForm) kenyanPetitionsForm.reset();
    };

    window.closeSuccessMessage = function() {
        successMessage.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    // Form validation
    function validateForm(data) {
        const errors = [];
        
        // Name validation
        if (data.full_name.length < 3) {
            errors.push("Full name must be at least 3 characters");
        }
        
        // Phone validation
        if (!/^(?:254|\+254|0)?(7\d{8})$/.test(data.phone)) {
            errors.push("Please enter a valid Kenyan phone number");
        }
        
        // Signature validation
        if (data.signature !== data.full_name) {
            errors.push("Signature must match your full name");
        }
        
        return errors;
    }

    // Submission handler
    async function submitToSupabase(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

            // Get form data
            const petitionId = kenyanPetitionsForm.dataset.petitionId;
            const formData = {
                petition_id: petitionId,
                petition_title: petitions[petitionId].title,
                full_name: kenyanPetitionsForm.querySelector('[name="fullName"]').value.trim(),
                phone: kenyanPetitionsForm.querySelector('[name="phone"]').value.trim(),
                county: kenyanPetitionsForm.querySelector('[name="county"]').value,
                constituency: kenyanPetitionsForm.querySelector('[name="constituency"]').value.trim(),
                ward: kenyanPetitionsForm.querySelector('[name="ward"]').value.trim(),
                declaration: kenyanPetitionsForm.querySelector('[name="declaration"]').value.trim(),
                signature: kenyanPetitionsForm.querySelector('[name="signature"]').value.trim(),
                date: kenyanPetitionsForm.querySelector('[name="date"]').value,
                consent: kenyanPetitionsForm.querySelector('[name="consent"]').checked,
                ip_address: await getIPAddress()
            };

            // Validate
            const errors = validateForm(formData);
            if (errors.length > 0) throw new Error(errors.join("\n"));

            // Submit
            const { error } = await supabase
                .from('petition_signatures')
                .insert([formData]);

            if (error) throw error;

            // Success
            closeModal();
            successMessage.classList.remove('hidden');
            setTimeout(closeSuccessMessage, 5000);

        } catch (error) {
            console.error("Submission error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    // Get IP address (optional)
    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
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