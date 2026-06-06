# ECETX Developer Reference Card

Quick lookup guide for developers extending or maintaining the application.

---

## 🎯 Quick Links

| What | File | Notes |
|------|------|-------|
| **Dark Mode** | `assets/js/theme.js` | ThemeManager class |
| **Form Validation** | `assets/js/formValidator.js` | FormValidator class (NEW) |
| **Email Service** | `assets/js/mailService.js` | MailService class (NEW) |
| **PDF Manager** | `assets/js/pdfManager.js` | PDFManager class (NEW) |
| **UI Components** | `assets/js/ui.js` | ToastManager, BranchManager |
| **Mock Data** | `assets/js/mockData.js` | Courses, tests, users |
| **Styling** | `assets/css/styles.css` | CSS variables, components |
| **Responsive** | `assets/css/responsive.css` | Mobile-first breakpoints |

---

## 📦 Classes Reference

### ThemeManager
```javascript
const theme = new ThemeManager();
theme.toggleTheme();           // Toggle dark/light
theme.setTheme('dark');        // Force theme
theme.getCurrentTheme();       // Get current theme
theme.applyTheme(theme);       // Apply theme
```

### FormValidator (NEW)
```javascript
const form = new FormValidator();
form.setupPasswordToggles();   // Setup password eye icons
form.validateEmail(email);     // Validate email format
form.submitEmail(email);       // Submit email form
```

### MailService (NEW)
```javascript
const mail = new MailService({
  apiEndpoint: '/api/mail',
  timeout: 5000,
  retryAttempts: 3
});

// Send email
await mail.sendEmail('user@example.com', 'welcome', {
  name: 'John'
});

// Process queue
await mail.processEmailQueue();

// Get queue status
mail.getQueuedEmails();

// Clear queue
mail.clearEmailQueue();
```

### PDFManager (NEW)
```javascript
const pdf = window.pdfManager;

// Get materials
pdf.getMaterialsByBranch('ece');

// Upload PDF (admin)
await pdf.uploadPDF(file, {
  course: 'Electronics',
  title: 'Chapter 1',
  chapter: 1,
  pages: 15
});

// View/Download
pdf.viewPDF(materialId);
pdf.downloadPDF(materialId);

// Get stats
pdf.getStatistics('ece');
```

### ToastManager
```javascript
ToastManager.success('Done!');
ToastManager.error('Error!');
ToastManager.warning('Watch out!');
ToastManager.info('Info message');
```

### BranchManager
```javascript
const branch = new BranchManager();
branch.getBranches();           // Get all branches
branch.getSelectedBranch();     // Get current branch
branch.setSelectedBranch('ece'); // Change branch
```

---

## 🎨 CSS Variables

```css
/* Colors */
--primary: #6366f1              /* Main brand color */
--secondary: #8b5cf6            /* Secondary accent */
--success: #10b981              /* Success state */
--danger: #ef4444               /* Error/danger */
--warning: #f59e0b              /* Warning */
--info: #0ea5e9                 /* Info */

/* Background Colors (Theme-aware) */
--bg-primary: (light: white, dark: #0f172a)
--bg-secondary: (light: #f9fafb, dark: #1e293b)
--bg-light: (light: #f3f4f6, dark: #334155)

/* Text Colors */
--text-dark: (light: #1f2937, dark: #f8fafc)
--text-light: (light: #6b7280, dark: #cbd5e1)

/* Borders & Effects */
--border-color: (light: #e5e7eb, dark: #475569)
--card-shadow: 0 1px 3px rgba(0,0,0,0.1)
--card-shadow-lg: 0 10px 30px rgba(0,0,0,0.2)

/* Transitions */
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🔗 Email Templates

```javascript
// 1. Welcome
{
  subject: 'Welcome to ECETX',
  template: 'welcome',
  data: { name: 'John Doe' }
}

// 2. Password Reset
{
  subject: 'Reset Your Password',
  template: 'password-reset',
  data: { resetLink: 'https://...' }
}

// 3. Material Available
{
  subject: 'New Study Material Available',
  template: 'material-available',
  data: {
    materialName: 'Chapter 1',
    course: 'Electronics',
    downloadLink: 'https://...'
  }
}

// 4. Test Results
{
  subject: 'Your Test Results',
  template: 'test-results',
  data: {
    testName: 'Mock Test 1',
    score: 85,
    totalScore: 100,
    rank: 42
  }
}

// 5. Newsletter
{
  subject: 'Welcome to ECETX Newsletter',
  template: 'newsletter',
  data: { subscriberName: 'John' }
}

// 6. Contact Reply
{
  subject: 'We Received Your Message',
  template: 'contact-reply',
  data: { email: 'user@example.com' }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 575px)     /* Mobile: < 576px */
@media (min-width: 576px)     /* SM: ≥ 576px */
@media (min-width: 768px)     /* MD: ≥ 768px */
@media (min-width: 992px)     /* LG: ≥ 992px */
@media (min-width: 1200px)    /* XL: ≥ 1200px */
```

---

## 🌐 API Integration Points

### Auth Endpoint
```javascript
POST /api/auth/login
{
  email: 'user@example.com',
  password: 'password123'
}

// Response
{
  success: true,
  token: 'jwt_token_here',
  user: { id: 1, email: '...', branch: 'ece' }
}
```

### Email Endpoint
```javascript
POST /api/mail
{
  to: 'user@example.com',
  templateId: 'welcome',
  data: { name: 'John' }
}

// Response
{
  success: true,
  messageId: 'msg_12345'
}
```

### Courses Endpoint
```javascript
GET /api/courses?branch=ece

