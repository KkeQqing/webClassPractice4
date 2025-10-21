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
  highlight.style.left = `${rect.left + window.scrollX}px`; // 加上滚动偏移
  highlight.style.top = `${rect.top + window.scrollY}px`;
  highlight.style.width = `${rect.width}px`;
  highlight.style.height = `${rect.height}px`;

  document.body.appendChild(highlight);

  // 显示属性框
  showInfoBox(element);
}

// 显示信息框（调整位置，避免遮挡菜单）
function showInfoBox(element) {
  // 移除旧的信息框
  hideInfoBox();

  const infoBox = document.createElement('div');
  infoBox.id = 'info-box';
  infoBox.style.cssText = `
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    font-size: 12px;
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

  // 定位到元素下方（避免与右上角菜单冲突）
  const rect = element.getBoundingClientRect();
  infoBox.style.left = `${Math.min(rect.left + window.scrollX, window.innerWidth - 320)}px`; // 防止超出屏幕
  infoBox.style.top = `${rect.bottom + window.scrollY + 10}px`;
}

// 鼠标悬停处理
function handleMouseOver(e) {
  if (!isAreaSelectorActive) return; // 仅在激活状态下生效
  const target = e.target;
  // 只处理 div 和 table 元素
  if (target.tagName === 'DIV' || target.tagName === 'TABLE') {
    highlightElement(target);
  }
}

// 隐藏信息框和高亮
function hideInfoBox() {
  const box = document.getElementById('info-box');
  if (box) box.remove();
  const highlight = document.querySelector('.highlight');
  if (highlight) highlight.remove();
}

// content.js（仅修改关键部分，其他逻辑保持不变）

// 创建右上角选择菜单（给输入框添加id，方便精准获取）
function createSelectorMenu() {
  // 移除旧菜单（若存在）
  const oldMenu = document.getElementById('selector-menu');
  if (oldMenu) oldMenu.remove();

  const menu = document.createElement('div');
  menu.id = 'selector-menu';
  menu.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 9999;
    width: 200px;
  `;

  // 给每个输入框添加唯一id，避免选择器错误
  menu.innerHTML = `
    <div style="margin-bottom: 8px;">
      <label style="display: inline-block; width: 70px;">目标元素：</label>
      <input type="text" id="targetElement" value="DIV" style="width: 110px;" />
    </div>
    <div style="margin-bottom: 8px;">
      <label style="display: inline-block; width: 70px;">元素索引：</label>
      <input type="text" id="elementIndex" value="0" style="width: 110px;" />
    </div>
    <div style="margin-bottom: 8px;">
      <label style="display: inline-block; width: 70px;">属性名称：</label>
      <input type="text" id="attrName" value="class" style="width: 110px;" />
    </div>
    <div style="margin-bottom: 8px;">
      <label style="display: inline-block; width: 70px;">属性值：</label>
      <input type="text" id="attrValue" value="news_wzt" style="width: 110px;" />
    </div>
    <button id="save-btn" style="width: 100%; padding: 5px;">保存</button>
    <button id="close-btn" style="width: 100%; padding: 5px; margin-top: 5px; background: #f5f5f5;">关闭选择</button>
  `;

  document.body.appendChild(menu);

  // 保存按钮逻辑（通过id获取输入框，避免null）
  document.getElementById('save-btn').addEventListener('click', () => {
    // 使用id精准获取元素，确保元素存在
    const target = document.getElementById('targetElement').value;
    const index = document.getElementById('elementIndex').value;
    const attrName = document.getElementById('attrName').value;
    const attrValue = document.getElementById('attrValue').value;
    console.log(`保存参数：目标元素${target}、索引${index}、属性${attrName}、值${attrValue}`);
    // 可添加保存到chrome.storage的逻辑
  });

  // 关闭选择按钮逻辑
  document.getElementById('close-btn').addEventListener('click', stopAreaSelector);
}

// 启用区域选择
function startAreaSelector() {
  if (isAreaSelectorActive) return; // 避免重复激活
  isAreaSelectorActive = true;
  createSelectorMenu(); // 创建右上角菜单
  document.addEventListener('mouseover', handleMouseOver); // 绑定鼠标悬停事件
}

// 禁用区域选择
function stopAreaSelector() {
  isAreaSelectorActive = false;
  document.removeEventListener('mouseover', handleMouseOver); // 移除鼠标监听
  hideInfoBox(); // 清除高亮和信息框
  const menu = document.getElementById('selector-menu');
  if (menu) menu.remove(); // 移除右上角菜单
}

// 接收popup消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showAreaSelector") {
    startAreaSelector();
  }
});

window.addEventListener('load', () => {
  console.log('Content script loaded');
});