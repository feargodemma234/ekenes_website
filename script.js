// REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SHEET_API_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

// Fallback data in case the API fails or isn't set up yet
let appSettings = {
    websiteName: "The Empire Zone",
    accountNumber: "935704",
    whatsappGroup: "https://chat.whatsapp.com/"
};

// 1. Fetch data from Google Sheets on load
async function fetchSettings() {
    try {
        // If you haven't set up the sheet yet, it will use the fallback data above
        if (GOOGLE_SHEET_API_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
            console.log("Using fallback data. Add your Apps Script URL to fetch from Google Sheets.");
        } else {
            const response = await fetch(GOOGLE_SHEET_API_URL);
            const data = await response.json();
            appSettings = data;
        }
        updateUI();
    } catch (error) {
        console.error("Error fetching settings:", error);
        updateUI(); // Load fallback data
    }
}

// 2. Update UI with dynamic data
function updateUI() {
    document.getElementById('site-name').innerText = appSettings.websiteName;
    document.getElementById('account-number').innerText = appSettings.accountNumber;
    document.getElementById('wa-group-link').href = appSettings.whatsappGroup;
}

// 3. Handle Login (Email + 4 Digit Number)
function handleLogin() {
    const email = document.getElementById('email').value;
    const pin = document.getElementById('pin').value;

    if (!email || pin.length !== 4 || isNaN(pin)) {
        alert("Please enter a valid email and exactly a 4-digit number PIN.");
        return;
    }

    // Here you would normally send this to a backend for authentication
    alert(`Login successful for ${email}`);
}

// 4. Send WhatsApp Payment Receipt
function sendWhatsAppReceipt() {
    const phoneNumber = "1234567890"; // REPLACE WITH YOUR BUSINESS WHATSAPP NUMBER
    const message = `Hello ${appSettings.websiteName}, I have just made a payment to account ${appSettings.accountNumber}. Here is my receipt:`;
    
    // Encode the message for the URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp Web/App
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// Initialize App
fetchSettings();