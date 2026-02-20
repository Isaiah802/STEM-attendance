// Home Page Dynamic Data Loading
document.addEventListener('DOMContentLoaded', () => {
    // Load live statistics
    if (window.db) {
        loadTodayAttendance();
        loadStatistics();
    } else {
        console.warn('Firebase not configured. Using fallback data.');
        showFallbackData();
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Hide scroll indicator after first scroll
    let hasScrolled = false;
    window.addEventListener('scroll', () => {
        if (!hasScrolled && window.scrollY > 100) {
            hasScrolled = true;
            const indicator = document.querySelector('.scroll-indicator');
            if (indicator) {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.style.display = 'none', 300);
            }
        }
    });
});

// Load today's attendance count
function loadTodayAttendance() {
    const today = new Date().toLocaleDateString();
    const countElement = document.getElementById('todayAttendanceCount');
    
    if (!countElement) return;
    
    window.db.ref('attendance').orderByChild('date').equalTo(today).once('value', snapshot => {
        const count = snapshot.numChildren();
        
        if (count === 0) {
            countElement.innerHTML = 'Be the first to sign in today!';
        } else if (count === 1) {
            countElement.innerHTML = '<strong>1</strong> member has signed in today';
        } else {
            countElement.innerHTML = `<strong>${count}</strong> members have signed in today`;
        }
    }).catch(error => {
        console.error('Error loading attendance:', error);
        countElement.innerHTML = 'Sign in to track your attendance';
    });
}

// Load statistics for the stats section
function loadStatistics() {
    // Load total attendance records
    window.db.ref('attendance').once('value', snapshot => {
        const total = snapshot.numChildren();
        const element = document.getElementById('statAttendance');
        if (element) {
            element.textContent = total > 0 ? total.toLocaleString() : '—';
        }
    }).catch(error => {
        console.error('Error loading attendance stats:', error);
    });
    
    // Load upcoming events count
    window.db.ref('rsvps').once('value', snapshot => {
        // Get unique events from RSVPs
        const events = new Set();
        snapshot.forEach(entry => {
            const data = entry.val();
            if (data.event) {
                events.add(data.event);
            }
        });
        
        const element = document.getElementById('statEvents');
        if (element) {
            element.textContent = events.size > 0 ? events.size : '—';
        }
    }).catch(error => {
        console.error('Error loading events stats:', error);
    });
}

// Show fallback data when Firebase is not configured
function showFallbackData() {
    const countElement = document.getElementById('todayAttendanceCount');
    if (countElement) {
        countElement.innerHTML = 'Sign in to track your attendance';
    }
    
    // Stats remain as default values in HTML
}
