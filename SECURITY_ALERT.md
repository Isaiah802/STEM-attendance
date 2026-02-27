# 🔴 SECURITY ALERT - Immediate Action Required

## Summary
Your Firebase API key and configuration were exposed in your GitHub repository. GitHub detected these secrets and sent you an alert.

## ✅ What Has Been Done
The codebase has been updated to:
1. Remove hardcoded Firebase credentials from all source files
2. Move Firebase configuration to environment variables (.env file)
3. Inject configuration securely from the server at runtime
4. Ensure .env is gitignored and won't be committed to the repository

## 🚨 Critical Actions Required - DO THESE NOW

### Step 1: Rotate Your Firebase API Key (REQUIRED)

Since your API key was exposed publicly, you **MUST** generate new credentials:

#### Option A: Create a New Web App (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `stem-c0eca`
3. Click the gear icon ⚙️ > **Project Settings**
4. Scroll down to "Your apps" section
5. Click **"Add app"** button and select **Web (</> icon)**
6. Give it a name like "STEM Website v2"
7. Copy the new configuration values
8. Update your `.env` file with the new values
9. **Optional but recommended:** Delete the old web app from Firebase Console

#### Option B: Restrict the Current API Key
If you can't rotate immediately, at least add restrictions:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `stem-c0eca`
3. Navigate to **APIs & Services** > **Credentials**
4. Find your API key: `AIzaSyB3Xvff2ZbvA265_UTaAV64fAb6TrN4CRE`
5. Click **Edit** (pencil icon)
6. Under "Application restrictions", select **HTTP referrers (web sites)**
7. Add your website domains:
   - `https://yourdomain.com/*`
   - `http://localhost:5000/*` (for development)
   - `https://*.web.app/*` (if using Firebase Hosting)
8. Under "API restrictions", select **Restrict key** and choose only:
   - Firebase Realtime Database API
   - Firebase Authentication API (if using auth)
9. Click **Save**

### Step 2: Review Firebase Security Rules

Ensure your Firebase Realtime Database has proper security rules:

1. Go to Firebase Console > **Realtime Database** > **Rules**
2. Review your rules in `database.rules.json`
3. **NEVER** have rules like this in production:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
4. Implement proper authentication-based rules (example in database.rules.json)

### Step 3: Update Your .env File

1. Open `.env` (it's in your project root, but **not** tracked by git)
2. Replace the exposed values with your new credentials:
   ```env
   FIREBASE_API_KEY=your-new-api-key-here
   FIREBASE_AUTH_DOMAIN=stem-c0eca.firebaseapp.com
   FIREBASE_DATABASE_URL=https://stem-c0eca-default-rtdb.firebaseio.com
   FIREBASE_PROJECT_ID=stem-c0eca
   FIREBASE_STORAGE_BUCKET=stem-c0eca.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your-new-sender-id
   FIREBASE_APP_ID=your-new-app-id
   FIREBASE_MEASUREMENT_ID=your-new-measurement-id
   ```

### Step 4: Commit and Push the Sanitized Code

```bash
# Stage all the security fixes
git add .

# Commit the changes
git commit -m "security: Remove hardcoded Firebase credentials and use environment variables"

# Push to GitHub
git push origin main
```

### Step 5: Clear Git History (Optional but Recommended)

The exposed keys are still in your Git history. To completely remove them:

#### Using BFG Repo-Cleaner (Easier):
```bash
# Download BFG from: https://rpo.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files firebase-config.js
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

#### OR Using git-filter-repo (More thorough):
```bash
# Install git-filter-repo: pip install git-filter-repo

# Create a backup first!
cd ..
cp -r STEM-website STEM-website-backup
cd STEM-website

# Remove the sensitive files from history
git filter-repo --path public/static/js/firebase-config.js --invert-paths
git filter-repo --path static/js/firebase-config.js --invert-paths

# Force push
git push origin --force --all
```

⚠️ **WARNING**: Force pushing rewrites history. Coordinate with team members if others have cloned the repo.

### Step 6: Verify on GitHub

1. Go to your repository settings on GitHub
2. Navigate to **Security** > **Secret scanning**
3. Mark the alert as "Resolved" after rotating keys
4. Verify the hardcoded keys no longer appear in any files

## 📝 How the New System Works

### For Development (Local)
1. Create/edit `.env` file in project root (never commit this!)
2. Add your Firebase credentials to `.env`
3. Run `python app.py` - Flask automatically loads .env via python-dotenv
4. The app injects config into templates at runtime

### For Production (Deployment)
Set environment variables in your hosting platform:

**Firebase Hosting + Cloud Functions:**
```bash
firebase functions:config:set firebase.api_key="your-key"
firebase functions:config:set firebase.auth_domain="your-domain"
# ... repeat for all values
```

**Heroku:**
```bash
heroku config:set FIREBASE_API_KEY="your-key"
heroku config:set FIREBASE_AUTH_DOMAIN="your-domain"
# ... repeat for all values
```

**Vercel/Netlify:**
Add environment variables in the dashboard under project settings.

## 🔍 What Changed in the Code

1. **app.py**: Added environment variable loading and Firebase config injection
2. **firebase-config.js**: Removed hardcoded values, now reads from `window.firebaseConfig`
3. **All templates**: Inject Firebase config via server before loading firebase-config.js
4. **.env**: Created (gitignored) - stores your actual credentials locally
5. **.env.example**: Updated with all Firebase variables as a template

## ✅ Verification Checklist

- [ ] Rotated Firebase API key and updated .env
- [ ] Set up API key restrictions in Google Cloud Console
- [ ] Reviewed and updated Firebase Security Rules
- [ ] Committed and pushed sanitized code
- [ ] Verified hardcoded keys removed from all files
- [ ] Tested application locally with new setup
- [ ] Marked GitHub security alert as resolved
- [ ] (Optional) Cleaned Git history with BFG or git-filter-repo
- [ ] Set up environment variables on production server

## 📚 Additional Resources

- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)
- [Securing Firebase API Keys](https://firebase.google.com/docs/projects/api-keys)
- [Git History Rewriting](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)

## 🆘 Need Help?

If you need assistance:
1. Check Firebase Console > Support
2. Review database.rules.json for security rules examples
3. Test locally first before deploying to production

---

**Remember**: This alert exists to protect you. Take it seriously and rotate those credentials!
