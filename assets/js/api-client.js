/**
 * API Client for ECETX Backend
 * Handles all API requests with JWT authentication
 */

class ECETXAPIClient {
    constructor(baseURL = 'http://localhost:8000/api') {
        this.baseURL = baseURL;

        // Production-grade auth: keep tokens in memory (no localStorage persistence)
        // This avoids client-side token persistence and keeps backend-driven sessions authoritative.
        this.accessToken = null;
        this.refreshToken = null;
    }

    /**
     * Make API request with JWT authentication
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Handle token expiry
            if (response.status === 401 && this.refreshToken) {
                console.warn('⚠️ Access token expired, attempting refresh...');
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    headers['Authorization'] = `Bearer ${this.accessToken}`;
                    return fetch(url, { ...options, headers });
                }
            }

            return response;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken() {
        if (!this.refreshToken) return false;

        try {
            const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: this.refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.access_token;
                return true;
            }
        } catch (error) {
            console.error('❌ Token refresh failed:', error);
        }
        return false;
    }

    /**
     * Register new user
     */
    async register(name, email, password, branch) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password,
                branch: branch.toLowerCase()
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }
        return data;
    }

    /**
     * Verify email with OTP
     */
    async verifyEmail(email, code) {
        const response = await this.request('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ email, code })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Email verification failed');
        }
        return data;
    }

    /**
     * Login user
     */
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }

        // Store tokens (in memory)
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.user = data.user;

        return data;
    }

    /**
     * Initiate password reset
     */
    async forgotPassword(email) {
        const response = await this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Password reset initiation failed');
        }
        return data;
    }

    /**
     * Reset password with OTP
     */
    async resetPassword(email, code, newPassword) {
        const response = await this.request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                email,
                code,
                new_password: newPassword
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Password reset failed');
        }
        return data;
    }

    /**
     * Get user profile
     */
    async getProfile() {
        const response = await this.request('/user/profile', {
            method: 'GET'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch profile');
        }
        return data;
    }

    /**
     * Get user's branch info with guru details
     */
    async getBranchInfo() {
        const response = await this.request('/user/branch', {
            method: 'GET'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch branch info');
        }
        return data;
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await this.request('/user/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.warn('⚠️ Logout request failed:', error);
        }

        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.accessToken;
    }

    /**
     * Get stored user
     */
    getUser() {
        return this.user || null;
    }
}

// Initialize global API client
window.apiClient = new ECETXAPIClient();
