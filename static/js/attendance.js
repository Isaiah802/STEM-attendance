// Enhanced Attendance Page JavaScript
let todaySignins = [];
let adminMode = false;

// Admin credentials (same as admin-secure.js)
const ADMIN_CREDENTIALS = {
    'president': 'stem2026pres',
    'vicepresident': 'stem2026vp',
    'treasurer': 'stem2026treas',
    'secretary': 'stem2026sec',
    'admin': 'stem2026admin'
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.db) {
        loadTodayAttendance();
        loadRecentSignins();
    } else {
        console.warn('Firebase not configured. Using demo mode.');
        loadDemoData();
    }

    // Admin Mode Toggle Handler
    const adminModeToggle = document.getElementById('adminModeToggle');
    if (adminModeToggle) {
        adminModeToggle.addEventListener('click', toggleAdminMode);
    }

    // Exit Admin Mode Handler
    const exitAdminMode = document.getElementById('exitAdminMode');
    if (exitAdminMode) {
        exitAdminMode.addEventListener('click', deactivateAdminMode);
    }

    // Set max datetime to now (prevent future dates)
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
        const now = new Date();
        const maxDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateInput.max = maxDatetime;
    }
});

// Admin Mode Functions
function toggleAdminMode() {
    if (adminMode) {
        // Already in admin mode, do nothing
        return;
    }

    // Prompt for password
    const password = prompt('🔐 Enter Admin Password:\n\nUse one of the officer credentials to enable Admin Mode.');
    
    if (!password) return;

    // Check if password is valid
    let isValid = false;
    for (const [user, pass] of Object.entries(ADMIN_CREDENTIALS)) {
        if (password === pass) {
            isValid = true;
            console.log(`Admin mode activated by: ${user}`);
            break;
        }
    }

    if (isValid) {
        activateAdminMode();
    } else {
        alert('❌ Invalid password. Admin mode requires officer credentials.');
    }
}

function activateAdminMode() {
    adminMode = true;
    document.getElementById('adminModePanel').style.display = 'block';
    document.getElementById('adminFields').style.display = 'block';
    document.getElementById('adminModeToggle').style.display = 'none';
    
    // Set default datetime to now
    const dateInput = document.getElementById('attendanceDate');
    const now = new Date();
    const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    dateInput.value = localDatetime;
}

function deactivateAdminMode() {
    adminMode = false;
    document.getElementById('adminModePanel').style.display = 'none';
    document.getElementById('adminFields').style.display = 'none';
    document.getElementById('adminModeToggle').style.display = 'inline-block';
    
    // Clear admin fields
    document.getElementById('attendanceDate').value = '';
    document.getElementById('meetingType').selectedIndex = 0;
    document.getElementById('adminNotes').value = '';
}

// Attendance Form Handler
const form = document.getElementById('attendanceForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('studentName').value.trim();
        const id = document.getElementById('studentID').value.trim();
        const email = document.getElementById('studentEmail').value.trim();
        const yearLevel = document.getElementById('yearLevel').value;
        const consent = document.getElementById('privacyConsent').checked;

        // Admin mode fields
        const customDate = document.getElementById('attendanceDate').value;
        const meetingType = document.getElementById('meetingType').value;
        const adminNotes = document.getElementById('adminNotes').value.trim();

        // Validation
        if (!name || !id || !email) {
    
    // Restore admin mode if it was active
    if (adminMode) {
        const dateInput = document.getElementById('attendanceDate');
        const now = new Date();
        const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateInput.value = localDatetime;
        document.getElementById('meetingType').selectedIndex = 0;
    }
            FirebaseUtils.showMessage('message', 'Please fill in all required fields', 'error');
            return;
        }

        if (!FirebaseUtils.validateEmail(email)) {
            FirebaseUtils.showMessage('message', 'Please enter a valid email', 'error');
            return;
        }

        if (!consent) {
            FirebaseUtils.showMessage('message', 'Please agree to data collection', 'error');
            return;
        }

        // Determine timestamp
        let timestamp, date;
        if (adminMode && customDate) {
            const customDateTime = new Date(customDate);
            const now = new Date();
            
            // Validate not in future
            if (customDateTime > now) {
                FirebaseUtils.showMessage('message', 'Cannot add attendance for future dates', 'error');
                return;
            }
            
            timestamp = customDateTime.toISOString();
            date = customDateTime.toLocaleDateString();
        } else {
            timestamp = new Date().toISOString();
            date = new Date().toLocaleDateString();
        }

        try {
            // Hash email for privacy (basic obfuscation)
            const emailHash = btoa(email).substring(0, 10);

            const attendanceData = {
                name,
                id,
                email,
                emailHash,
                yearLevel: yearLevel || 'Not specified',
                timestamp,
                date,
                meetingType: adminMode ? meetingType : 'General Meeting',
                addedBy: adminMode ? 'Officer (Admin Mode)' : 'Self Sign-In',
                adminNotes: adminMode && adminNotes ? adminNotes : '',
                ipAddress: 'hidden', // Would need backend for real IP
                userAgent: navigator.userAgent.substring(0, 50)
            };

            // Submit to Firebase
            if (window.db) {
                await window.db.ref('attendance').push(attendanceData);
                
                // Show success animation
                document.getElementById('formCard').style.display = 'none';
                document.getElementById('successAnimation').style.display = 'block';
                
                // Reload recent sign-ins
                loadTodayAttendance();
                loadRecentSignins();

                // If in admin mode, auto-reset for next entry after 2 seconds
                if (adminMode) {
                    setTimeout(() => {
                        resetForm();
                    }, 2000);
                }
            } else {
                FirebaseUtils.showMessage('message', 'Firebase not configured. Demo mode.', 'info');
            }
        } catch (error) {
            console.error('Error recording attendance:', error);
            FirebaseUtils.showMessage('message', 'Error recording attendance. Please try again.', 'error');
        }
    });
}

