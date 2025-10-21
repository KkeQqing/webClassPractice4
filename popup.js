// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 区域选择按钮点击事件
  document.getElementById('areaSelectBtn').addEventListener('click', () => {
    // 向当前激活的标签页发送消息
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "showAreaSelector"});
    });
  });

  // 帮助按钮点击事件
  document.getElementById('helpBtn').addEventListener('click', () => {
    window.open('help.html');
  });
});