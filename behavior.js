class ProfessionalNavigation {
    constructor() {
      // DOM Elements
      this.header = document.querySelector('header');
      this.nav = document.querySelector('header nav');
      this.navLinks = document.querySelectorAll('nav a');
      this.mobileMenuBtn = null;
      
      // State
      this.isMobile = window.matchMedia('(max-width: 768px)').matches;
      this.lastScrollY = window.scrollY;
      this.scrollDirection = null;
      this.events = [];
      
      // Initialize
      this.init();
    }
    
    /* Initialization Methods */
    init() {
      this.createMobileMenuButton();
      this.setupEventListeners();
      this.setActiveLink();
      this.setupThemeToggle();
      this.handleScroll(); // Initial scroll position check
    }
    
    createMobileMenuButton() {
      if (!this.isMobile) return;
      
      this.mobileMenuBtn = document.createElement('button');
      this.mobileMenuBtn.className = 'mobile-menu-btn';
      this.mobileMenuBtn.innerHTML = `
        <span class="menu-icon"></span>
        <span class="menu-icon"></span>
        <span class="menu-icon"></span>
      `;
      this.nav.prepend(this.mobileMenuBtn);
      
      // Add animation after short delay
      setTimeout(() => {
        this.mobileMenuBtn.classList.add('animated');
      }, 300);
    }
    
    /* Event Handling Methods */
    setupEventListeners() {
      // Mobile menu toggle
      if (this.mobileMenuBtn) {
        this.addEvent(this.mobileMenuBtn, 'click', this.toggleMobileMenu.bind(this));
      }
      
      // Navigation clicks
      this.navLinks.forEach(link => {
        this.addEvent(link, 'click', this.handleNavClick.bind(this));
      });
      
      // Window events
      this.addEvent(window, 'scroll', this.handleScroll.bind(this));
      this.addEvent(window, 'resize', this.handleResize.bind(this));
    }
    
    addEvent(element, type, handler) {
      element.addEventListener(type, handler);
      this.events.push({ element, type, handler });
    }
    
    /* Core Functionality Methods */
    toggleMobileMenu() {
      this.nav.classList.toggle('open');
      document.body.classList.toggle('nav-open');
      this.animateMenuIcon();
    }
    
    animateMenuIcon() {
      if (!this.mobileMenuBtn) return;
      
      const icons = this.mobileMenuBtn.querySelectorAll('.menu-icon');
      if (this.nav.classList.contains('open')) {
        icons[0].style.transform = 'translateY(7px) rotate(45deg)';
        icons[1].style.opacity = '0';
        icons[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        icons[0].style.transform = '';
        icons[1].style.opacity = '';
        icons[2].style.transform = '';
      }
    }
    
    handleNavClick(e) {
      const link = e.currentTarget;
      
      // Handle anchor links
      if (link.hash && link.hash.startsWith('#')) {
        const target = document.querySelector(link.hash);
        if (target) {
          e.preventDefault();
          this.scrollToSection(target);
          
          // Close mobile menu if open
          if (this.nav.classList.contains('open')) {
            this.toggleMobileMenu();
          }
        }
      }
    }
    
    scrollToSection(target) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    
    /* Scroll and Resize Handlers */
    handleScroll() {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
      this.lastScrollY = currentScrollY;
      
      // Toggle header visibility
      if (currentScrollY > 100) {
        if (this.scrollDirection === 'down') {
          this.header.classList.add('scrolled-down');
          this.header.classList.remove('scrolled-up');
        } else {
          this.header.classList.add('scrolled-up');
          this.header.classList.remove('scrolled-down');
        }
      }
      
      // Toggle header shadow
      this.header.classList.toggle('has-shadow', currentScrollY > 10);
    }
    
    handleResize() {
      this.isMobile = window.matchMedia('(max-width: 768px)').matches;
      
      // Ensure mobile menu is closed on desktop
      if (!this.isMobile && this.nav.classList.contains('open')) {
        this.toggleMobileMenu();
      }
    }
    
    /* Active Link Management */
    setActiveLink() {
      const sections = document.querySelectorAll('section[id]');
      const navHeight = this.header.offsetHeight;
      
      this.addEvent(window, 'scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (window.scrollY >= sectionTop - navHeight - 50) {
            currentSection = section.getAttribute('id');
          }
        });
        
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
          }
        });
      });
    }
    
  }
  

  document.addEventListener('DOMContentLoaded', function() {
    const thumbnail = document.getElementById('smart_thumbnail');
    const modal = document.querySelector('.modal-overlay');
    const modalImg = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close-modal');
    
    // Open modal
    thumbnail.addEventListener('click', function() {
      modal.style.display = "block";
      modalImg.src = this.src;
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
      modal.style.display = "none";
    });
    
    // Close when clicking outside image
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
    
    // Close with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  });

  /* Modern Page Lifecycle Management */
  const initApp = () => {
    const navigation = new ProfessionalNavigation();
    
    const cleanup = () => {
      navigation.destroy();
      // Add other cleanup tasks as needed
    };
    
    // Modern page exit detection
    if ('onpagehide' in window) {
      window.addEventListener('pagehide', cleanup);
    } else {
      window.addEventListener('unload', cleanup);
    }
    
    // Visibility change handling
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        cleanup();
      }
    });
    
    return navigation;
  };
  
  // Initialize the application when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const app = initApp();
    
    // Add loaded class for animations
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      setTimeout(() => {
        document.querySelector('header').classList.add('loaded');
      }, 300);
    });
  });

  function openPdfModal() {
    document.getElementById('pdfModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  function closePdfModal() {
    document.getElementById('pdfModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
  
  // Close modal when clicking outside content
  window.onclick = function(event) {
    const modal = document.getElementById('pdfModal');
    if (event.target == modal) {
      closePdfModal();
    }
  }

  document.getElementById('docLink').addEventListener('click', function(e) {
    // Only navigate if not clicking on the child link
    if (e.target === this) {
        window.location.href = 'https://www.canva.com/design/DAGQt8qm8t8/nVlkk9JYJZ3g1tn-KslQwA/view';
    }
});