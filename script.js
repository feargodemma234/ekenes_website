// --- CONFIGURATION ---
// Replace this with your actual WhatsApp number (include country code, no + sign)
const ADMIN_WHATSAPP_NUMBER = "2348012345678"; 
const ACCOUNT_NUMBER = "935704";

// 1. Copy Account Number to Clipboard
function copyAccountNumber() {
    const accountText = document.getElementById("account-number").innerText;
    
    // Use the Clipboard API
    navigator.clipboard.writeText(accountText).then(() => {
        // Visual feedback
        const copyText = document.getElementById("copy-text");
        copyText.innerText = "Copied! ✓";
        copyText.style.color = "var(--whatsapp-green)";
        
        // Reset text after 2 seconds
        setTimeout(() => {
            copyText.innerText = "Tap to Copy";
            copyText.style.color = "var(--text-muted)";
        }, 2000);
    }).catch(err => {
        alert("Failed to copy. Please select and copy manually.");
    });
}

// 2. Send WhatsApp Payment Receipt
function sendWhatsAppReceipt() {
    // Message to send to the admin
    const message = `Hello Admin, I have just made my daily contribution to account ${ACCOUNT_NUMBER}. Here is my payment receipt:`;
    
    // Create the WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
}