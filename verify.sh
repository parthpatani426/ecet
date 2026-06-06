#!/usr/bin/env bash
# ECETX Application Verification Script
# This script helps verify all components are working correctly

echo "🔍 ECETX Application Verification"
echo "=================================="
echo ""

# Check HTML files
echo "📄 Checking HTML Files..."
html_files=(
  "index.html"
  "login.html"
  "register.html"
  "forgot-password.html"
  "dashboard.html"
  "learn.html"
  "subjects.html"
  "topic-view.html"
  "practice.html"
  "mock-tests.html"
  "previous-papers.html"
  "ai-tutor.html"
  "rank-predictor.html"
  "leaderboard.html"
  "profile.html"
  "settings.html"
  "contact.html"
  "about.html"
  "study-materials.html"
)

for file in "${html_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - MISSING"
  fi
done

echo ""
echo "📁 Checking Component Files..."
components=("components/navbar.html" "components/sidebar.html" "components/footer.html")
for file in "${components[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - MISSING"
  fi
done

echo ""
echo "🎨 Checking CSS Files..."
css_files=("assets/css/styles.css" "assets/css/responsive.css")
for file in "${css_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - MISSING"
  fi
done

echo ""
echo "⚙️ Checking JavaScript Files..."
js_files=(
  "assets/js/theme.js"
  "assets/js/ui.js"
  "assets/js/mockData.js"
  "assets/js/formValidator.js"
  "assets/js/mailService.js"
  "assets/js/pdfManager.js"
)
for file in "${js_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - MISSING"
  fi
done

echo ""
echo "✅ Verification Complete!"
echo ""
echo "To start the application:"
echo "  1. Python 3:   python -m http.server 8000"
echo "  2. Python 2:   python -m SimpleHTTPServer 8000"
echo "  3. Node.js:    npx http-server"
echo "  4. VS Code:    Install 'Live Server' extension"
echo ""
echo "Then open: http://localhost:8000"
