// Main JavaScript file for client-side interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuButton && mainNav) {
    mobileMenuButton.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-menu-open');
    });
  }
  
  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    
    if (summary) {
      summary.addEventListener('click', (e) => {
        // Close other open FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });
      });
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Pricing toggle (monthly/yearly)
  const pricingToggle = document.querySelector('.toggle-switch input');
  
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const isYearly = pricingToggle.checked;
      
      // Update the active class on the labels
      document.querySelectorAll('.pricing-toggle-label').forEach((label, index) => {
        if (index === 0) { // Monthly label
          label.classList.toggle('active', !isYearly);
        } else { // Yearly label
          label.classList.toggle('active', isYearly);
        }
      });
    });
  }
});