// Response
{
  success: true,
  courses: [
    {
      id: 1,
      title: 'Digital Electronics',
      branch: 'ece',
      chapters: 12
    }
  ]
}
```

---

## 💾 localStorage Keys

```javascript
// Theme
localStorage.getItem('theme')                    // 'light' or 'dark'

// User
localStorage.getItem('user-email')
localStorage.getItem('user-name')

// Branch
localStorage.getItem('ecetx-selected-branch')    // 'ece', 'eee', etc.

// Email Queue
localStorage.getItem('email-queue')              // JSON string

// PDF Materials
localStorage.getItem(`pdf-${branchId}`)         // Base64 encoded

// Admin Mode
localStorage.getItem('admin-mode')               // 'true' or 'false'

// Preferences
localStorage.getItem('user-preferences')         // JSON string
```

---

## 🔧 Common Customizations

### Change Primary Color
```css
/* In styles.css */
--primary: #your-color-here;   /* e.g., #FF6B6B */
```

### Add Custom Theme
```javascript
// In theme.js, add to initializeThemes()
const customTheme = {
  primary: '#...',
  secondary: '#...',
  // ... other colors
};
```

### Create New Email Template
```javascript
// In mailService.js, add to emailTemplates object
'custom-email': {
  subject: 'Your Subject',
  html: `<h1>Hello {{name}}</h1><p>Custom content</p>`
}
```

### Add Form Validation
```javascript
// In formValidator.js, add method
validateCustomField(field) {
  // validation logic
}
```

---

## 🐛 Debugging Tips

### Check Theme
```javascript
// Console
localStorage.getItem('theme')
document.documentElement.getAttribute('data-theme')
```

### Check Email Queue
```javascript
window.mailService.getQueuedEmails()
```

### Check PDF Materials
```javascript
window.pdfManager.getMaterialsByBranch('ece')
```

### Check Selected Branch
```javascript
localStorage.getItem('ecetx-selected-branch')
```

### Check Form Validation
```javascript
new FormValidator().validateEmail('test@example.com')
```

---

## 📊 File Sizes

| File | Size | Purpose |
|------|------|---------|
| styles.css | ~15KB | Main styling |
| responsive.css | ~8KB | Mobile styles |
| theme.js | ~3KB | Dark mode |
| ui.js | ~5KB | UI utilities |
| mockData.js | ~8KB | Mock database |
| formValidator.js | ~7KB | Form validation |
| mailService.js | ~9KB | Email service |
| pdfManager.js | ~8KB | PDF management |

**Total JS/CSS:** ~63KB (minified: ~25KB)

---

## 🚀 Performance Tips

1. **Lazy Load Components**
   ```javascript
   fetch('components/navbar.html').then(r => r.text())
   ```

2. **Cache API Responses**
   ```javascript
   const cache = {};
   if (!cache.courses) cache.courses = await fetch('/api/courses');
   ```

3. **Debounce Email Queue**
   ```javascript
   setTimeout(() => mailService.processEmailQueue(), 1000);
   ```

4. **Minimize DOM Manipulation**
   ```javascript
   // Batch updates
   const fragment = document.createDocumentFragment();
   // ... add elements to fragment
   parent.appendChild(fragment);
   ```

5. **Use CSS Variables**
   ```css
   /* Instead of duplicating colors */
   background: var(--primary);
   ```

---

## 🔒 Security Checklist

- [ ] No hardcoded credentials
- [ ] Input validation on all forms
- [ ] No innerHTML with user input
- [ ] Password fields properly masked
- [ ] HTTPS for production
- [ ] CORS headers configured
- [ ] API rate limiting enabled
- [ ] XSS protection active
- [ ] CSRF tokens implemented

---

## 📝 Code Style Guide

```javascript
// Class names - PascalCase
class FormValidator { }

// Function names - camelCase
function setupPasswordToggles() { }

// Constants - UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 1000000;

// Private methods - _camelCase
_initializeSystem() { }

// Comments - Clear and concise
// Send email using template
```

---

## 🎓 Learning Resources

- **MDN Web Docs** - https://developer.mozilla.org
- **CSS Variables** - https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Fetch API** - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **localStorage** - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Bootstrap 5** - https://getbootstrap.com/docs/5.0

---

## 🔗 Quick Commands

```bash
# Start local server
python -m http.server 8000

# Open browser
http://localhost:8000

# Clear localStorage (in console)
localStorage.clear()

# Enable admin mode (in console)
localStorage.setItem('admin-mode', 'true'); location.reload()

# Check theme
localStorage.getItem('theme')

# Process email queue (in console)
window.mailService.processEmailQueue()
```

---

## 📞 Support Checklist

- [ ] Checked console for errors (F12)
- [ ] Tested in incognito mode
- [ ] Cleared browser cache
- [ ] Verified server is running
- [ ] Checked localStorage is enabled
- [ ] Tested in different browser
- [ ] Reviewed relevant documentation
- [ ] Checked network requests (DevTools)

---

## 🎯 Deployment Checklist

- [ ] All console errors fixed
- [ ] Performance optimized (Lighthouse > 90)
- [ ] Mobile responsive verified
- [ ] Dark mode tested
- [ ] Email service configured
- [ ] API endpoints verified
- [ ] Security review completed
- [ ] Accessibility tested (WCAG AA)
- [ ] Cross-browser tested
- [ ] Final QA completed

---

**Version:** 1.0.1  
**Last Updated:** January 2024  
**For Quick Reference - Bookmark This!** 📌
