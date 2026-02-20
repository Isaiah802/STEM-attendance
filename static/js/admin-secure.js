// Secure Admin Dashboard JavaScript
// OFFICER ACCESS ONLY - Based on NLC STEM Club Constitution
// Default passwords - CHANGE THESE IN PRODUCTION!
const ADMIN_CREDENTIALS = {
    'president': 'nlcstem2026',
    'vicepresident': 'nlcstem2026',
    'treasurer': 'nlcstem2026',
    'secretary': 'nlcstem2026',
    'admin': 'stemadmin2026'  // Backup admin account
};

let currentUser = null;
let auditLog = [];
let allData = {
    attendance: [],
    rsvps: [],
    messages: []
};

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const session = sessionStorage.getItem('stemAdminAuth');
    if (session) {
        const auth = JSON.parse(session);
        if (auth.expiry > Date.now()) {
            currentUser = auth.username;
            showDashboard();
        }
    }
    
    // Setup login form
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    
    // Setup search handlers
    document.getElementById('searchAttendance')?.addEventListener('input', (e) => filterTable('attendance', e.target.value));
    document.getElementById('searchRsvps')?.addEventListener('input', (e) => filterTable('rsvps', e.target.value));
    document.getElementById('searchMessages')?.addEventListener('input', (e) => filterTable('messages', e.target.value));
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const messageEl = document.getElementById('loginMessage');
    
    // Log attempt
    logAudit('LOGIN_ATTEMPT', `Username: ${username}`);
    
    // Check credentials
    if (ADMIN_CREDENTIALS[username] && ADMIN_CREDENTIALS[username] === password) {
        // Success!
        currentUser = username;
        
        // Create session (expires in 2 hours)
        const session = {
            username,
            expiry: Date.now() + (2 * 60 * 60 * 1000),
            loginTime: new Date().toISOString()
        };
        sessionStorage.setItem('stemAdminAuth', JSON.stringify(session));
        
        logAudit('LOGIN_SUCCESS', `User: ${username}`);
        
        showDashboard();
    } else {
        // Failure
        logAudit('LOGIN_FAILED', `Invalid credentials for: ${username}`);
        
        messageEl.innerHTML = `
            <div style="background: rgba(244, 67, 54, 0.1); padding: 15px; border-radius: 8px; color: #f44336;">
                ❌ Invalid credentials. Please try again.
            </div>
        `;
        messageEl.style.display = 'block';
        
        // Clear password
        document.getElementById('adminPassword').value = '';
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    document.getElementById('adminName').textContent = currentUser;
    
    // Load all data
    loadDashboardData();
    
    logAudit('DASHBOARD_ACCESS', 'Dashboard loaded');
}

// Logout
function logout() {
    logAudit('LOGOUT', `User: ${currentUser}`);
    
    currentUser = null;
    sessionStorage.removeItem('stemAdminAuth');
    
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

// Switch view
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.dashboard-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Remove active from nav items
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(viewName + 'View').classList.add('active');
    
    // Add active to clicked nav item
    event.target.classList.add('active');
    
    logAudit('VIEW_CHANGE', `Switched to: ${viewName}`);
}

// Load dashboard data
async function loadDashboardData() {
    if (!window.db) {
        loadDemoData();
        return;
    }
    
    try {
        // Load attendance
        const attendanceSnapshot = await window.db.ref('attendance').once('value');
        allData.attendance = [];
        attendanceSnapshot.forEach(entry => {
            allData.attendance.push({ key: entry.key, ...entry.val() });
        });
        
        // Load RSVPs
        const rsvpSnapshot = await window.db.ref('rsvps').once('value');
        allData.rsvps = [];
        rsvpSnapshot.forEach(entry => {
            allData.rsvps.push({ key: entry.key, ...entry.val() });
        });
        
        // Load messages
        const messageSnapshot = await window.db.ref('messages').once('value');
        allData.messages = [];
        messageSnapshot.forEach(entry => {
            allData.messages.push({ key: entry.key, ...entry.val() });
        });
        
        // Update UI
        updateOverview();
        updateDataTables();
        createCharts();
        
        logAudit('DATA_LOADED', `Loaded ${allData.attendance.length + allData.rsvps.length + allData.messages.length} records`);
    } catch (error) {
        console.error('Error loading data:', error);
        logAudit('ERROR', 'Failed to load data from Firebase');
    }
}

// Update overview metrics
function updateOverview() {
    document.getElementById('totalAttendance').textContent = allData.attendance.length;
    document.getElementById('totalRsvps').textContent = allData.rsvps.length;
    document.getElementById('totalMessages').textContent = allData.messages.length;
    
    // Calculate average attendance per meeting (assuming meetings are unique dates)
    const uniqueDates = [...new Set(allData.attendance.map(a => a.date))];
    const avg = uniqueDates.length > 0 ? Math.round(allData.attendance.length / uniqueDates.length) : 0;
    document.getElementById('avgAttendance').textContent = avg;
    
    // Update security metrics
    document.getElementById('loginAttempts').textContent = auditLog.filter(log => log.action.includes('LOGIN')).length;
    document.getElementById('dataAccesses').textContent = auditLog.length;
    document.getElementById('dataRecords').textContent = allData.attendance.length + allData.rsvps.length + allData.messages.length;
}

