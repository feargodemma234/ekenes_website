// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://bextrzhnqzqsnrjuqplb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XEJYuY6BdMzjcM8Bq4jFAA_to92CRkY";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- APP CONFIGURATION ---
const ADMIN_WHATSAPP_NUMBER = "2348012345678"; // <-- CHANGE TO YOUR WHATSAPP NUMBER
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

    if (selectedReceiptFile && navigator.canShare && navigator.canShare({ files: [selectedReceiptFile] })) {
        try {
            await navigator.share({
                files: [selectedReceiptFile],
                title: 'Payment Receipt',
                text: message
            });
            return; 
        } catch (error) {
            if (error.name === 'AbortError') return; 
        }
    }

    const fallbackText = selectedReceiptFile ? `${message} (I am attaching my receipt now...)` : `${message} Here is my payment receipt:`;
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(fallbackText)}`, '_blank');

    if (selectedReceiptFile && (!navigator.canShare)) {
        alert("WhatsApp is opening. Please attach your saved receipt image manually in the chat.");
    }
}

// --- 4. SUPABASE CLOUD TRACKER LOGIC ---
const dailyAmount = 200;
const today = new Date();
const currentDay = today.getDay(); 
const distanceToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
const monday = new Date(today);
monday.setDate(today.getDate() + distanceToMonday);
monday.setHours(0,0,0,0);

const weekDays = [];
for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDays.push(day);
}

let trackerData = {}; // Will be loaded from Supabase
let deviceId = localStorage.getItem('empire_device_id');

// Generate a unique ID for this phone/browser if they don't have one
if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : 'dev-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('empire_device_id', deviceId);
}

// Function to load tracker data from Supabase on page load
async function loadTrackerFromSupabase() {
    try {
        const { data, error } = await supabase
            .from('trackers')
            .select('paid_days')
            .eq('device_id', deviceId)
            .maybeSingle();

        if (data && data.paid_days) {
            trackerData = data.paid_days;
        }
    } catch (error) {
        console.error("Error loading tracker:", error);
    }
    renderAdvancedTracker(); // Render the UI after loading
}

// Function to save tracker data to Supabase when they click a day
async function saveTrackerToSupabase() {
    try {
        await supabase
            .from('trackers')
            .upsert({ 
                device_id: deviceId, 
                paid_days: trackerData,
                updated_at: new Date()
            });
    } catch (error) {
        console.error("Error saving tracker:", error);
    }
}

function renderAdvancedTracker() {
    const calendarRow = document.getElementById('calendar-row');
    if(!calendarRow) return; 
    
    calendarRow.innerHTML = '';
    let paidCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    weekDays.forEach((dateObj, index) => {
        const dateStr = dateObj.toISOString().split('T')[0];
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
        const dayNum = dateObj.getDate();
        const isPaid = trackerData[dateStr] === true;
        const isFuture = dateStr > todayStr;
        const isToday = dateStr === todayStr;

        if (isPaid) paidCount++;

        const dayEl = document.createElement('div');
        dayEl.className = `cal-day ${isPaid ? 'paid' : ''} ${isFuture ? 'disabled' : ''}`;
        
        if (isToday && !isPaid) {
            dayEl.style.borderColor = "var(--accent-purple)";
            dayEl.style.boxShadow = "0 0 10px rgba(168, 85, 247, 0.3)";
        }

        dayEl.innerHTML = `
            <span class="cal-day-name">${dayName}</span>
            <span class="cal-day-num">${dayNum}</span>
        `;

        dayEl.onclick = () => {
            if (isFuture) return; 
            // Toggle status
            trackerData[dateStr] = !trackerData[dateStr];
            
            // Save to cloud & update UI instantly
            saveTrackerToSupabase(); 
            renderAdvancedTracker();
        };

        calendarRow.appendChild(dayEl);
    });

    // Update Stats
    const savedTotal = paidCount * dailyAmount;
    document.getElementById('saved-amount').innerText = `₦${savedTotal.toLocaleString()}`;
    document.getElementById('days-paid-count').innerText = `${paidCount} / 7`;

    // Update Circular Ring
    const percentage = Math.round((paidCount / 7) * 100);
    document.getElementById('progress-percent').innerText = `${percentage}%`;
    
    const circle = document.getElementById('progress-ring');
    if(circle) {
        const offset = 251.2 - (percentage / 100) * 251.2;
        circle.style.strokeDashoffset = offset;
        circle.setAttribute('stroke', percentage === 100 ? '#a855f7' : 'var(--whatsapp-green)');
    }
}

async function resetWeek() {
    if(confirm("Are you sure you want to reset your tracker for this week? This cannot be undone.")) {
        trackerData = {};
        await saveTrackerToSupabase(); // Clear in Supabase
        renderAdvancedTracker();
    }
}

// --- 5. Accordion Logic ---
function toggleAccordion(button) {
    button.classList.toggle("active");
    const content = button.nextElementSibling;
    content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
}

// --- 6. Contact Admin ---
function contactAdmin() {
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Admin, I need help with my contribution.")}`, '_blank');
}

// Initialize App
loadTrackerFromSupabase(); // Load from cloud instead of local storage