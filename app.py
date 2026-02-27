"""
STEM Attendance Application
A Flask-based web application for tracking student attendance with Firebase integration.
"""

from flask import Flask, render_template, jsonify, request
import os
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'True') == 'True'

# Firebase configuration from environment variables
FIREBASE_CONFIG = {
    'apiKey': os.environ.get('FIREBASE_API_KEY', ''),
    'authDomain': os.environ.get('FIREBASE_AUTH_DOMAIN', ''),
    'databaseURL': os.environ.get('FIREBASE_DATABASE_URL', ''),
    'projectId': os.environ.get('FIREBASE_PROJECT_ID', ''),
    'storageBucket': os.environ.get('FIREBASE_STORAGE_BUCKET', ''),
    'messagingSenderId': os.environ.get('FIREBASE_MESSAGING_SENDER_ID', ''),
    'appId': os.environ.get('FIREBASE_APP_ID', ''),
    'measurementId': os.environ.get('FIREBASE_MEASUREMENT_ID', '')
}

@app.context_processor
def inject_firebase_config():
    """Inject Firebase configuration into all templates"""
    return {
        'firebase_config_json': json.dumps(FIREBASE_CONFIG)
    }

# ==================== MAIN ROUTES ====================

@app.route('/')
def index():
    """Main home page with attendance sign-in"""
    return render_template('index.html')

@app.route('/attendance')
def attendance():
    """Dedicated attendance sign-in page"""
    return render_template('attendance.html')

@app.route('/about')
def about():
    """About Us page - club info, mission, team"""
    return render_template('about.html')

@app.route('/events')
def events():
    """Events and calendar page with RSVP system"""
    return render_template('events.html')

@app.route('/projects')
def projects():
    """Projects showcase page"""
    return render_template('projects.html')

@app.route('/resources')
def resources():
    """Learning resources and tutorials page"""
    return render_template('resources.html')

@app.route('/gallery')
def gallery():
    """Photo gallery page"""
    return render_template('gallery.html')

@app.route('/contact')
def contact():
    """Contact form page"""
    return render_template('contact.html')

@app.route('/faq')
def faq():
    """Frequently Asked Questions page"""
    return render_template('faq.html')

@app.route('/admin')
def admin():
    """Admin panel to view attendance records, RSVPs, and messages"""
    return render_template('admin.html')

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    """Custom 404 error handler"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Custom 500 error handler"""
    return jsonify({'error': 'Internal server error'}), 500

# ==================== API ROUTES ====================

@app.route('/api/health')
def health():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'version': '2.0',
        'features': [
            'attendance_tracking',
            'event_rsvp',
            'contact_form',
            'admin_dashboard',
            'dark_mode',
            'csv_export'
        ]
    }), 200

@app.route('/api/stats')
def stats():
    """Get basic statistics (for future API integration)"""
    # This would connect to Firebase in production
    return jsonify({
        'total_members': 156,
        'monthly_attendance': 42,
        'total_events': 12,
        'active_projects': 8
    }), 200

# ==================== MAIN ====================

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])