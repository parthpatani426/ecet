// Navigation and UI Utilities
class NavigationManager {
  constructor() {
    this.currentPage = this.detectCurrentPage();
    this.setupNavigation();
    this.setupMobileMenu();
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename;
  }

  setupNavigation() {
    // Highlight active nav items
    const navLinks = document.querySelectorAll('[data-nav-link]');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === this.currentPage || 
          (href === 'index.html' && this.currentPage === '') ||
          (this.currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
        link.parentElement?.classList.add('active');
      }
    });
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.navbar-overlay');

    if (!mobileMenuBtn) return;

    mobileMenuBtn.addEventListener('click', () => {
      navbar?.classList.toggle('show');
      overlay?.classList.toggle('show');
      document.body.style.overflow = navbar?.classList.contains('show') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.navbar a[data-nav-link]');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar?.classList.remove('show');
        overlay?.classList.remove('show');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking overlay
    overlay?.addEventListener('click', () => {
      navbar?.classList.remove('show');
      overlay?.classList.remove('show');
      document.body.style.overflow = '';
    });
  }

  navigateTo(page) {
    window.location.href = page;
  }
}

// Branch Selector Manager
class BranchManager {
  constructor() {
    this.storageKey = 'ecetx-selected-branch';
    this.selectedBranch = this.getSelectedBranch();
    this.init();
  }

  init() {
    this.renderBranchSelector();
    this.setupBranchSelection();
  }

  getSelectedBranch() {
    return localStorage.getItem(this.storageKey) || 'ece';
  }

  setSelectedBranch(branchId) {
    localStorage.setItem(this.storageKey, branchId);
    this.selectedBranch = branchId;
    this.dispatchBranchChangeEvent(branchId);
  }

  renderBranchSelector() {
    const selector = document.getElementById('branchSelector');
    if (!selector) return;

    const branches = mockData.branches;
    const html = branches.map(branch => `
      <option value="${branch.id}" ${branch.id === this.selectedBranch ? 'selected' : ''}>
        ${branch.icon} ${branch.name}
      </option>
    `).join('');

    selector.innerHTML = html;
  }

  setupBranchSelection() {
    const selector = document.getElementById('branchSelector');
    if (!selector) return;

    selector.addEventListener('change', (e) => {
      this.setSelectedBranch(e.target.value);
      this.reloadPageData();
    });
  }

  reloadPageData() {
    window.dispatchEvent(new CustomEvent('branchchange'));
    // Reload courses based on branch
    const loadCoursesFunc = window.loadCourses;
    if (loadCoursesFunc) loadCoursesFunc();
  }

  dispatchBranchChangeEvent(branchId) {
    window.dispatchEvent(new CustomEvent('branchchange', { detail: { branchId } }));
  }
}

// Toast/Notification Manager
class ToastManager {
  static show(message, type = 'info', duration = 3000) {
    const toastContainer = this.getContainer();
    const toast = document.createElement('div');
    const toastId = 'toast-' + Date.now();
    
    toast.id = toastId;
    toast.className = `alert alert-${type} alert-dismissible fade show`;
    toast.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    toastContainer.appendChild(toast);

    if (duration) {
      setTimeout(() => {
        toast.remove();
      }, duration);
    }

    return toastId;
  }

  static getContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'position-fixed top-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    return container;
  }

  static success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration = 3000) {
    return this.show(message, 'danger', duration);
  }

  static warning(message, duration = 3000) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
}

// Modal Manager
class ModalManager {
  static show(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'dynamicModal';
    modal.setAttribute('tabindex', '-1');

    const buttonsHtml = buttons.map((btn, i) => 
      `<button type="button" class="btn btn-${btn.style || 'secondary'}" data-btn-action="${i}">${btn.text}</button>`
    ).join('');

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${buttons.length ? `<div class="modal-footer">${buttonsHtml}</div>` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Handle button clicks
    buttons.forEach((btn, i) => {
      const btnEl = modal.querySelector(`[data-btn-action="${i}"]`);
      if (btnEl && btn.callback) {
        btnEl.addEventListener('click', btn.callback);
      }
    });

    modal.addEventListener('hidden.bs.modal', () => {
      modal.remove();
    });

    return bsModal;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
    window.branchManager = new BranchManager();
  });
} else {
  window.navigationManager = new NavigationManager();
  window.branchManager = new BranchManager();
}
