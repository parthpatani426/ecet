// Theme Manager - Dark Mode Toggle with localStorage Persistence
class ThemeManager {
  constructor() {
    this.storageKey = 'ecetx-theme';
    this.init();
  }

  init() {
    this.applyTheme(this.getSavedTheme());
    this.setupToggleButtons();
  }

  getSavedTheme() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return saved;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
    this.updateThemeIcons(theme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.dispatchThemeChangeEvent(newTheme);
  }

  updateThemeIcons(theme) {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = '☀️';
        btn.setAttribute('title', 'Switch to Light Mode');
      } else {
        btn.innerHTML = '🌙';
        btn.setAttribute('title', 'Switch to Dark Mode');
      }
    });
  }

  setupToggleButtons() {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });
  }

  dispatchThemeChangeEvent(theme) {
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}
