// Lightweight modal utilities for opening/closing and basic bindings

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  // prevent background scroll
  document.body.style.overflow = 'hidden';
  // focus the first interactive element
  const first = modal.querySelector('select, input, textarea, button');
  first && first.focus();
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

// Optional helper to wire up open/close controls
export function bindModalEvents({
  modalId,
  openSelector,
  closeSelector = '[data-close="modal"]',
  escToClose = true,
  backdropSelector = '.absolute.inset-0',
} = {}) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Open triggers
  if (openSelector) {
    document.querySelectorAll(openSelector).forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalId);
      });
    });
  }

  // Close triggers inside modal
  modal.querySelectorAll(closeSelector).forEach((el) => {
    el.addEventListener('click', () => closeModal(modalId));
  });


  // ESC key closes
  if (escToClose) {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal(modalId);
      }
    };
    document.addEventListener('keydown', onKeyDown);
  }
}
