// --- CONFIGURATION ---
const ADMIN_WHATSAPP_NUMBER = "2348028935404"; // <-- CHANGE TO YOUR WHATSAPP NUMBER
const ACCOUNT_NUMBER = "935704";
let selectedReceiptFile = null;

// --- 1. Copy Account Number ---
function copyAccountNumber() {
    const accountText = document.getElementById("account-number").innerText;
    navigator.clipboard.writeText(accountText).then(() => {
        const copyText = document.getElementById("copy-text");
        copyText.innerText = "Copied! ✓";
        copyText.style.color = "var(--whatsapp-green)";
        setTimeout(() => {
            copyText.innerText = "Tap to Copy";
            copyText.style.color = "var(--text-muted)";
        }, 2000);
    });
}

// --- 2. Image Upload & Preview ---
document.getElementById('receipt-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        selectedReceiptFile = file;
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('image-preview').src = event.target.result;
            document.getElementById('preview-container').style.display = 'block';
            document.getElementById('upload-label').innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Change Receipt Image
            `;
        };
        reader.readAsDataURL(file);
    }
});

function removeImage(event) {
    event.stopPropagation();
    selectedReceiptFile = null;
    document.getElementById('receipt-upload').value = '';
    document.getElementById('preview-container').style.display = 'none';
    document.getElementById('upload-label').innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        Attach Payment Receipt
    `;
}

// --- 3. Send WhatsApp Receipt ---
async function sendWhatsAppReceipt() {
    const message = `Hello Admin, I have just made my daily contribution of ₦200 to account ${ACCOUNT_NUMBER}.`;

    // If on mobile and an image is selected, use native share sheet to attach image + text
    if (selectedReceiptFile && navigator.canShare && navigator.canShare({ files: [selectedReceiptFile] })) {
        try {
            await navigator.share({
                files: [selectedReceiptFile],
                title: 'Payment Receipt',
                text: message
            });
            return; 
        } catch (error) {
            if (error.name === 'AbortError') return; // User cancelled
        }
    }

    // Fallback for Desktop or if native share fails
    const fallbackText = selectedReceiptFile ? `${message} (I am attaching my receipt now...)` : `${message} Here is my payment receipt:`;
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(fallbackText)}`, '_blank');

    if (selectedReceiptFile && (!navigator.canShare)) {
        alert("WhatsApp is opening. Please attach your saved receipt image manually in the chat.");
    }
}

// --- 4. Accordion Logic ---
function toggleAccordion(button) {
    button.classList.toggle("active");
    const content = button.nextElementSibling;
    content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
}

// --- 5. Contact Admin ---
function contactAdmin() {
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Admin, I need help with my contribution.")}`, '_blank');
}