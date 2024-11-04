document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const loader = submitBtn.querySelector('.loader');
  
  // Show loading state
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  loader.style.display = 'inline-block';

  try {
    const formData = new FormData(this);
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
      // Clear the form
      this.reset();
      
      // Show success message
      window.location.href = '/contact?success=true';
      
      // Remove success parameter after 3 seconds
      setTimeout(() => {
        const url = new URL(window.location);
        url.searchParams.delete('success');
        window.history.replaceState({}, '', url);
        
        // Remove success message from DOM
        const successAlert = document.querySelector('.alert-success');
        if (successAlert) {
          successAlert.style.opacity = '0';
          setTimeout(() => {
            successAlert.remove();
          }, 300);
        }
      }, 3000);
    } else {
      window.location.href = '/contact?error=true';
    }
  } catch (error) {
    window.location.href = '/contact?error=true';
  }
});

// Add this to handle success message fade out when page loads with success parameter
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.search.includes('success=true')) {
    setTimeout(() => {
      const url = new URL(window.location);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url);
      
      const successAlert = document.querySelector('.alert-success');
      if (successAlert) {
        successAlert.style.opacity = '0';
        setTimeout(() => {
          successAlert.remove();
        }, 300);
      }
    }, 3000);
  }
}); 