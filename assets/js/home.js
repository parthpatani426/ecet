// Home Page Logic

// Load Navbar and Footer
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
  renderBranches();
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

function renderBranches() {
  const branchesGrid = document.getElementById('branchesGrid');
  if (!branchesGrid || !mockData) return;

  branchesGrid.innerHTML = mockData.branches.map(branch => `
    <div class="branch-card card">
      <div class="branch-card-icon">${branch.icon}</div>
      <h3>${branch.name}</h3>
      <p>Specialized courses and resources for ${branch.name.toLowerCase()}</p>
      <a href="learn.html?branch=${branch.id}" class="btn btn-primary btn-sm">
        Explore Courses →
      </a>
    </div>
  `).join('');
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
