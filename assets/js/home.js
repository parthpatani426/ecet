// Home Page Logic

// Load Navbar and Footer
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
  setupHomeStats();
});

function loadNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(html => {
      navbarContainer.innerHTML = html;
      // Reinitialize theme manager after navbar is loaded
      if (window.themeManager) {
        window.themeManager.setupToggleButtons();
      }
    })
    .catch(err => console.error('Error loading navbar:', err));
}

function loadFooter() {
  const footerContainer = document.getElementById('footer-container');
  fetch('components/footer.html')
    .then(res => res.text())
    .then(html => {
      footerContainer.innerHTML = html;
    })
    .catch(err => console.error('Error loading footer:', err));
}

async function setupHomeStats() {
  // Backend-ready: fetch counters from API.
  // If endpoints are not implemented yet, keep UI in "—" state.
  const grid = document.getElementById('ecetxStatsGrid');
  if (!grid) return;

  const endpoints = {
    supported_branches: '/api/public/stats/supported-branches',
    subjects_covered: '/api/public/stats/subjects-covered',
    topics_covered: '/api/public/stats/topics-covered',
    practice_questions: '/api/public/stats/practice-questions',
    previous_papers: '/api/public/stats/previous-papers'
  };

  // Determine base API host from the existing apiClient if available
  const apiBase = window.apiClient?.baseURL || 'http://localhost:8000/api';

  await Promise.all(
    Object.entries(endpoints).map(async ([key, ep]) => {
      const el = grid.querySelector(`[data-stat="${key}"]`);
      if (!el) return;
      try {
        const res = await fetch(`${apiBase}${ep.replace('/api', '')}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Accept either { value } or raw number
        const value = typeof data === 'number' ? data : data.value;
        el.textContent = value ?? '—';
      } catch (e) {
        // Keep dash if backend not ready
        el.textContent = '—';
      }
    })
  );
}

// Smooth scroll for navigation
document.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

