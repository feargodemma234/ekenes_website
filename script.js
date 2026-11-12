// --- CONFIGURATION ---
// Replace this with your actual WhatsApp number (include country code, no + sign)
const ADMIN_WHATSAPP_NUMBER = "2348012345678"; 

// 1. Check if the user is already logged in (Session)
function checkSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginSection = document.getElementById('login-section');
    const protectedContent = document.getElementById('protected-content');

    if (isLoggedIn === 'true') {
        loginSection.style.display = 'none';
        protectedContent.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        protectedContent.style.display = 'none';
    }
}

// 2. Handle the Login
function handleLogin() {
    const email = document.getElementById('email').value;
    const pin = document.getElementById('pin').value;
    const errorMsg = document.getElementById('login-error');

    // Simple validation
    if (!email || !email.includes('@')) {
        errorMsg.innerText = "Please enter a valid email address.";
        return;
    }
    
    if (pin.length !== 4 || isNaN(pin)) {
        errorMsg.innerText = "Please enter exactly a 4-digit PIN.";
        return;
    }

    // Since it's a static site, any email + 4-digit pin works!
    // Save to browser local storage so they stay logged in
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
    errorMsg.innerText = "";
    checkSession(); // Load the next screen
}

// 3. Handle Logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    document.getElementById('email').value = '';
    document.getElementById('pin').value = '';
    
    checkSession(); 
}

// 4. Handle Forgot PIN (Static Site Workaround)
function handleForgotPin() {
    const confirmReset = confirm("Since this is a secure device login, forgetting your PIN just means resetting your local session. Click OK to clear your session and enter a new PIN.");
    
    if (confirmReset) {
        handleLogout();
        alert("Session cleared. You can now enter a new 4-digit PIN.");
    }
}

// 5. Send WhatsApp Payment Receipt
function sendWhatsAppReceipt() {
    const userEmail = localStorage.getItem('userEmail') || "a member";
    
    // Message to send to the admin
    const message = `Hello Admin, I am ${userEmail}. I have just made my daily contribution to account 935704. Here is my receipt:`;
    
    // Create the WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
}

// Initialize App when page loads
checkSession();