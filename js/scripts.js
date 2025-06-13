// Google Sheet Integration
const scriptURL = 'https://script.google.com/macros/s/AKfycbw6t5U5luYmyK0w1K5XbJlR3KiqBcDeW2nUy4rVwlSKa4h69UeAv97F3EWXjCfPy-IE/exec'; // Replace with your Google Apps Script Web App URL
const sheetId = '1PsDXFSbTCCXijgQgPGBltjDDnIitfnNXvmUmOCZo1po'; // Replace with your Google Sheet ID

function submitToGoogleSheet(e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = document.querySelector('#signatureForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

    // Get form data
    const form = document.getElementById('signatureForm');
    const formData = new FormData(form);
    const data = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        county: formData.get('county'),
        constituency: formData.get('constituency'),
        ward: formData.get('ward'),
        declaration: formData.get('declaration'),
        signature: formData.get('signature'),
        date: formData.get('date'),
        timestamp: new Date().toISOString()
    };

    // Send to Google Sheet via Web App
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            closeModal();
            document.getElementById('successMessage').classList.remove('hidden');
            // Reset form
            form.reset();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your signature. Please try again.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Signature';
    });
}

// Modal functions
function openModal(petitionId) {
    document.getElementById('petitionModal').classList.remove('hidden');
    // Set current date
    document.getElementById('date').valueAsDate = new Date();
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('petitionModal').classList.add('hidden');
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

function closeSuccessMessage() {
    document.getElementById('successMessage').classList.add('hidden');
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById('petitionModal')) {
        closeModal();
    }
    if (event.target == document.getElementById('successMessage')) {
        closeSuccessMessage();
    }
}

// Initialize any required functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Any initialization code can go here
});