// Firebase Configuration
// Project: stem-c0eca
// Status: ✅ CONFIGURED
const firebaseConfig = {
    apiKey: "AIzaSyB3Xvff2ZbvA265_UTaAV64fAb6TrN4CRE",
    authDomain: "stem-c0eca.firebaseapp.com",
    databaseURL: "https://stem-c0eca-default-rtdb.firebaseio.com",
    projectId: "stem-c0eca",
    storageBucket: "stem-c0eca.firebasestorage.app",
    messagingSenderId: "411986749465",
    appId: "1:411986749465:web:46e1ab9c3cc1ca9bc62288",
    measurementId: "G-8EVQVLETSB"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && Object.keys(firebaseConfig).length > 0) {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.database();
    console.log('Firebase initialized successfully');
} else {
    console.warn('Firebase configuration is incomplete. Please add your Firebase config.');
}

// Utility functions for Firebase operations
const FirebaseUtils = {
    // Show messages to user
    showMessage(elementId, message, type = 'success') {
        const msgElement = document.getElementById(elementId);
        if (msgElement) {
            msgElement.textContent = message;
            msgElement.className = `message message-${type}`;
            msgElement.style.display = 'block';
            setTimeout(() => {
                msgElement.style.display = 'none';
            }, 4000);
        }
    },

    // Format timestamp
    formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Export data to CSV
    exportToCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};
