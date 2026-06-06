# 🎓 ECETX - Premium Learning Platform Frontend

A production-ready, fully responsive EdTech web application built with vanilla HTML5, Bootstrap 5, CSS3, and Vanilla JavaScript. No frameworks - just pure modern web technologies.

## 📋 Project Overview

**ECETX** is a comprehensive learning platform designed specifically for AP ECET diploma students. It provides:

- **18+ Pages** - Complete user journey from homepage to advanced testing
- **Dark Mode** - Persistent theme with localStorage
- **Fully Responsive** - Mobile-first design for all devices
- **Interactive Features** - Mock tests, practice problems, AI tutor, rank predictor
- **Professional UI** - Glassmorphism, smooth animations, modern gradients
- **Production Ready** - Optimized for performance and SEO

## 🎯 Key Features

### 📚 Learning Management
- Browse and enroll in courses by branch
- Structured topic-wise learning paths
- Progress tracking and analytics
- Study streaks and badges

### 📝 Assessment & Testing
- Full-length mock tests (100 questions, 2.5 hours)
- Question palette with answer tracking
- Live timer and progress monitoring
- Detailed solution analytics
- Previous year papers and solutions

### 🤖 Intelligence Features
- AI-powered tutor (24/7 support)
- Rank predictor based on performance
- Performance analytics dashboard
- Leaderboard with rankings

### 👤 User Management
- User authentication (login/register)
- Complete profile management
- Badges and achievements system
- Settings and preferences
- Privacy controls

### 🎨 Design Features
- Dark mode + Light mode with persistence
- Glassmorphic card designs
- Premium animations and transitions
- Mobile-optimized navigation
- Accessibility-first approach

## 📁 Folder Structure

```
ECETX/
├── index.html                 # Homepage
├── login.html                 # Login page
├── register.html              # Registration page
├── forgot-password.html       # Password recovery
├── dashboard.html             # Main dashboard
├── learn.html                 # Course listing
├── subjects.html              # Subject explorer
├── topic-view.html            # Topic details
├── practice.html              # Practice problems
├── mock-tests.html            # Mock test listing
├── test-interface.html        # Test taking interface
├── ai-tutor.html              # AI chat interface
├── rank-predictor.html        # Rank prediction tool
├── leaderboard.html           # Rankings and leaderboard
├── profile.html               # User profile
├── settings.html              # User settings
├── contact.html               # Contact form
├── about.html                 # About page
├── previous-papers.html       # Previous year papers
│
├── components/
│   ├── navbar.html            # Reusable navbar component
│   ├── sidebar.html           # Branch selector sidebar
│   └── footer.html            # Reusable footer component
│
├── assets/
│   ├── css/
│   │   ├── styles.css         # Main stylesheet
│   │   ├── responsive.css     # Mobile-first responsive styles
│   │   └── animations.css     # Animation library
│   │
│   ├── js/
│   │   ├── theme.js           # Dark mode manager
│   │   ├── ui.js              # UI utilities & managers
│   │   ├── home.js            # Homepage logic
│   │   └── mockData.js        # Mock data & utilities
│   │
│   ├── images/                # Image assets
│   │   └── (placeholder for future images)
│   │
│   └── data/
│       ├── mockData.js        # Mock database
│       ├── courses.json       # Course data
│       └── users.json         # User data
│
└── docs/
    ├── README.md              # This file
    └── SETUP.md               # Setup instructions
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required
- Simple HTTP server for local development

### Installation

1. **Clone or Download the project**
```bash
git clone <repository-url>
cd ECETX
```

2. **Run a local server** (choose one)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server)
npx http-server

# Using VS Code
# Install "Live Server" extension and use "Go Live"
```

3. **Open in browser**
```
http://localhost:8000
```

## 📖 Technology Stack

### Frontend Technologies
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, Animations, Gradients
- **Bootstrap 5** - CDN-based responsive framework
- **Vanilla JavaScript** - No frameworks or libraries

### Styling Features
- **CSS Variables** - Dynamic theming
- **Glassmorphism** - Modern frosted glass effect
- **Animations** - Smooth transitions and keyframes
- **Responsive Grid** - Mobile-first CSS Grid
- **Dark Mode** - localStorage persistence

### JavaScript Patterns
- **Class-based OOP** - Theme, Branch, Navigation managers
- **Event-driven** - Custom events for branch changes
- **Fetch API** - Component loading
- **LocalStorage** - Theme and user preferences
- **DOM manipulation** - Dynamic content rendering

