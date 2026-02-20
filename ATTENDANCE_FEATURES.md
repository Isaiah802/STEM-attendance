# Enhanced Attendance Features

## New Features

### 1. **Admin Mode** 🔐
Officers can now access Admin Mode to add attendance entries with enhanced capabilities:

**How to Access:**
1. Go to the attendance page
2. Click the "⚙️ Admin Mode" button in the top-right of the form
3. Enter any officer password:
   - President: `stem2026pres`
   - Vice President: `stem2026vp`
   - Treasurer: `stem2026treas`
   - Secretary: `stem2026sec`
   - Admin: `stem2026admin`

**Admin Mode Capabilities:**
- ✅ Add attendance for **past dates/times** (backdate entries)
- ✅ Specify custom **meeting types** (Workshop, Project Session, Social Event, etc.)
- ✅ Add **admin notes** for record-keeping
- ✅ Automatic admin badge on entries for tracking
- ✅ Quick-reset after each entry for batch processing

### 2. **Date & Time Selection** 📅
When Admin Mode is active:
- Select any past date and time for the attendance entry
- System automatically prevents **future dates**
- Defaults to current time for convenience
- Perfect for adding missed attendees from earlier meetings

### 3. **Meeting Type Classification** 📋
Track different types of club activities:
- **General Meeting** (default)
- **Workshop** (hands-on technical sessions)
- **Project Session** (working on club projects)
- **Social Event** (team building, social gatherings)
- **Competition Prep** (preparing for competitions)
- **Guest Speaker** (special presentations)
- **Other** (custom events)

### 4. **Admin Notes** 📝
- Add optional notes to any attendance entry
- Useful for special circumstances or reminders
- Visible in admin dashboard with 📝 icon
- Hover over icon to see the full note

### 5. **Enhanced Data Display** 📊

**Recent Sign-Ins Section:**
- Shows meeting type badges for non-general meetings
- Displays "⚙️ Admin" badge for admin-entered entries
- Better visual indicators for different entry types

**Admin Dashboard:**
- New "Meeting Type" column in attendance table
- Visual badges for special meeting types
- Admin entry indicators
- Notes icon with hover tooltip
- Full timestamp display (date + time)

## Data Structure

Each attendance record now includes:
```json
{
  "name": "Student Name",
  "id": "Student ID",
  "email": "email@university.edu",
  "emailHash": "privacy hash",
  "yearLevel": "Junior",
  "timestamp": "2026-02-19T14:30:00.000Z",
  "date": "2/19/2026",
  "meetingType": "Workshop",
  "addedBy": "Officer (Admin Mode)" | "Self Sign-In",
  "adminNotes": "Optional notes here",
  "ipAddress": "hidden",
  "userAgent": "browser info"
}
```

## Use Cases

### Use Case 1: Adding Missed Sign-In
A member attended but forgot to sign in, or the system was down:
1. Enable Admin Mode with officer password
2. Select the date/time of the actual meeting
3. Enter member's information
4. Select meeting type (e.g., "Workshop")
5. Add note: "Added after meeting - member confirmed attendance"
6. Submit

### Use Case 2: Batch Entry from Sign-In Sheet
You have a paper sign-in sheet to enter:
1. Enable Admin Mode
2. Set date/time to when the meeting occurred
3. Select appropriate meeting type
4. Enter each attendee (form auto-resets after submission)
5. System marks all as admin entries for tracking

### Use Case 3: Different Meeting Types
Track attendance across different activity types:
- General meetings: Default setting
- Workshops: Select "Workshop" type
- Social events: Select "Social Event" type
- Competition days: Select "Competition Prep" type

This helps analyze attendance patterns by activity type.

## Privacy & Security

✅ **Admin Mode is password-protected** - Only officers can access
✅ **All entries are tracked** - Admin badge shows who added what
✅ **Audit trail maintained** - Dashboard tracks all admin actions
✅ **Cannot backdate to future** - System prevents invalid dates
✅ **Email privacy preserved** - Hashed in database
✅ **Notes are private** - Only visible in admin dashboard

## Tips for Officers

1. **Use Admin Mode Responsibly**: Always add accurate information
2. **Add Notes**: Explain why you're backdating (e.g., "System was offline")
3. **Check Timestamps**: Recent sign-ins show when entries were actually made
4. **Meeting Types**: Use consistently for better analytics
5. **Batch Processing**: Admin mode auto-resets form for quick consecutive entries

## Questions?

Contact the club tech team or check the Admin Dashboard for more features!