// Update data tables
function updateDataTables() {
    // Attendance table
    const attendanceBody = document.getElementById('attendanceTableBody');
    if (allData.attendance.length === 0) {
        attendanceBody.innerHTML = '<tr><td colspan="7" class="text-center">No attendance records found</td></tr>';
    } else {
        attendanceBody.innerHTML = allData.attendance.slice().reverse().map(record => {
            const meetingTypeBadge = record.meetingType && record.meetingType !== 'General Meeting'
                ? `<span style="background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 5px;">${record.meetingType}</span>`
                : '';
            const adminBadge = record.addedBy === 'Officer (Admin Mode)'
                ? `<span style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 5px;">⚙️ Admin Entry</span>`
                : '';
            const notesIcon = record.adminNotes && record.adminNotes.trim()
                ? `<span style="cursor: help; margin-left: 5px;" title="${escapeHtml(record.adminNotes)}">📝</span>`
                : '';
            
            return `
                <tr>
                    <td><strong>${record.name}</strong></td>
                    <td>${record.id}</td>
                    <td style="font-size: 0.9rem;">${record.email}</td>
                    <td>${record.yearLevel || 'N/A'}</td>
                    <td>${record.meetingType || 'General Meeting'}${meetingTypeBadge}</td>
                    <td>${formatDateTime(record.timestamp)}${adminBadge}${notesIcon}</td>
                </tr>
            `;
        }).join('');
    }
    
    // RSVPs table
    const rsvpsBody = document.getElementById('rsvpsTableBody');
    if (allData.rsvps.length === 0) {
        rsvpsBody.innerHTML = '<tr><td colspan="5" class="text-center">No RSVP records found</td></tr>';
    } else {
        rsvpsBody.innerHTML = allData.rsvps.slice().reverse().map(record => `
            <tr>
                <td><strong>${record.name}</strong></td>
                <td>${record.email}</td>
                <td>${record.event}</td>
                <td>${record.guests || 0}</td>
                <td>${formatDateTime(record.timestamp)}</td>
            </tr>
        `).join('');
    }
    
    // Messages table
    const messagesBody = document.getElementById('messagesTableBody');
    if (allData.messages.length === 0) {
        messagesBody.innerHTML = '<tr><td colspan="5" class="text-center">No messages found</td></tr>';
    } else {
        messagesBody.innerHTML = allData.messages.slice().reverse().map(record => `
            <tr>
                <td><strong>${record.name}</strong></td>
                <td>${record.email}</td>
                <td>${record.subject}</td>
                <td style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${record.message}</td>
                <td>${formatDateTime(record.timestamp)}</td>
            </tr>
        `).join('');
    }
}

// Create charts
function createCharts() {
    // Trend chart (last 7 days)
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        const last7Days = getLast7Days();
        const trendData = last7Days.map(date => {
            return allData.attendance.filter(a => a.date === date).length;
        });
        
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: 'Attendance',
                    data: trendData,
                    borderColor: '#6200ea',
                    backgroundColor: 'rgba(98, 0, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Year distribution chart
    const yearCtx = document.getElementById('yearChart');
    if (yearCtx) {
        const yearCounts = {};
        allData.attendance.forEach(a => {
            const year = a.yearLevel || 'Not specified';
            yearCounts[year] = (yearCounts[year] || 0) + 1;
        });
        
        new Chart(yearCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(yearCounts),
                datasets: [{
                    data: Object.values(yearCounts),
                    backgroundColor: ['#6200ea', '#00bfa5', '#ff6d00', '#d50000', '#aa00ff', '#304ffe']
                }]
            },
            options: {
                responsive: true
            }
        });
    }
}

// Get last 7 days
function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString());
    }
    return days;
}

