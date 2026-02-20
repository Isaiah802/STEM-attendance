# Deployment Guide

## 🚀 Firebase Hosting Deployment

This project is a Flask application that can be deployed to Firebase Hosting as a static site.

### Quick Deploy

```bash
# 1. Build static files
python build.py

# 2. Deploy to Firebase
firebase deploy
```

### How It Works

1. **Development Mode** (Local with Flask):
   - Run `python app.py`
   - Access at `http://localhost:5000`
   - Uses Flask templates with `url_for()` for dynamic routes
   - Full server-side functionality

2. **Production Mode** (Firebase Hosting):
   - Run `python build.py` to convert templates to static HTML
   - Generates `public/` folder with static files
   - All `{{ url_for() }}` converted to hardcoded paths
   - Deploy with `firebase deploy`

### Build Script Details

The `build.py` script:
- Creates a `public/` directory
- Copies all `static/` files (CSS, JS)
- Converts Flask templates to static HTML
- Replaces template syntax with absolute paths
- Copies the 404 page

### File Structure After Build

```
public/
├── static/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── firebase-config.js
│       ├── theme.js
│       └── admin.js
├── index.html
├── about.html
├── events.html
├── projects.html
├── resources.html
├── gallery.html
├── contact.html
├── faq.html
├── admin.html
└── 404.html
```

### Important Notes

⚠️ **When to Rebuild:**
- Run `python build.py` whenever you:
  - Update any HTML template
  - Modify CSS or JavaScript files
  - Change any content on the site

⚠️ **Firebase Configuration:**
- Make sure to add your Firebase config to `static/js/firebase-config.js`
- Update `database.rules.json` with proper security rules

### Deployment Commands

```bash
# Full deployment workflow
python build.py           # Build static files
firebase deploy           # Deploy to Firebase

# Or deploy specific services
firebase deploy --only hosting          # Deploy hosting only
firebase deploy --only database         # Deploy database rules only
```

### Alternative Deployment Options

If you prefer to deploy the Flask app with full server functionality:

1. **Heroku**
   ```bash
   # Create Procfile
   echo "web: python app.py" > Procfile
   
   # Deploy
   git push heroku main
   ```

2. **Google Cloud Run**
   ```bash
   gcloud run deploy stem-club --source .
   ```

3. **PythonAnywhere**
   - Upload your files
   - Configure WSGI file
   - Set working directory

### Troubleshooting

**Issue**: CSS not loading after deployment
- **Solution**: Run `python build.py` before deploying

**Issue**: JavaScript errors like "Unexpected token '<'"
- **Solution**: This means templates weren't converted. Run `python build.py`

**Issue**: 404 errors for pages
- **Solution**: Make sure all HTML files are in `public/` after running build script

**Issue**: Firebase config not found
- **Solution**: Add your Firebase credentials to `static/js/firebase-config.js`

### Firebase Hosting URL

After deployment, your site will be available at:
```
https://YOUR-PROJECT-ID.web.app
```

Or your custom domain if configured.
