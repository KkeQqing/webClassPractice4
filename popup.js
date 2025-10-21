document.getElementById('help-btn').addEventListener('click', () => {
  const url = chrome.runtime.getURL('help.html');
  window.open(url, '_blank');
});