# STEM Attendance System

A comprehensive web-based platform for STEM Club featuring attendance tracking, event management, project showcases, and an interactive admin dashboard with real-time analytics.

## ✨ Features

### 📄 Pages & Sections
- **Home Page** - Hero section, club overview, mission statement, attendance sign-in
- **About Us** - Team profiles, club history, values, and mission
- **Events/Calendar** - Upcoming events with live countdown and RSVP system
- **Projects Showcase** - Filterable project gallery with demos and GitHub links
- **Resources** - Curated learning materials with real-time search
- **Gallery** - Photo gallery with category filters and lightbox viewer
- **Contact** - Message submission form with Firebase integration
- **FAQ** - Expandable Q&A sections for common questions
- **Admin Dashboard** - Analytics, charts, data export, and management

### 🎯 Interactive Features
- ✅ **Dark Mode Toggle** - Persistent theme switching
- ✅ **RSVP System** - Event registration with Firebase storage
- ✅ **Attendance Dashboard** - Interactive charts (Chart.js)
- ✅ **CSV Export** - Download attendance, RSVPs, and messages
- ✅ **Search/Filter** - Real-time filtering on projects, resources, and data tables
- ✅ **Contact Form** - Message submission to Firebase database
- ✅ **Countdown Timer** - Live countdown to next event
- ✅ **Responsive Design** - Mobile-first with hamburger menu
- ✅ **Smooth Animations** - CSS transitions and hover effects

### 📊 Admin Dashboard
- Real-time statistics (members, attendance, RSVPs, messages)
- Interactive charts (line, bar, doughnut)
- Tabbed interface for different data types
- Search functionality on all tables
- CSV export for all data
- Responsive data visualizations

## 🚀 Quick Start

```
STEM-attendance/
├── app.py                    # Flask application
├── requirements.txt          # Python dependencies
├── .gitignore               # Git ignore rules
├── firebase.json            # Firebase configuration
├── database.rules.json      # Firebase database rules
├── 404.html                 # Firebase 404 page
├── templates/               # HTML templates
│   ├── index.html          # Student sign-in page
│   ├── admin.html          # Admin dashboard
│   └── 404.html            # Flask 404 error page
└── static/                  # Static assets
    ├── css/
    │   └── styles.css      # Application styles
    └── js/
        └── app.js          # Firebase client logic
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Isaiah802/STEM-attendance.git
   cd STEM-attendance
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Realtime Database
   - Copy your Firebase configuration
   - Update `static/js/app.js` with your Firebase config
   - Update `templates/admin.html` with your Firebase config

5. **Run the application**
   ```bash
   python app.py
   ```
   Visit `http://localhost:5000` in your browser

## Firebase Deployment

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done)
   ```bash
   firebase init
   ```

4. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy
   ```

## Usage

### Student Sign-In
1. Navigate to the home page
2. Enter your name, student ID, and email
3. Click "Sign In" to record attendance

### Admin View
1. Navigate to `/admin`
2. View all attendance records in real-time
3. Records display name, ID, email, and timestamp

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
FLASK_DEBUG=False
SECRET_KEY=your-secret-key-here
PORT=5000
```

## Security Notes

- Update the `database.rules.json` file to secure your Firebase database
- Never commit Firebase API keys to version control
- Use environment variables for sensitive configuration
- Change the SECRET_KEY in production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is for educational purposes.

## Contact

Project Link: [https://github.com/Isaiah802/STEM-attendance](https://github.com/Isaiah802/STEM-attendance)