## 🎨 Design System

### Color Palette (CSS Variables)
```css
--primary: #6366f1        /* Indigo */
--secondary: #8b5cf6      /* Purple */
--success: #10b981        /* Emerald */
--danger: #ef4444         /* Red */
--warning: #f59e0b        /* Amber */
--info: #0ea5e9           /* Cyan */
```

### Spacing Scale
- Small: 0.5rem
- Medium: 1rem
- Large: 1.5rem
- Extra: 2rem

### Typography
- Primary Font: System fonts (Apple, Segoe UI)
- Font Sizes: 0.75rem to 3.5rem
- Font Weights: 400, 500, 600, 700, 800

## 🔧 Key Components

### 1. ThemeManager (assets/js/theme.js)
Manages dark/light mode with localStorage persistence.

```javascript
const themeManager = new ThemeManager();
themeManager.toggleTheme();
themeManager.getCurrentTheme();
```

### 2. BranchManager (assets/js/ui.js)
Handles branch selection and course filtering.

```javascript
const branchManager = new BranchManager();
branchManager.setSelectedBranch('ece');
```

### 3. NavigationManager (assets/js/ui.js)
Manages page navigation and active states.

```javascript
const navManager = new NavigationManager();
navManager.navigateTo('dashboard.html');
```

### 4. ToastManager (assets/js/ui.js)
Non-intrusive notifications system.

```javascript
ToastManager.success('Course enrolled successfully!');
ToastManager.error('An error occurred');
```

## 📊 Mock Data Structure

### Branches
```javascript
{
  id: 'ece',
  name: 'Electronics & Communication Engineering',
  icon: '📡',
  color: '#FF6B6B'
}
```

### Courses
```javascript
{
  id: 1,
  title: 'Digital Electronics Fundamentals',
  branch: 'ece',
  chapters: 12,
  duration: '24 hrs',
  rating: 4.8,
  progress: 65
}
```

### Mock Tests
```javascript
{
  id: 1,
  title: 'Digital Electronics - Full Mock Test 1',
  branch: 'ece',
  totalQuestions: 100,
  duration: 120,
  totalMarks: 300
}
```

## 🔐 Security Considerations

- No sensitive data in localStorage
- No API credentials exposed
- Input validation on forms
- XSS prevention (no innerHTML with user input)
- CSRF tokens ready for backend integration

## 📱 Responsive Breakpoints

```css
Mobile:     < 480px
Tablet:     480px - 768px
Laptop:     768px - 1200px
Desktop:    > 1200px
```

## 🆕 Email Service & Form Validation (v1.0.1)

### Email Service Implementation

The application now includes a complete email service with offline support and template-based messaging.

#### Key Features
- ✅ 6 pre-configured email templates
- ✅ Offline queue system (localStorage)
- ✅ Automatic retry on reconnection
- ✅ Bulk email support
- ✅ Template interpolation

#### Email Templates Available
1. **welcome** - New user welcome
2. **password-reset** - Password reset with link
3. **material-available** - Study material notification
4. **test-results** - Mock test results
5. **newsletter** - Newsletter subscription
6. **contact-reply** - Contact form confirmation

#### Usage Example
```javascript
// Send welcome email
await window.mailService.sendEmail(
  'user@example.com',
  'welcome',
  { name: 'John Doe' }
);

// Send password reset
await window.mailService.sendEmail(
  'user@example.com',
  'password-reset',
  { resetLink: 'https://ecetx.com/reset?token=xyz' }
);
```

#### Backend Integration
Configure your `/api/mail` endpoint:
```javascript
window.mailService = new MailService({
  apiEndpoint: 'https://api.ecetx.com/mail',
  timeout: 10000,
  retryAttempts: 3
});
```

### Form Validation System

Complete client-side validation with real-time feedback.

#### Password Toggle Feature
- 👁️ Eye icon to show/hide password
- Animated toggle with visual feedback
- Works on all auth pages
- Mobile-friendly

#### Email Validation
- Real-time validation with regex
- Visual indicators (✅ valid, ❌ invalid)
- Border color changes (green/red)
- Confirmation on blur event

#### Implementation
```javascript
// Auto-initializes on auth pages
const formValidator = new FormValidator();
formValidator.setupPasswordToggles();

// Manual validation
const isValid = formValidator.validateEmail('user@example.com');
```

### PDF Management System

Complete study materials management with branch-based organization.

