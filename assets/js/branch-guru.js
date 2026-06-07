/**
 * Branch Guru Manager
 * Handles opening branch-specific GPT tutors
 */

class BranchGuruManager {
    constructor() {
        this.branchNames = {
            'ece': 'Electronics & Communication Engineering',
            'eee': 'Electrical & Electronics Engineering',
            'cme': 'Computer Science & Engineering',
            'civil': 'Civil Engineering',
            'mechanical': 'Mechanical Engineering'
        };

        this.init();
    }


    /**
     * Initialize Branch Guru
     */
    init() {
        this.setupBranchGuruButtons();
    }

    /**
     * Setup all Branch Guru buttons
     */
    setupBranchGuruButtons() {
        const guruButtons = document.querySelectorAll('[data-branch-guru]');
        guruButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openBranchGuru();
            });
        });
    }

    /**
     * Open branch-specific GPT guru
     */
    async openBranchGuru() {
        if (!window.authManager?.isAuthenticated) {
            ToastManager?.error('Please login first');

            window.location.href = '/login.html';
            return;
        }

        try {
            const branchInfo = await window.apiClient.getBranchInfo();
            const guruUrl = branchInfo?.guru_url;
            const branch = branchInfo?.branch;

            if (!guruUrl) {
                ToastManager?.error('Branch Guru is not available for this account yet.');
                return;
            }

            // Open in new tab
            window.open(guruUrl, '_blank', 'noopener,noreferrer');
            ToastManager?.success(`Opening ${this.getBranchName(branch)} Guru...`);
        } catch (err) {
            console.error('Failed to open Branch Guru:', err);
            ToastManager?.error('Could not open Branch Guru. Please try again.');
        }
    }

    /**
     * Get branch name
     */
    getBranchName(branch) {
        return this.branchNames[branch?.toLowerCase()] || branch;
    }

}

// Initialize Branch Guru Manager
window.branchGuruManager = new BranchGuruManager();
