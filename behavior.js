class FormHandler {
  constructor() {
    this.form = document.getElementById('ai-discussion-form');
    if (!this.form) return;

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Show custom topic field when "Other" is selected
    const topicSelect = this.form.querySelector('#ai-topic');
    if (topicSelect) {
      topicSelect.addEventListener('change', (e) => {
        const customTopicGroup = this.form.querySelector('#custom-topic-group');
        customTopicGroup.style.display = e.target.value === 'other' ? 'block' : 'none';
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Check if user is authenticated
    const isAuthenticated = this.checkAuthentication();
    
    if (!isAuthenticated) {
      const hcaptchaResponse = hcaptcha.getResponse();
      
      if (!hcaptchaResponse) {
        alert('Please complete the hCaptcha verification');
        hcaptcha.reset();
        return;
      }

      try {
        const verification = await this.verifyCaptcha(hcaptchaResponse);
        if (!verification.success) {
          alert('CAPTCHA verification failed. Please try again.');
          hcaptcha.reset();
          return;
        }
      } catch (error) {
        console.error('CAPTCHA verification error:', error);
        alert('Error verifying CAPTCHA. Please try again.');
        return;
      }
    }

    // If we get here, proceed with form submission
    this.submitForm();
  }

  checkAuthentication() {
    // Implement your actual authentication check here
    // Example: Check for auth token in cookies or localStorage
    // return localStorage.getItem('authToken') !== null;
    return false; // Default to false for security
  }

  async verifyCaptcha(token) {
    const response = await fetch('/verify-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ token })
    });
    return response.json();
  }

  submitForm() {
    // Using Fetch API for better error handling
    const formData = new FormData(this.form);
    
    fetch(this.form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      // Handle successful submission
      alert('Form submitted successfully!');
      this.form.reset();
      hcaptcha.reset();
    })
    .catch(error => {
      console.error('Form submission error:', error);
      alert('There was a problem submitting your form. Please try again.');
    });
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  new ProfessionalNavigation();
  
  // Initialize form handler
  new FormHandler();
  
  const app = initApp();
  
  // Add loaded class for animations
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    setTimeout(() => {
      document.querySelector('header').classList.add('loaded');
    }, 300);
  });
});

// Modal functions
function openPdfModal() {
  document.getElementById('pdfModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  document.getElementById('pdfModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside content
window.onclick = function(event) {
  const modal = document.getElementById('pdfModal');
  if (event.target == modal) {
    closePdfModal();
  }
}

// Document link handler
document.getElementById('docLink').addEventListener('click', function(e) {
  if (e.target === this) {
    window.location.href = 'https://www.canva.com/design/DAGQt8qm8t8/nVlkk9JYJZ3g1tn-KslQwA/view';
  }
});