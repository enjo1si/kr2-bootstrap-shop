// Apply saved theme before painting to avoid a flash on navigation.
(() => {
  let theme = 'light';
  try { theme = localStorage.getItem('forsazh.theme') === 'dark' ? 'dark' : 'light'; } catch {}
  document.documentElement.dataset.bsTheme = theme;
})();
