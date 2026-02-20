# 🔐 Admin Access Guide - For Officers Only

## Accessing the Admin Dashboard

The admin dashboard is **password-protected** and only accessible to authorized club officers.

### How to Access

1. Navigate to the admin page by:
   - Clicking the "🔐 Admin" link in the navigation bar (dimmed/subtle link)
   - Or directly visiting: `https://your-site.web.app/admin.html`

2. You will see a secure login screen with:
   - 🔐 Lock icon
   - Username and password fields
   - Security encryption badge

### Default Login Credentials

**⚠️ IMPORTANT: Change these passwords immediately in production!**

**Officer Accounts (Based on NLC STEM Club Constitution):**

**Account 1 - President:**
- **Username:** `president`
- **Password:** `nlcstem2026`

**Account 2 - Vice President:**
- **Username:** `vicepresident`
- **Password:** `nlcstem2026`

**Account 3 - Treasurer:**
- **Username:** `treasurer`
- **Password:** `nlcstem2026`

**Account 4 - Secretary:**
- **Username:** `secretary`
- **Password:** `nlcstem2026`

**Backup Admin Account:**
- **Username:** `admin`
- **Password:** `stemadmin2026`

### Changing Passwords

To update passwords for production use:

1. Open `static/js/admin-secure.js`
2. Find the `ADMIN_CREDENTIALS` object at the top:
   ```javascript
   const ADMIN_CREDENTIALS = {
       'president': 'nlcstem2026',
       'vicepresident': 'nlcstem2026',
       'treasurer': 'nlcstem2026',
       'secretary': 'nlcstem2026',
       'admin': 'stemadmin2026'
   };
   ```
3. Change the passwords to strong, unique values
4. Add additional officer accounts as needed
5. Rebuild and redeploy: `python build.py && firebase deploy`

## Security Features

### Session Management
- Sessions expire after **2 hours** of inactivity
- Stored securely in browser sessionStorage
- Automatic logout on session expiry

### Audit Logging
- All admin activities are logged including:
  - Login attempts (successful and failed)
  - Dashboard access
  - View changes
  - Data exports
  - Security events
- Audit logs can be downloaded as CSV

### Data Protection
- All sensitive data displays are restricted to logged-in admins
- Email addresses are hashed for privacy
- IP addresses are anonymized
- Data exports require active authentication

## Admin Dashboard Sections

### 📊 Overview
- Total attendance, RSVPs, and messages
- Attendance trend chart (last 7 days)
- Year level distribution chart
- Average attendance per meeting

### 📋 Attendance
- Full table of all attendance records
- Search/filter by name or student ID
- Export to CSV or JSON
- View timestamps and year levels

### 🎟️ RSVPs
- Event registration data
- Filter by event or attendee
- Export capabilities
- Guest count tracking

### 💬 Messages
- Contact form submissions
- Search messages
- Export for follow-up

### 🛡️ Security
- Live system status monitoring
- 256-bit encryption indicator
- Login attempt tracking
- Data access audit logs
- Privacy settings overview
- Data purge tools (delete records older than 1 year)

## Best Practices

1. **Never Share Credentials**
   - Keep admin passwords confidential
   - Only share with authorized officers

2. **Change Default Passwords**
   - Update immediately after deployment
   - Use strong, unique passwords

3. **Regular Audits**
   - Review audit logs regularly
   - Monitor for suspicious activity

4. **Data Privacy**
   - Only export data when necessary
   - Store exports securely
   - Delete old data annually

5. **Logout When Done**
   - Always click "Logout" button
   - Don't leave dashboard open on shared computers

## Troubleshooting

**Can't login?**
- Check username and password spelling
- Try clearing browser cache
- Ensure JavaScript is enabled

**Session expired?**
- Sessions last 2 hours
- Simply log in again

**Data not loading?**
- Check Firebase configuration in `static/js/firebase-config.js`
- Verify Firebase database rules allow read access

**Charts not displaying?**
- Ensure Chart.js CDN is accessible
- Check browser console for errors

## Contact

For technical issues or password resets, contact the web administrator or club tech lead.

---

**Security Level:** Restricted to Officers
**Last Updated:** February 2026