#### Features
- 📚 Branch-specific material organization
- 📄 PDF upload/download functionality
- 👁️ PDF viewer integration
- 📊 Material statistics and filtering
- 🔒 Admin-only upload capabilities

#### Materials Page
New `study-materials.html` page provides:
- Material listing by course
- Course-based filtering
- Download and view options
- Material sharing via link
- Admin upload panel

#### Usage
```javascript
// Get materials for a branch
const materials = window.pdfManager.getMaterialsByBranch('ece');

// View PDF
pdfManager.viewPDF('material-id');

// Download PDF
pdfManager.downloadPDF('material-id');

// Get statistics
const stats = pdfManager.getStatistics('ece');
```

### Integration Points

All authentication pages now use email validation and password toggle:
- login.html
- register.html
- forgot-password.html

Contact form integrated with email service:
- contact.html - Sends emails to admin and user confirmation

## 🔗 Files Modified/Added

### New Files
- `assets/js/formValidator.js` - Form validation & password toggle
- `assets/js/mailService.js` - Email service with templates
- `assets/js/pdfManager.js` - PDF management system
- `study-materials.html` - Study materials page

### Modified Files
- `contact.html` - Integrated with mailService
- `assets/css/styles.css` - Added form validation styles

### Configuration

#### Enable Admin Mode (Development)
```javascript
localStorage.setItem('admin-mode', 'true');
```

#### Email Queue Status
```javascript
// Check queued emails
const queue = window.mailService.getQueuedEmails();
console.log(`${queue.length} emails pending`);

// Process queue manually
await window.mailService.processEmailQueue();
```

### Testing Checklist

#### Form Validation
- [ ] Password toggle shows/hides text
- [ ] Eye icon changes on toggle
- [ ] Email validation shows visual feedback
- [ ] Form prevents submission with invalid data
- [ ] Works on mobile browsers

#### Email Service
- [ ] Contact form sends emails
- [ ] Registration sends welcome email
- [ ] Password reset sends email
- [ ] Emails queue when offline
- [ ] Queue processes on reconnect

#### PDF System
- [ ] Materials display correctly
- [ ] Filtering by course works
- [ ] Download functionality works
- [ ] Admin upload works
- [ ] Statistics display accurately

---



## 🔗 Backend Integration Ready

The application is designed for seamless backend integration:

1. **API Endpoints to Implement**
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/courses`
   - `/api/mockTests`
   - `/api/profile`

2. **Data Flow**
   - Replace mockData.js with API calls
   - Update localStorage to sessionStorage for auth tokens
   - Implement error handling for API failures

3. **Recommended Backend Stack**
   - Node.js + Express
   - Supabase for real-time features
   - PostgreSQL for data persistence

## 📝 Pages Overview

### Authentication (3 pages)
- **login.html** - User login
- **register.html** - User registration
- **forgot-password.html** - Password recovery

### Learning (7 pages)
- **learn.html** - Course discovery
- **subjects.html** - Subject listing
- **topic-view.html** - Topic details
- **practice.html** - Practice problems
- **previous-papers.html** - Past papers

### Testing (3 pages)
- **mock-tests.html** - Test listing
- **test-interface.html** - Full test environment
- **test-results.html** - Results and analysis

### User Features (5 pages)
- **dashboard.html** - Personal dashboard
- **profile.html** - User profile
- **settings.html** - User preferences
- **ai-tutor.html** - AI assistant
- **rank-predictor.html** - Rank estimation

### Information (3 pages)
- **about.html** - About platform
- **contact.html** - Contact form
- **leaderboard.html** - Rankings

## 🎓 Educational Features

### Progress Tracking
- Course completion percentage
- Topics marked complete
- Study streak counter
- Performance metrics

### Gamification
- Badges for achievements
- Leaderboard rankings
- Study streaks
- Points system

### Analytics
- Test performance analysis
- Accuracy percentage
- Weak topics identification
- Study hour tracking

## 🚀 Performance Optimization

- Minimal CSS (only used classes)
- No unused Bootstrap features
- Lazy loading components
- Optimized animations (GPU accelerated)
- Efficient DOM manipulation

## 📄 License

This project is provided as a complete frontend solution for educational purposes.

## 👥 Support

For issues or suggestions:
1. Check existing documentation
2. Review component code comments
3. Test in different browsers
4. Verify localStorage is enabled

---

**Built with ❤️ for ECET Students**

Version: 1.0.0
Last Updated: 2024

---
