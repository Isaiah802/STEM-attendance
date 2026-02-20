// Admin Dashboard JavaScript
let attendanceData = [];
let rsvpData = [];
let messageData = [];
let charts = {};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (window.db) {
        loadAttendanceData();
        loadRSVPData();
        loadMessageData();
        initializeCharts();
    } else {
        console.warn('Firebase not configured. Loading demo data...');
        loadDemoData();
    }
});

// Load Attendance Data
function loadAttendanceData() {
    window.db.ref('attendance').on('value', snapshot => {
        attendanceData = [];
        const tableBody = document.querySelector('#attendanceTable tbody');
        tableBody.innerHTML = '';
        
        let count = 0;
        snapshot.forEach(entry => {
            const data = entry.val();
            attendanceData.push({
                name: data.name,
                id: data.id,
                email: data.email,
                timestamp: data.timestamp
            });
            
            const row = `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.id}</td>
                    <td>${data.email}</td>
                    <td>${FirebaseUtils.formatTimestamp(data.timestamp)}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
            count++;
        });
        
        document.getElementById('totalMembers').textContent = count;
        document.getElementById('attendanceCount').textContent = `Total: ${count} records`;
        updateMonthlyStats();
        updateCharts();
    });
}

// Load RSVP Data
function loadRSVPData() {
    window.db.ref('rsvps').on('value', snapshot => {
        rsvpData = [];
        const tableBody = document.querySelector('#rsvpsTable tbody');
        tableBody.innerHTML = '';
        
        let count = 0;
        snapshot.forEach(eventSnapshot => {
            const eventId = eventSnapshot.key;
            eventSnapshot.forEach(rsvpSnapshot => {
                const data = rsvpSnapshot.val();
                rsvpData.push({
                    event: eventId,
                    name: data.name,
                    email: data.email,
                    timestamp: data.timestamp
                });
                
                const row = `
                    <tr>
                        <td>${formatEventName(eventId)}</td>
                        <td>${data.name}</td>
                        <td>${data.email}</td>
                        <td>${FirebaseUtils.formatTimestamp(data.timestamp)}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
                count++;
            });
        });
        
        document.getElementById('totalRSVPs').textContent = count;
        document.getElementById('rsvpCount').textContent = `Total: ${count} RSVPs`;
    });
}

// Load Message Data
function loadMessageData() {
    window.db.ref('messages').on('value', snapshot => {
        messageData = [];
        const tableBody = document.querySelector('#messagesTable tbody');
        tableBody.innerHTML = '';
        
        let count = 0;
        let unreadCount = 0;
        snapshot.forEach(entry => {
            const data = entry.val();
            const isUnread = data.status === 'unread';
            if (isUnread) unreadCount++;
            
            messageData.push({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                timestamp: data.timestamp,
                status: data.status || 'unread'
            });
            
            const row = `
                <tr style="${isUnread ? 'font-weight: bold;' : ''}">
                    <td>${data.name}</td>
                    <td>${data.email}</td>
                    <td>${data.subject}</td>
                    <td>${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}</td>
                    <td>${FirebaseUtils.formatTimestamp(data.timestamp)}</td>
                    <td><span style="background: ${isUnread ? '#ff9800' : '#4caf50'}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">${data.status || 'unread'}</span></td>
                </tr>
            `;
            tableBody.innerHTML += row;
            count++;
        });
        
        document.getElementById('totalMessages').textContent = unreadCount;
        document.getElementById('messageCount').textContent = `Total: ${count} messages (${unreadCount} unread)`;
    });
}

// Update Monthly Statistics
function updateMonthlyStats() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyCount = attendanceData.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.getMonth() === currentMonth && 
               recordDate.getFullYear() === currentYear;
    }).length;
    
    document.getElementById('monthlyAttendance').textContent = monthlyCount;
}

