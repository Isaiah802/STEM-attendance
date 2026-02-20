// Attendance Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("attendanceForm");
    const msg = document.getElementById("message");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("studentName").value.trim();
        const id = document.getElementById("studentID").value.trim();
        const email = document.getElementById("studentEmail").value.trim();

        // Validation
        if (!name || !id || !email) {
            FirebaseUtils.showMessage('message', 'Please fill in all fields', 'error');
            return;
        }

        if (!FirebaseUtils.validateEmail(email)) {
            FirebaseUtils.showMessage('message', 'Please enter a valid email', 'error');
            return;
        }

        try {
            const timestamp = new Date().toISOString();

            // Submit to Firebase
            if (window.db) {
                await window.db.ref("attendance").push({
                    name,
                    id,
                    email,
                    timestamp
                });

                FirebaseUtils.showMessage('message', '✓ Attendance recorded successfully!', 'success');
                form.reset();
            } else {
                FirebaseUtils.showMessage('message', 'Firebase is not configured. Please add your Firebase config.', 'error');
            }
        } catch (error) {
            console.error('Error recording attendance:', error);
            FirebaseUtils.showMessage('message', 'Error recording attendance. Please try again.', 'error');
        }
    });
});
