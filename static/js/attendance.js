// Enhanced Attendance Page JavaScript
let todaySignins = [];

document.addEventListener('DOMContentLoaded', () => {
    if (window.db) {
        loadTodayAttendance();
        loadRecentSignins();
    } else {
        console.warn('Firebase not configured. Using demo mode.');
        loadDemoData();
    }
});

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

        // Validation
        if (!name || !id || !email) {
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

        try {
            const timestamp = new Date().toISOString();
            const date = new Date().toLocaleDateString();

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
        
        if (signins.length === 0) {
            container.innerHTML = '<p class="text-center text-light">No sign-ins yet today</p>';
            return;
        }
        
        signins.forEach((signin, index) => {
            const initials = signin.name.split(' ').map(n => n[0]).join('').substring(0, 2);
            const timeAgo = getTimeAgo(signin.timestamp);
            
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
