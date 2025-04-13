// Optional - Pricing Toggle (For future use)
document.addEventListener('DOMContentLoaded', function() {
    const monthlyBtn = document.getElementById('monthly-btn');
    const annualBtn = document.getElementById('annual-btn');
    const prices = document.querySelectorAll('.plan-price');
  
    monthlyBtn.addEventListener('click', function() {
        prices.forEach(price => price.innerHTML = '$0<span>/month</span>');
    });
  
    annualBtn.addEventListener('click', function() {
        prices.forEach(price => price.innerHTML = '$0<span>/year</span>');
    });
  });