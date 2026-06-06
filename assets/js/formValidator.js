// Enhanced Form Validation & Password Toggle
class FormValidator {
  constructor() {
    this.init();
  }

  init() {
    this.setupPasswordToggles();
    this.setupEmailValidation();
    this.setupFormHandlers();
  }

  // Password Show/Hide Toggle
  setupPasswordToggles() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach((input) => {
      const wrapper = input.parentElement;
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'password-toggle-btn';
      toggleBtn.innerHTML = '👁️';
      toggleBtn.setAttribute('title', 'Show/Hide Password');
      toggleBtn.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0.5rem;
        opacity: 0.6;
        transition: opacity 0.3s;
      `;

      // Make parent relative for positioning
      if (wrapper.style.position !== 'relative' && wrapper.style.position !== 'absolute') {
        wrapper.style.position = 'relative';
      }

      // Add some right padding to input
      input.style.paddingRight = '40px';

      wrapper.appendChild(toggleBtn);

      // Toggle visibility
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        toggleBtn.innerHTML = isPassword ? '🙈' : '👁️';
        toggleBtn.style.opacity = isPassword ? '1' : '0.6';
      });

      // Hover effects
      toggleBtn.addEventListener('mouseover', () => {
        toggleBtn.style.opacity = '1';
      });
      toggleBtn.addEventListener('mouseout', () => {
        toggleBtn.style.opacity = input.type === 'text' ? '1' : '0.6';
      });
    });
  }

  // Email Validation
  setupEmailValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach((input) => {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';

      const validationIcon = document.createElement('span');
      validationIcon.className = 'email-validation-icon';
      validationIcon.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.2rem;
        display: none;
      `;

      input.parentElement.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      wrapper.appendChild(validationIcon);

      // Real-time validation
      input.addEventListener('input', () => {
        this.validateEmail(input, validationIcon);
      });

      // Validation on blur
      input.addEventListener('blur', () => {
        this.validateEmail(input, validationIcon);
      });
    });
  }

  validateEmail(input, icon) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (email.length === 0) {
      icon.style.display = 'none';
      input.style.borderColor = '';
    } else if (isValid) {
      icon.innerHTML = '✅';
      icon.style.color = '#10b981';
      icon.style.display = 'block';
      input.style.borderColor = '#10b981';
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    } else {
      icon.innerHTML = '❌';
      icon.style.color = '#ef4444';
      icon.style.display = 'block';
      input.style.borderColor = '#ef4444';
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
  }

  // Form Handlers with Email Verification
  setupFormHandlers() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });
    });
  }

  validateForm(form) {
    const emailInputs = form.querySelectorAll('input[type="email"]');
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    let isValid = true;

    // Validate emails
    emailInputs.forEach((input) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        input.style.borderColor = '#ef4444';
        input.classList.add('is-invalid');
        isValid = false;
      }
    });

    // Validate passwords
    passwordInputs.forEach((input) => {
      if (input.value.length < 6) {
        ToastManager?.error('Password must be at least 6 characters');
        input.style.borderColor = '#ef4444';
        input.classList.add('is-invalid');
        isValid = false;
      }
    });

    // Validate password confirmation
    const form_id = form.id;
    if (form_id === 'registerForm') {
      const passwords = form.querySelectorAll('input[type="password"], input[type="text"]');
      const allPasswords = Array.from(passwords).filter(
        (p) => p.placeholder.includes('password') || p.type === 'password'
      );
      if (allPasswords.length >= 2) {
        if (allPasswords[0].value !== allPasswords[1].value) {
          ToastManager?.error('Passwords do not match!');
          isValid = false;
        }
      }
    }

    return isValid;
  }

  // Email verification service (can be enhanced with backend)
  async verifyEmail(email) {
    // Simple client-side check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }

    // In production, this would call backend API
    try {
      // Simulated API call
      return {
        valid: true,
        message: 'Email verified',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return { valid: false, message: 'Verification failed' };
    }
  }

  // Get email from form (for later use with mail service)
  async submitEmail(email, type = 'contact') {
    const validation = await this.verifyEmail(email);
    if (!validation.valid) {
      ToastManager?.error(validation.message);
      return false;
    }

    // This will connect to mail service
    return this.sendEmailNotification(email, type);
  }

  // Email notification service
  async sendEmailNotification(email, type) {
    try {
      // Prepare payload
      const payload = {
        email: email,
        type: type,
        timestamp: new Date().toISOString(),
      };

      // Log for now (will be replaced with real API)
      console.log('📧 Email Service - Payload:', payload);

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          ToastManager?.success(`Email sent to ${email}!`);
          console.log('✅ Email sent successfully');
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      ToastManager?.error('Failed to send email');
      console.error('❌ Email send failed:', error);
      return false;
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.formValidator = new FormValidator();
  });
} else {
  window.formValidator = new FormValidator();
}