// Format date/time
function formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter table
function filterTable(type, query) {
    const data = allData[type];
    const filtered = data.filter(item => {
        const searchStr = JSON.stringify(item).toLowerCase();
        return searchStr.includes(query.toLowerCase());
    });
    
    // Update specific table
    const bodyId = type + 'TableBody';
    const tbody = document.getElementById(bodyId);
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">No results found for "${query}"</td></tr>`;
        return;
    }
    
    // Render filtered results
    if (type === 'attendance') {
        tbody.innerHTML = filtered.map(record => `
            <tr>
                <td><strong>${record.name}</strong></td>
                <td>${record.id}</td>
                <td>${record.email}</td>
                <td>${record.yearLevel || 'N/A'}</td>
                <td>${formatDateTime(record.timestamp)}</td>
            </tr>
        `).join('');
    } else if (type === 'rsvps') {
        tbody.innerHTML = filtered.map(record => `
            <tr>
                <td><strong>${record.name}</strong></td>
                <td>${record.email}</td>
                <td>${record.event}</td>
                <td>${record.guests || 0}</td>
                <td>${formatDateTime(record.timestamp)}</td>
            </tr>
        `).join('');
    } else if (type === 'messages') {
        tbody.innerHTML = filtered.map(record => `
            <tr>
                <td><strong>${record.name}</strong></td>
                <td>${record.email}</td>
                <td>${record.subject}</td>
                <td style="max-width: 300px;">${record.message}</td>
                <td>${formatDateTime(record.timestamp)}</td>
            </tr>
        `).join('');
    }
}

// Export data
function exportData(type, format) {
    const data = allData[type];
    
    if (data.length === 0) {
        alert('No data to export');
        return;
    }
    
    logAudit('DATA_EXPORT', `Exported ${type} as ${format}`);
    
    if (format === 'csv') {
        exportCSV(data, type);
    } else if (format === 'json') {
        exportJSON(data, type);
    }
}

// Export as CSV
function exportCSV(data, filename) {
    if (data.length === 0) return;
    
    // Get headers
    const headers = Object.keys(data[0]).filter(key => key !== 'key' && key !== 'userAgent');
    
    // Build CSV
    let csv = headers.join(',') + '\n';
    data.forEach(item => {
        const row = headers.map(header => {
            const value = item[header] || '';
            // Escape commas and quotes
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csv += row.join(',') + '\n';
    });
    
    // Download
    downloadFile(csv, `${filename}_${Date.now()}.csv`, 'text/csv');
}

// Export as JSON
function exportJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}_${Date.now()}.json`, 'application/json');
}

// Download file
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Log audit event
function logAudit(action, details) {
    const entry = {
        timestamp: new Date().toISOString(),
        action,
        details,
        user: currentUser || 'anonymous'
    };
    
    auditLog.unshift(entry);
    
    // Update audit log display
    const logEl = document.getElementById('auditLog');
    if (logEl && auditLog.length > 0) {
        logEl.innerHTML = auditLog.slice(0, 20).map(entry => `
            <div class="audit-entry">
                <strong>[${formatDateTime(entry.timestamp)}]</strong>
                ${entry.action} - ${entry.details}
                <span style="opacity: 0.7;">(${entry.user})</span>
            </div>
        `).join('');
    }
}

// Download audit log
function downloadAuditLog() {
    if (auditLog.length === 0) {
        alert('No audit log entries to download');
        return;
    }
    
    const csv = 'Timestamp,Action,Details,User\n' + 
        auditLog.map(entry => 
            `"${entry.timestamp}","${entry.action}","${entry.details}","${entry.user}"`
        ).join('\n');
    
    downloadFile(csv, `audit_log_${Date.now()}.csv`, 'text/csv');
    logAudit('AUDIT_EXPORT', 'Downloaded audit log');
}

// Purge old data
function purgeOldData() {
    if (!confirm('Are you sure you want to permanently delete data older than 1 year? This cannot be undone.')) {
        return;
    }
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    let purgedCount = 0;
    
    ['attendance', 'rsvps', 'messages'].forEach(type => {
        allData[type] = allData[type].filter(item => {
            const itemDate = new Date(item.timestamp);
            if (itemDate < oneYearAgo) {
                // Delete from Firebase
                if (window.db && item.key) {
                    window.db.ref(`${type}/${item.key}`).remove();
                }
                purgedCount++;
                return false;
            }
            return true;
        });
    });
    
    alert(`Successfully purged ${purgedCount} old records`);
    logAudit('DATA_PURGE', `Purged ${purgedCount} records older than 1 year`);
    
    // Reload dashboard
    updateOverview();
    updateDataTables();
}

// Load demo data
function loadDemoData() {
    allData = {
        attendance: [
            { name: 'John Doe', id: 'S12345', email: 'john@example.com', yearLevel: 'Junior', timestamp: new Date().toISOString(), date: new Date().toLocaleDateString() },
            { name: 'Jane Smith', id: 'S12346', email: 'jane@example.com', yearLevel: 'Sophomore', timestamp: new Date().toISOString(), date: new Date().toLocaleDateString() }
        ],
        rsvps: [
            { name: 'Bob Johnson', email: 'bob@example.com', event: 'Hackathon 2026', guests: 1, timestamp: new Date().toISOString() }
        ],
        messages: [
            { name: 'Alice Brown', email: 'alice@example.com', subject: 'Question', message: 'When is the next meeting?', timestamp: new Date().toISOString() }
        ]
    };
    
    updateOverview();
    updateDataTables();
    createCharts();
}
