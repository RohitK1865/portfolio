// Inside /pages/_app.js or useEffect in a component
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      registration => {
        console.log('SW registered:', registration);
      },
      err => {
        console.log('SW registration failed:', err);
      }
    );
  });
}
