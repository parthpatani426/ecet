/**
 * Authentication Manager for ECETX
 * Handles authentication state and flow
 */

class AuthenticationManager {
    constructor() {
        this.user = window.apiClient?.getUser?.() || null;
        this.isAuthenticated = !!window.apiClient?.isAuthenticated?.();
        this.init();
    }

    /**
     * Initialize authentication
     */
    async init() {
        this.syncFromApiClient();

        // Check if user is on auth-required page without token
        if (!this.isAuthenticated && this.isAuthRequiredPage()) {
            console.log('Redirecting to login...');
            window.location.href = '/login.html';
            return;
        }

        // Set up logout button
        this.setupLogoutButton();

        // Update navbar with user info
        if (this.isAuthenticated) {
            try {
                // Keep navbar accurate even if apiClient.user was lost on reload (no persistence)
                this.user = this.user || await window.apiClient.getProfile();
                this.syncFromApiClient();
            } catch (e) {
                console.warn('Failed to refresh profile:', e);
            }
            this.updateNavbar();
        }
    }

    /**
     * Refresh current user from API client (in-memory)
     */
    syncFromApiClient() {
        this.user = window.apiClient?.getUser?.() || null;
        this.isAuthenticated = !!window.apiClient?.isAuthenticated?.();
    }

    /**
     * Check if current page requires authentication
     */
    isAuthRequiredPage() {
        const authPages = [
            'dashboard.html',
            'learn.html',
            'subjects.html',
            'topic-view.html',
            'practice.html',
            'mock-tests.html',
            'test-interface.html',
            'ai-tutor.html',
            'rank-predictor.html',
            'leaderboard.html',
            'profile.html',
            'settings.html',
            'previous-papers.html'
        ];

        const currentPage = window.location.pathname.split('/').pop();
        return authPages.includes(currentPage);
    }

    /**
     * Update navbar with user info
     */
    updateNavbar() {
        if (!this.user) return;

        // Update user display name
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(el => {
            el.textContent = this.user.name;
        });

        // Update branch display
        const branchElements = document.querySelectorAll('[data-user-branch]');
        branchElements.forEach(el => {
            const branchName = this.user.branch_name || this.user.branch?.toUpperCase?.();
            el.textContent = branchName || this.user.branch;
        });

        // Show logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
    }

    /**
     * Setup logout button
     */
    setupLogoutButton() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.logout();
            });
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await window.apiClient.logout();
            ToastManager?.success('Logged out successfully');

            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1000);
        } catch (error) {
            console.error('Logout error:', error);

            // Force logout anyway
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        }
    }

    /**
     * Get user's branch
     */
    getBranch() {
        return this.user?.branch;
    }

    /**
     * Get user's guru URL
     */
    getGuruURL() {
        return this.user?.guru_url;
    }
}

// Initialize authentication manager
window.authManager = new AuthenticationManager();
