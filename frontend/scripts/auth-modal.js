let modal;

async function loadModal() {
  if (modal) return modal;
  try {
    const res = await fetch('components/auth-modal.html');
    const html = await res.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const modalEl = wrapper.querySelector('#auth-modal');
    const styleEl = wrapper.querySelector('style');
    if (styleEl) {
      document.head.appendChild(styleEl);
    }
    modal = modalEl;
    document.body.appendChild(modal);
    return modal;
  } catch (err) {
    console.error('Failed to load auth modal', err);
  }
}

export async function showAuthModal() {
  const m = await loadModal();
  if (!m) return;
  const loginBtn = m.querySelector('#auth-modal-login');
  if (loginBtn) {
    loginBtn.href = `login.html?redirect=${encodeURIComponent(location.pathname)}`;
  }
  const signupBtn = m.querySelector('#auth-modal-signup');
  if (signupBtn) {
    signupBtn.href = `signup.html?redirect=${encodeURIComponent(location.pathname)}`;
  }
  m.classList.remove('hidden');
}

export async function hideAuthModal() {
  const m = await loadModal();
  if (!m) return;
  m.classList.add('hidden');
}