# ECETX Testing & Verification Guide

## 🚀 Quick Start

### 1. Start Local Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (install if needed: npm install -g http-server)
npx http-server
```

### 2. Open in Browser
```
http://localhost:8000
```

---

## ✅ Component Testing

### Form Validation Testing

#### Email Validation (Login/Register/Forgot Password Pages)
1. Go to **login.html**
2. Enter email in the email field
3. **Expected:** 
   - Invalid emails show ❌ red border
   - Valid emails show ✅ green border
   - Real-time feedback as you type
4. Try these test emails:
   - ✅ Valid: `user@example.com`, `test@domain.co.uk`
   - ❌ Invalid: `invalid`, `@example.com`, `user@`

#### Password Toggle (All Auth Pages)
1. Go to **login.html** or **register.html**
2. Focus on password field
3. **Expected:** Eye icon appears on right side of input
4. Click eye icon
5. **Expected:** 
   - Password becomes visible text
   - Icon changes appearance (👁️ → 🙈)
   - Can toggle back and forth

#### Password Confirmation (Register Page)
1. Go to **register.html**
2. Enter password and confirm password
3. **Expected:**
   - Errors if passwords don't match
   - Success message if they match
   - Form prevents submission if invalid

### Email Service Testing

#### Contact Form (contact.html)
1. Go to **contact.html**
2. Fill in the contact form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Subject: `Test Subject`
   - Message: `This is a test message`
3. Click **Send Message**
4. **Expected:**
   - "Sending message..." toast appears
   - Success notification after submission
   - Form clears after submission
   - Check browser console for email queue status

#### Email Queue Status
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Enter:
   ```javascript
   window.mailService.getQueuedEmails()
   ```
4. **Expected:** Array of pending emails (if offline or API unavailable)

#### Test Offline Email Queue
1. Disable internet or use offline mode (DevTools → Network → Offline)
2. Submit contact form
3. **Expected:** Email gets queued in localStorage
4. Re-enable internet
5. Reload page
6. **Expected:** Email queue processes automatically (console message: "Processing queued emails")

### PDF Management Testing

#### View Study Materials (study-materials.html)
1. Go to **study-materials.html**
2. **Expected:**
   - See statistics: Total Materials, Available, Pending
   - See study materials list with:
     - Material title and course
     - Status badge (Available or Coming Soon)
     - Pages count, file size, upload date
     - View, Download, Share buttons

#### Filter Materials by Course
1. On **study-materials.html**
2. Use the "Filter by Course" dropdown
3. Select a course
4. **Expected:** List filters to show only materials from that course

#### Test Material Actions
1. Click **Share** button on any material
2. **Expected:** "Link copied to clipboard" notification
3. Click **View** button (if Available)
4. **Expected:** PDF would open in new tab (currently demo)
5. Click **Download** button (if Available)
6. **Expected:** PDF would download (currently demo)

### Admin Panel Testing

#### Enable Admin Mode
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Enter:
   ```javascript
   localStorage.setItem('admin-mode', 'true');
   location.reload();
   ```
4. Go to **study-materials.html**
5. **Expected:** Upload form appears at bottom

#### Upload PDF (Admin)
1. Admin mode enabled (see above)
2. Fill upload form:
   - Course Title: `Digital Electronics`
   - Material Title: `Chapter 1: Binary Numbers`
3. Select a PDF file
4. Click **Upload Material**
5. **Expected:**
   - Success notification
   - Materials list updates
   - New material appears in the list

---

## 📱 Responsive Design Testing

### Mobile Testing (320px - 480px)
1. Open any page
2. Press F12 (DevTools)
3. Click device icon (mobile view)
4. Select **iPhone 12** or similar
5. **Expected:**
   - Layout is single column
   - Navigation is touch-friendly
   - No horizontal scrolling
   - Buttons are easily tappable (min 44x44px)

### Tablet Testing (768px - 1024px)
1. Select **iPad** in DevTools
2. **Expected:**
   - 2-column layout where applicable
   - Sidebar visible
   - Cards arranged in grid

### Desktop Testing (1200px+)
1. Set viewport width to 1400px
2. **Expected:**
   - Full layout displayed
   - Multi-column grids
   - All features visible

### Test on Different Browsers
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🌙 Dark Mode Testing

### Toggle Dark Mode
1. Open any page
2. Look for theme toggle button (usually in top navbar)
3. Click to switch between light and dark modes
4. **Expected:**
   - Smooth transition between themes
   - All elements properly colored
   - Text readable in both modes
   - No white text on white background

### Dark Mode Persistence
1. Enable **Dark Mode**
2. Reload the page
3. **Expected:** Dark mode still active
4. Close and reopen browser tab
5. **Expected:** Dark mode still active
6. Try another page
7. **Expected:** Dark mode applied everywhere

### Test Dark Mode on Each Page
- [ ] index.html
- [ ] login.html
- [ ] register.html
- [ ] dashboard.html
- [ ] learn.html
- [ ] practice.html
- [ ] mock-tests.html
- [ ] profile.html
- [ ] settings.html
- [ ] study-materials.html
- [ ] contact.html

---

## 🧭 Navigation Testing

### Test All Links Work
1. From **index.html**, click all navigation links
2. **Expected:** All pages load without errors
3. Each page should have:
   - Navbar with theme toggle
   - Proper styling
   - No broken content

### Test Branch Selector
1. Go to **dashboard.html**
2. Click branch selector (usually in sidebar)
3. Change branch (e.g., ECE → EEE)
4. **Expected:**
   - Content updates for new branch
   - Selection persists on reload
   - Courses/subjects match selected branch

### Test Back Navigation
1. On any page with back button
2. Click back or browser back arrow
3. **Expected:** Previous page loads correctly

---

## 🧪 Performance Testing

### Check Page Load Time
1. Open DevTools (F12)
2. Go to **Network** tab
3. Reload page
4. **Expected:**
   - Total size < 500KB
   - Load time < 3 seconds
   - No failed requests (red items)

### Check for Console Errors
1. Open DevTools (F12)
2. Go to **Console** tab
3. **Expected:** No red error messages
4. Small yellow warnings are okay

### Test Performance on 3G
1. Open DevTools (F12)
2. Go to **Network** tab
3. Click throttling dropdown (usually says "No throttling")
4. Select "Slow 3G"
5. Reload page
6. **Expected:**
   - Page still loads (may take 10-20s)
   - Elements load progressively
   - No complete failures

---

## 🔒 Security Testing

### Check No Sensitive Data in Console
1. Open DevTools Console
2. Check localStorage:
   ```javascript
   localStorage
   ```
3. **Expected:** No passwords, API keys, or tokens visible

### Test Form Security
1. Go to **login.html**
2. Open DevTools Network tab
3. Enter credentials
4. Submit form
5. **Expected:** No passwords visible in network requests (will show when connected to backend)

### Test XSS Prevention
1. Go to any form (contact.html)
2. Try entering: `<script>alert('xss')</script>` in a field
3. **Expected:** No alert appears; treated as text

---

## 📊 Data & Functionality Testing

### Dashboard Features
1. Go to **dashboard.html**
2. **Expected:**
   - Study streak displays
   - Progress bars show completion
   - Recent activities listed
   - Statistics display correctly

### Mock Tests
1. Go to **mock-tests.html**
2. **Expected:** Multiple mock tests listed
3. Click on a test
4. Go to **test-interface.html**
5. **Expected:**
   - Timer counts down
   - Questions load
   - Answer options display
   - Question palette updates

### Leaderboard
1. Go to **leaderboard.html**
2. **Expected:**
   - User rankings displayed
   - Sorted by score/rank
   - Pagination works

### Profile Page
1. Go to **profile.html**
2. **Expected:**
   - User information displays
   - Badges/achievements show
   - Edit options available

---

## 🎯 Checklist - Complete Verification

### HTML Pages (20 pages)
- [ ] index.html - Loads and displays correctly
- [ ] login.html - Form validation works
- [ ] register.html - Password toggle and email validation work
- [ ] forgot-password.html - Email service integration works
- [ ] dashboard.html - Statistics display, branch selector works
- [ ] learn.html - Courses load by branch
- [ ] subjects.html - Subjects display correctly
- [ ] topic-view.html - Topic content loads
- [ ] practice.html - Practice problems display
- [ ] mock-tests.html - Test listing works
- [ ] test-interface.html - Timer, questions, palette work
- [ ] ai-tutor.html - Chat interface works
- [ ] rank-predictor.html - Form submits successfully
- [ ] leaderboard.html - Rankings display
- [ ] profile.html - User data displays
- [ ] settings.html - Settings load and save
- [ ] contact.html - Email service integration works
- [ ] about.html - Content displays
- [ ] previous-papers.html - Papers list displays
- [ ] study-materials.html - Materials display and filter works

### Features
- [ ] Dark mode toggle works
- [ ] Dark mode persists on reload
- [ ] Email validation shows visual feedback
- [ ] Password toggle shows/hides text
- [ ] Contact form sends emails
- [ ] Email queue works offline
- [ ] PDF materials display correctly
- [ ] Branch selector works
- [ ] Navigation between pages works
- [ ] Responsive design works on mobile/tablet/desktop

### Performance
- [ ] No console errors
- [ ] Page loads in < 3 seconds
- [ ] Works on 3G network
- [ ] No broken images or assets

### Browser Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile browsers

---

## 🐛 Troubleshooting

### "Console errors appear"
1. Check if all JS files are loaded
2. Verify CDN links are working
3. Check for typos in script includes

### "Password toggle not working"
1. Verify formValidator.js is loaded
2. Check input has class `.password-input`
3. Ensure input's parent has `position: relative`

### "Email not sending"
1. Check if `/api/mail` endpoint is configured
2. Verify mailService.js is loaded
3. Check browser console for queue status
4. Verify internet connection

### "Dark mode not saving"
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Verify theme.js is loaded
4. Check browser allows localStorage

### "Pages not loading"
1. Verify all HTML files exist
2. Check file paths in links
3. Verify server is running on correct port
4. Clear browser cache

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for error messages
2. Test in incognito/private mode
3. Clear browser cache and cookies
4. Try different browser
5. Verify all files are in correct locations

---

**Last Updated:** January 2024  
**Version:** 1.0.1
