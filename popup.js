document.getElementById('help-btn').addEventListener('click', () => {
  const url = chrome.runtime.getURL('help.html');
  window.open(url, '_blank');
});

document.getElementById('chose-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "showAreaSelector" });
  });
});
