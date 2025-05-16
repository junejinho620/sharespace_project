document.querySelectorAll('.options-grid').forEach(group => {
  const checkboxes = group.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        checkboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });
      }
    });
  });
});

// Inline validation on submit
const form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    const errorEl = field.parentNode.querySelector('.error');
    if (!field.value.trim()) {
      valid = false;
      errorEl.hidden = false;
    } else {
      errorEl.hidden = true;
    }
  });

  if (valid) {
    // e.g. form.submit(); or your next-page logic here
    console.log('All good – proceed');
  }
});

// Loading spinner on primary button
const primaryBtn = document.querySelector('.button--primary');
form.addEventListener('submit', () => {
  primaryBtn.classList.add('loading');
});