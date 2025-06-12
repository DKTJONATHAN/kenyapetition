
// Modal functionality
function openModal(petitionId) {
    const modal = document.getElementById('petitionModal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('petitionModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
    document.getElementById('signatureForm').reset();
}

// Form submission
document.getElementById('signatureForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        county: document.getElementById('county').value,
        declaration: document.getElementById('declaration').value,
        signature: document.getElementById('signature').value,
        timestamp: new Date().toISOString()
    };

    // Placeholder for spreadsheet integration
    console.log('Signature data:', formData);
    alert('Signature submitted! (Spreadsheet integration pending.)');
    
    closeModal();
});
