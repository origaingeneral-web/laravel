document.addEventListener('DOMContentLoaded', () => {
  if (!window.Tagify) {
    return;
  }

  document.querySelectorAll('.tagify-input').forEach((input) => {
    if (!input.dataset.tagifyReady) {
      new Tagify(input);
      input.dataset.tagifyReady = 'true';
    }
  });
});