// Reset form for another sign-in
function resetForm() {
    document.getElementById('formCard').style.display = 'block';
    document.getElementById('successAnimation').style.display = 'none';
    document.getElementById('attendanceForm').reset();
}

// Load today's attendance count
function loadTodayAttendance() {
    const today = new Date().toLocaleDateString();
    
    window.db.ref('attendance').orderByChild('date').equalTo(today).on('value', snapshot => {
        let count = 0;
        const signins = [];
        
        snapshot.forEach(entry => {
            count++;
            signins.push(entry.val());
        });
        
        todaySignins = signins;
        document.getElementById('todayCount').textContent = count;
        document.getElementById('uniqueMembers').textContent = count;
        
        // Calculate attendance rate (assuming 156 total members)
        const rate = Math.round((count / 156) * 100);
        document.getElementById('attendanceRate').textContent = rate + '%';
    });
}

// Load recent sign-ins (last 10)
function loadRecentSignins() {
    const container = document.getElementById('recentSignins');
    
    if (!window.db) {
        container.innerHTML = '<p class="text-center text-light">Demo mode - no live data</p>';
        return;
    }
    
    window.db.ref('attendance').limitToLast(10).on('value', snapshot => {
        container.innerHTML = '';
        const signins = [];
        
        snapshot.forEach(entry => {
            signins.unshift(entry.val());
        });
        const meetingBadge = signin.meetingType && signin.meetingType !== 'General Meeting' 
                ? `<span style="background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 8px;">${signin.meetingType}</span>` 
                : '';
            const adminBadge = signin.addedBy === 'Officer (Admin Mode)' 
                ? `<span style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 5px;">⚙️ Admin</span>` 
                : '';
            
            const signinItem = document.createElement('div');
            signinItem.className = 'signin-item';
            signinItem.style.animationDelay = `${index * 0.05}s`;
            signinItem.innerHTML = `
                <div class="signin-info">
                    <div class="signin-avatar">${initials}</div>
                    <div>
                        <strong>${signin.name}</strong>${meetingBadge}${adminBadge});
            
            const signinItem = document.createElement('div');
            signinItem.className = 'signin-item';
            signinItem.style.animationDelay = `${index * 0.05}s`;
            signinItem.innerHTML = `
                <div class="signin-info">
                    <div class="signin-avatar">${initials}</div>
                    <div>
                        <strong>${signin.name}</strong>
                        <div class="text-light" style="font-size: 0.9rem;">${signin.yearLevel || 'Member'}</div>
                    </div>
                </div>
                <div class="text-light" style="font-size: 0.9rem;">${timeAgo}</div>
            `;
            container.appendChild(signinItem);
        });
    });
}

// Get time ago string
function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return time.toLocaleDateString();
}

// Load demo data
function loadDemoData() {
    document.getElementById('todayCount').textContent = '24';
    document.getElementById('uniqueMembers').textContent = '24';
    document.getElementById('attendanceRate').textContent = '15%';
    
    const container = document.getElementById('recentSignins');
    container.innerHTML = `
        <div class="signin-item">
            <div class="signin-info">
                <div class="signin-avatar">JD</div>
                <div>
                    <strong>John Doe</strong>
                    <div class="text-light" style="font-size: 0.9rem;">Junior</div>
                </div>
            </div>
            <div class="text-light" style="font-size: 0.9rem;">2m ago</div>
        </div>
        <div class="signin-item">
            <div class="signin-info">
                <div class="signin-avatar">JS</div>
                <div>
                    <strong>Jane Smith</strong>
                    <div class="text-light" style="font-size: 0.9rem;">Sophomore</div>
                </div>
            </div>
            <div class="text-light" style="font-size: 0.9rem;">5m ago</div>
        </div>
        <div class="signin-item">
            <div class="signin-info">
                <div class="signin-avatar">BJ</div>
                <div>
                    <strong>Bob Johnson</strong>
                    <div class="text-light" style="font-size: 0.9rem;">Senior</div>
                </div>
            </div>
            <div class="text-light" style="font-size: 0.9rem;">12m ago</div>
        </div>
    `;
}
