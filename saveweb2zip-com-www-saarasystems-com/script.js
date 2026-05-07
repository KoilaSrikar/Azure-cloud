document.addEventListener('DOMContentLoaded', () => {
  // Form Submission Logic
  const quoteForm = document.getElementById('azureQuoteForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.querySelector('.close-modal');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form Data Collection
      const formData = {
        fullName: document.getElementById('fullName').value,
        companyName: document.getElementById('companyName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        monthlySpend: document.getElementById('monthlySpend').value,
        azureService: document.getElementById('azureService').value,
        businessRequirement: document.getElementById('businessRequirement').value,
        timestamp: new Date().toISOString()
      };

      // 1. Console log the form data
      console.log('--- New Azure Quote Request ---');
      console.table(formData);

      // 2. Store in localStorage
      let quotes = JSON.parse(localStorage.getItem('azureQuotes') || '[]');
      quotes.push(formData);
      localStorage.setItem('azureQuotes', JSON.stringify(quotes));

      // 3. Show success modal
      if (successModal) {
        successModal.style.display = 'block';
      }

      // 4. Reset the form
      quoteForm.reset();
    });
  }

  // Modal Close Logic
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      successModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.style.display = 'none';
    }
  });

  // FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      
      // Close other open items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
});
