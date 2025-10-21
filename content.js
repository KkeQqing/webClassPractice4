// content.js
let isAreaSelectorActive = false;

// 高亮元素
function highlightElement(element) {
  if (!element) return;

  // 移除旧的高亮
  const oldHighlight = document.querySelector('.highlight');
  if (oldHighlight) oldHighlight.remove();

  // 创建高亮层
  const highlight = document.createElement('div');
  highlight.className = 'highlight';
  highlight.style.cssText = `
    position: absolute;
    border: 2px solid #007acc;
    pointer-events: none;
    z-index: 9999;
    background-color: rgba(0, 120, 204, 0.1);
  `;

  // 获取元素位置
  const rect = element.getBoundingClientRect();
  highlight.style.left = `${rect.left}px`;
  highlight.style.top = `${rect.top}px`;
  highlight.style.width = `${rect.width}px`;
  highlight.style.height = `${rect.height}px`;

  document.body.appendChild(highlight);

  // 显示属性框
  showInfoBox(element);
}

// 显示信息框
function showInfoBox(element) {
  const infoBox = document.createElement('div');
  infoBox.id = 'info-box';
  infoBox.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  `;

  const tagName = element.tagName;
  const id = element.id || '无';
  const className = element.className || '无';
  const style = element.style.cssText || '无';

  infoBox.innerHTML = `
    <strong>${tagName}</strong><br>
    ID: ${id}<br>
    Class: ${className}<br>
    Style: ${style.length > 100 ? style.substring(0, 100) + '...' : style}
  `;

  document.body.appendChild(infoBox);

  // 定位到元素上方
  const rect = element.getBoundingClientRect();
  infoBox.style.left = `${rect.left}px`;
  infoBox.style.top = `${rect.bottom + 10}px`;
}

// 鼠标悬停监听
function startAreaSelector() {
  isAreaSelectorActive = true;
  document.addEventListener('mouseover', handleMouseOver);
}

function stopAreaSelector() {
  isAreaSelectorActive = false;
  document.removeEventListener('mouseover', handleMouseOver);
  hideInfoBox();
}

function handleMouseOver(e) {
  const target = e.target;
  if (target.tagName === 'DIV' || target.tagName === 'TABLE') {
    highlightElement(target);
  }
}

function hideInfoBox() {
  const box = document.getElementById('info-box');
  if (box) box.remove();
}

// 接收消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showAreaSelector") {
    startAreaSelector();
  }
});

// 页面加载完成后自动初始化
window.addEventListener('load', () => {
  console.log('Content script loaded');
});