// Initialize Charts
function initializeCharts() {
    // Attendance Trend Chart
    const trendCtx = document.getElementById('attendanceChart');
    if (trendCtx) {
        charts.trend = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: getLast7Days(),
                datasets: [{
                    label: 'Attendance',
                    data: [12, 15, 10, 18, 14, 16, 13],
                    borderColor: 'rgb(76, 175, 80)',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Day of Week Chart
    const dayCtx = document.getElementById('dayChart');
    if (dayCtx) {
        charts.day = new Chart(dayCtx, {
            type: 'bar',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                datasets: [{
                    label: 'Attendance by Day',
                    data: [8, 25, 12, 28, 15],
                    backgroundColor: 'rgba(33, 150, 243, 0.8)',
                    borderColor: 'rgb(33, 150, 243)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Events Chart
    const eventsCtx = document.getElementById('eventsChart');
    if (eventsCtx) {
        charts.events = new Chart(eventsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Workshops', 'Meetings', 'Competitions', 'Social Events'],
                datasets: [{
                    data: [35, 30, 20, 15],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(33, 150, 243, 0.8)',
                        'rgba(255, 152, 0, 0.8)',
                        'rgba(156, 39, 176, 0.8)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Update Charts with Real Data
function updateCharts() {
    if (!charts.trend || attendanceData.length === 0) return;
    
    const last7Days = getLast7Days();
    const dailyCounts = last7Days.map(day => {
        return attendanceData.filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate.toLocaleDateString() === day;
        }).length;
    });
    
    charts.trend.data.datasets[0].data = dailyCounts;
    charts.trend.update();
}

// Helper Functions
function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
}

function formatEventName(eventId) {
    return eventId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Tab Switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Search Table Function
function searchTable(tableId, searchValue) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const search = searchValue.toLowerCase();
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    }
}

// Export Data Function
function exportData(dataType) {
    let data, filename;
    
    switch(dataType) {
        case 'attendance':
            data = attendanceData.map(record => ({
                Name: record.name,
                'Student ID': record.id,
                Email: record.email,
                Timestamp: FirebaseUtils.formatTimestamp(record.timestamp)
            }));
            filename = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
            break;
            
        case 'rsvps':
            data = rsvpData.map(record => ({
                Event: formatEventName(record.event),
                Name: record.name,
                Email: record.email,
                Timestamp: FirebaseUtils.formatTimestamp(record.timestamp)
            }));
            filename = `rsvps_${new Date().toISOString().split('T')[0]}.csv`;
            break;
            
        case 'messages':
            data = messageData.map(record => ({
                Name: record.name,
                Email: record.email,
                Subject: record.subject,
                Message: record.message,
                Timestamp: FirebaseUtils.formatTimestamp(record.timestamp),
                Status: record.status
            }));
            filename = `messages_${new Date().toISOString().split('T')[0]}.csv`;
            break;
            
        default:
            alert('Invalid data type');
            return;
    }
    
    if (data.length === 0) {
        alert('No data to export');
        return;
    }
    
    FirebaseUtils.exportToCSV(data, filename);
}

// Load Demo Data (when Firebase not configured)
function loadDemoData() {
    // Demo attendance data
    const demoAttendance = [
        { name: 'John Doe', id: '12345', email: 'john@example.com', timestamp: new Date().toISOString() },
        { name: 'Jane Smith', id: '12346', email: 'jane@example.com', timestamp: new Date().toISOString() },
        { name: 'Bob Johnson', id: '12347', email: 'bob@example.com', timestamp: new Date().toISOString() }
    ];
    
    attendanceData = demoAttendance;
    const tableBody = document.querySelector('#attendanceTable tbody');
    tableBody.innerHTML = demoAttendance.map(data => `
        <tr>
            <td>${data.name}</td>
            <td>${data.id}</td>
            <td>${data.email}</td>
            <td>${FirebaseUtils.formatTimestamp(data.timestamp)}</td>
        </tr>
    `).join('');
    
    document.getElementById('totalMembers').textContent = '156';
    document.getElementById('monthlyAttendance').textContent = '42';
    document.getElementById('totalRSVPs').textContent = '28';
    document.getElementById('totalMessages').textContent = '5';
    document.getElementById('attendanceCount').textContent = `Total: ${demoAttendance.length} records (Demo Data)`;
    document.getElementById('rsvpCount').textContent = 'Total: 0 RSVPs';
    document.getElementById('messageCount').textContent = 'Total: 0 messages';
    
    initializeCharts();
}
