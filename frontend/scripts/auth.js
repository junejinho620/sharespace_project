import { showAuthModal } from './auth-modal.js';

export function requireAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    showAuthModal();
    return false;
  }
  return true;
}

requireAuth();