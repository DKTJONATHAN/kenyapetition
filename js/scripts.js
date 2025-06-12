<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Petitions - Kenya Petitions</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="icon" href="assets/logo.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
</head>
<body class="bg-pearl flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-charcoal text-white p-4">
        <div class="container mx-auto flex items-center">
            <img src="assets/logo.png" alt="Kenya Coat of Arms" class="h-8 mr-2">
            <h1 class="text-lg font-bold">Kenya Petitions</h1>
        </div>
    </header>

    <!-- Petitions Section -->
    <section id="petitions" class="container mx-auto p-4 flex-grow">
        <h2 class="text-2xl font-bold text-center text-charcoal mb-4">Active Petitions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Petition Card -->
            <div class="bg-offwhite p-4 rounded-lg shadow-md">
                <img src="assets/Eliud-Lagat.png" alt="Petition Image" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="text-xl font-bold text-charcoal mb-2">Dismissal of DIG Eliud Lagat</h3>
                <p class="text-slate mb-4">
                    We demand the dismissal of Deputy Inspector General Eliud Lagat for his alleged role in the unlawful killing of Albert Ojwang' by police, seeking justice and accountability.
                </p>
                <button onclick="openModal('petition1')" class="bg-emerald text-white py-2 px-4 rounded hover:bg-emerald-hover">
                    Sign Here
                </button>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <div id="petitionModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div class="bg-offwhite p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold text-charcoal mb-4">Sign Petition: Dismissal of DIG Eliud Lagat</h3>
            <form id="signatureForm" onsubmit="submitToGoogleForm(event)">
                <!-- Legal Notice -->
                <div class="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <p class="text-sm text-yellow-700">
                        <strong>Legal Notice:</strong> By signing this petition, you confirm you are a registered voter in Kenya. False information may lead to legal consequences under Kenyan law.
                    </p>
                </div>
                
                <div class="mb-4">
                    <label for="fullName" class="block text-slate">Full Name (as appears in ID)</label>
                    <input type="text" id="fullName" name="fullName" class="w-full px-3 py-2 border rounded" required>
                </div>
                
                <div class="mb-4">
                    <label for="idNumber" class="block text-slate">National ID/Passport Number</label>
                    <input type="text" id="idNumber" name="idNumber" class="w-full px-3 py-2 border rounded" required>
                    <p class="text-xs text-gray-500 mt-1">For verification purposes only. Will not be publicly displayed.</p>
                </div>
                
                <div class="mb-4">
                    <label for="email" class="block text-slate">Email Address</label>
                    <input type="email" id="email" name="email" class="w-full px-3 py-2 border rounded" required>
                </div>
                
                <div class="mb-4">
                    <label for="phone" class="block text-slate">Phone Number</label>
                    <input type="tel" id="phone" name="phone" class="w-full px-3 py-2 border rounded" required>
                </div>
                
                <div class="mb-4">
                    <label for="county" class="block text-slate">County of Registration (Voter)</label>
                    <select id="county" name="county" class="w-full px-3 py-2 border rounded" required>
                        <option value="">Select County</option>
                        <!-- [Counties omitted for brevity in this sample; assume unchanged list] -->
                        <option value="Nairobi">Nairobi</option>
                        <option value="Diaspora">Diaspora (Kenyan Citizens Abroad)</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label for="constituency" class="block text-slate">Constituency</label>
                    <input type="text" id="constituency" name="constituency" class="w-full px-3 py-2 border rounded" required>
                </div>
                
                <div class="mb-4">
                    <label for="ward" class="block text-slate">Ward</label>
                    <input type="text" id="ward" name="ward" class="w-full px-3 py-2 border rounded">
                </div>
                
                <div class="mb-4">
                    <label for="declaration" class="block text-slate">Declaration</label>
                    <textarea id="declaration" name="declaration" rows="4" placeholder="I support this petition because..." class="w-full px-3 py-2 border rounded" required></textarea>
                </div>
                
                <div class="mb-4">
                    <label for="signature" class="block text-slate">Signature (Full Name)</label>
                    <input type="text" id="signature" name="signature" class="w-full px-3 py-2 border rounded" required>
                </div>
                
                <div class="mb-4">
                    <label for="date" class="block text-slate">Date</label>
                    <input type="date" id="date" name="date" class="w-full px-3 py-2 border rounded" required>
                </div>
                
                <div class="mb-4 flex items-start">
                    <input type="checkbox" id="consent" name="consent" class="mt-1 mr-2" required>
                    <label for="consent" class="text-sm text-slate">
                        I confirm that the information provided is accurate and that I am a registered voter in Kenya. I understand that this information may be verified against official records.
                    </label>
                </div>
                
                <div class="flex justify-end">
                    <button type="button" onclick="closeModal()" class="mr-2 bg-gray-300 text-slate py-2 px-4 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                    <button type="submit" class="bg-emerald text-white py-2 px-4 rounded hover:bg-emerald-hover">
                        Submit Signature
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Success Message (hidden by default) -->
    <div id="successMessage" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-offwhite p-6 rounded-lg w-full max-w-md text-center">
            <i class="fas fa-check-circle text-5xl text-emerald mb-4"></i>
            <h3 class="text-xl font-bold text-charcoal mb-2">Thank You!</h3>
            <p class="text-slate mb-4">Your signature has been successfully recorded.</p>
            <button onclick="closeSuccessMessage()" class="bg-emerald text-white py-2 px-4 rounded hover:bg-emerald-hover">
                Close
            </button>
        </div>
    </div>

    <!-- Bottom Navigation Bar -->
    <nav class="bg-charcoal text-white p-4 fixed bottom-0 w-full z-10">
        <div class="container mx-auto flex justify-around items-center">
            <a href="index.html" class="flex flex-col items-center">
                <i class="fas fa-house text-2xl text-emerald"></i>
                <span class="text-sm">Home</span>
            </a>
            <a href="about.html" class="flex flex-col items-center">
                <i class="fas fa-info-circle text-2xl text-emerald"></i>
                <span class="text-sm">About</span>
            </a>
            <a href="petitions.html" class="flex flex-col items-center">
                <i class="fas fa-file-signature text-2xl text-emerald"></i>
                <span class="text-sm">Petitions</span>
            </a>
            <a href="privacy.html" class="flex flex-col items-center">
                <i class="fas fa-shield-alt text-2xl text-emerald"></i>
                <span class="text-sm">Privacy</span>
            </a>
        </div>
    </nav>

    <!-- Footer -->
    <footer class="bg-charcoal text-white text-center p-4 mt-4">
        <p>© 2025 Kenya Petitions. All rights reserved.</p>
        <p>Icons by <a href="https://fontawesome.com" class="underline text-emerald">Font Awesome</a>.</p>
    </footer>

    <script>
        // Google Sheet Integration
        const scriptURL = 'https://script.google.com/macros/s/AKfycbw6t5U5luYmyK0w1K5XbJlR3KiqBcDeW2nUy4rVwlSKa4h69UeAv97F3EWXjCfPy-IE/exec';
        const sheetId = '1PsDXFSbTCCXijgQgPGBltjDDnIitfnNXvmUmOCZo1po';

        function submitToGoogleSheet(e) {
            e.preventDefault();
            const submitBtn = document.querySelector('#signatureForm button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
            const form = document.getElementById('signatureForm');
            const formData = new FormData(form);
            const data = {
                fullName: formData.get('fullName'),
                idNumber: formData.get('idNumber'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                county: formData.get('county'),
                constituency: formData.get('constituency'),
                ward: formData.get('ward'),
                declaration: formData.get('declaration'),
                signature: formData.get('signature'),
                date: formData.get('date'),
                timestamp: new Date().toISOString()
            };

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    closeModal();
                    document.getElementById('successMessage').classList.remove('hidden');
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

        function openModal(petitionId) {
            document.getElementById('petitionModal').classList.remove('hidden');
            document.getElementById('date').valueAsDate = new Date();
        }

        function closeModal() {
            document.getElementById('petitionModal').classList.add('hidden');
        }

        function closeSuccessMessage() {
            document.getElementById('successMessage').classList.add('hidden');
        }
    </script>
</body>
</html>
