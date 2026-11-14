// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://bextrzhnqzqsnrjuqplb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XEJYuY6BdMzjcM8Bq4jFAA_to92CRkY";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
}

// --- 4. SIMPLIFIED BULLETPROOF TRACKER ---
const dailyAmount = 200;
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let trackerData = JSON.parse(localStorage.getItem('empireTrackerData')) || {};
let deviceId = localStorage.getItem('empire_device_id') || 'dev-' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('empire_device_id', deviceId);

// Instantly draw the days on the screen
function renderTracker() {
    const calendarRow = document.getElementById('calendar-row');
    if(!calendarRow) return; 
    
    calendarRow.innerHTML = '';
    let paidCount = 0;

    daysOfWeek.forEach((day, index) => {
        const isPaid = trackerData[day] === true;
        if (isPaid) paidCount++;

        const dayEl = document.createElement('div');
        dayEl.className = `cal-day ${isPaid ? 'paid' : ''}`;
        
        dayEl.innerHTML = `
            <span class="cal-day-name">${day.charAt(0)}</span>
            <span class="cal-day-num">${index + 1}</span>
        `;

        dayEl.onclick = () => {
            trackerData[day] = !trackerData[day];
            localStorage.setItem('empireTrackerData', JSON.stringify(trackerData));
            renderTracker(); 
            syncToCloud(); // Silently save to Supabase
        };

        calendarRow.appendChild(dayEl);
    });

    // Update Stats
    document.getElementById('saved-amount').innerText = `₦${(paidCount * dailyAmount).toLocaleString()}`;
    document.getElementById('days-paid-count').innerText = `${paidCount} / 7`;

    // Update Ring
    const percentage = Math.round((paidCount / 7) * 100);
    document.getElementById('progress-percent').innerText = `${percentage}%`;
    const circle = document.getElementById('progress-ring');
    if(circle) {
        circle.style.strokeDashoffset = 251.2 - (percentage / 100) * 251.2;
        circle.setAttribute('stroke', percentage === 100 ? '#a855f7' : 'var(--whatsapp-green)');
    }
}

// Cloud Sync Functions
async function syncToCloud() {
    try {
        await supabase.from('trackers').upsert({ device_id: deviceId, paid_days: trackerData, updated_at: new Date() });
    } catch (e) { console.log("Cloud save failed, saved locally."); }
}

async function loadFromCloud() {
    try {
        const { data } = await supabase.from('trackers').select('paid_days').eq('device_id', deviceId).maybeSingle();
        if (data && data.paid_days && Object.keys(data.paid_days).length > 0) {
            trackerData = data.paid_days;
            localStorage.setItem('empireTrackerData', JSON.stringify(trackerData));
            renderTracker();
        }
    } catch (e) { console.log("Cloud load failed, using local."); }
}

function resetWeek() {
    if(confirm("Reset your tracker for this week?")) {
        trackerData = {};
        localStorage.setItem('empireTrackerData', JSON.stringify(trackerData));
        renderTracker();
        syncToCloud();
    }
}

// --- 5. Accordion Logic ---
function toggleAccordion(button) {
    button.classList.toggle("active");
    const content = button.nextElementSibling;
    content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
}

function contactAdmin() {
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Admin, I need help.")}`, '_blank');
}

// START THE APP
renderTracker(); // Draw immediately!
loadFromCloud(); // Then check for cloud updates