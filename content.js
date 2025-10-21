let infoPanel = null;
let isAreaSelectorActive = false;
let selectBtn = null;
let exitBtn = null;
let highlightedElement = null; // 当前高亮的元素

// 修复样式注入函数（移除递归调用，正确注入高亮样式）
function injectHighlightStyle() {
  if (document.getElementById('areaSelectorHighlightStyle')) return; // 避免重复注入

  const style = document.createElement('style');
  style.id = 'areaSelectorHighlightStyle';
  style.textContent = `
    .area-selector-highlight {
      outline: 2px dashed #0078d7 !important; /* 蓝色虚线边框 */
      outline-offset: -2px;
      background-color: rgba(0, 120, 215, 0.1) !important; /* 轻微蓝色背景 */
      transition: all 0.1s ease; /* 平滑过渡效果 */
      z-index: 99998 !important; /* 确保在内容上方但低于信息面板 */
    }
    /* 排除信息面板自身被高亮 */
    #areaSelectorPanel, #areaSelectorPanel * {
      outline: none !important;
      background-color: transparent !important;
    }
  `;
  document.head.appendChild(style);
}

function createInfoPanel() {
  if (infoPanel) return;

  infoPanel = document.createElement('div');
  infoPanel.id = 'areaSelectorPanel';
  infoPanel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    width: 200px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    padding: 10px;
    font-family: Arial, sans-serif;
    z-index: 99999; /* 确保在高亮元素上方 */
  `;

  // 按钮容器
  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'display: flex; gap: 5px; margin-bottom: 10px;';

  selectBtn = document.createElement('button');
  selectBtn.textContent = '选择';
  selectBtn.dataset.action = 'select';
  btnContainer.appendChild(selectBtn);

  exitBtn = document.createElement('button');
  exitBtn.textContent = '退出选择';
  exitBtn.dataset.action = 'exit';
  btnContainer.appendChild(exitBtn);

  // 内容区域
  const contentContainer = document.createElement('div');
  contentContainer.innerHTML = `
    <div style="margin-bottom: 5px;"><strong>目标元素:</strong> <span id="targetTag">无</span></div>
    <div style="margin-bottom: 5px;"><strong>元素索引:</strong> <span id="index">无</span></div>
    <div style="margin-bottom: 5px;"><strong>属性名称:</strong> <span id="attrName">无</span></div>
    <div style="margin-bottom: 5px;"><strong>属性值:</strong> <span id="attrValue">无</span></div>
    <div style="margin-bottom: 5px;"><strong>标识符:</strong> <span id="identifier">无</span></div>
  `;

  // 组装面板
  infoPanel.appendChild(btnContainer);
  infoPanel.appendChild(contentContainer);
  document.body.appendChild(infoPanel);

  // 事件委托
  infoPanel.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'select') {
      startAreaSelector();
    } else if (action === 'exit') {
      stopAreaSelector();
    }
  });

  updatePanel(null);
  selectBtn.disabled = false;
  exitBtn.disabled = true;
}

function updatePanel(element) {
  const set = (id, text) => {
    const el = infoPanel?.querySelector(`#${id}`);
    if (el) el.textContent = text;
  };

  if (!element) {
    set('targetTag', '无');
    set('index', '无');
    set('attrName', '无');
    set('attrValue', '无');
    set('identifier', '无');
    return;
  }

  const tagName = element.tagName;
  const index = element.parentNode ? Array.from(element.parentNode.children).indexOf(element) : -1;
  const attr = element.attributes.length > 0 ? element.attributes[0] : null;
  const attrName = attr ? attr.name : '无';
  const attrValue = attr ? attr.value : '无';
  const identifier = attrName === 'id' ? 'id' : attrName === 'class' ? 'class' : '其他';

  set('targetTag', tagName);
  set('index', index >= 0 ? index : '无');
  set('attrName', attrName);
  set('attrValue', attrValue);
  set('identifier', identifier);
}

// 新增：移除当前高亮元素的样式
function removeHighlight() {
  if (highlightedElement) {
    highlightedElement.classList.remove('area-selector-highlight');
    highlightedElement = null;
  }
}

function startAreaSelector() {
  if (isAreaSelectorActive) return;

  injectHighlightStyle(); // 启动时确保样式已注入
  isAreaSelectorActive = true;
  document.addEventListener('mouseover', handleMouseOver);
  selectBtn.disabled = true;
  exitBtn.disabled = false;
}

function stopAreaSelector() {
  if (!isAreaSelectorActive) return;

  isAreaSelectorActive = false;
  document.removeEventListener('mouseover', handleMouseOver);
  removeHighlight(); // 退出时清除高亮
  updatePanel(null);
  selectBtn.disabled = false;
  exitBtn.disabled = true;
}

function handleMouseOver(e) {
  if (!isAreaSelectorActive) return;

  const target = e.target;
  // 排除信息面板自身及内部元素
  if (target.closest('#areaSelectorPanel')) return;
  if (target.nodeType !== 1) return;

  const allowedTags = ['DIV', 'TABLE', 'SECTION', 'ARTICLE', 'UL', 'OL', 'LI', 'P', 'HEADER', 'FOOTER', 'MAIN', 'NAV'];
  if (!allowedTags.includes(target.tagName)) return;

  // 切换高亮：先移除上一个元素的高亮，再给当前元素添加
  removeHighlight();
  target.classList.add('area-selector-highlight');
  highlightedElement = target;

  updatePanel(target);
}

function removeInfoPanel() {
  if (infoPanel) {
    document.removeEventListener('mouseover', handleMouseOver);
    removeHighlight(); // 移除面板时清除高亮
    isAreaSelectorActive = false;
    infoPanel.remove();
    infoPanel = null;
    selectBtn = null;
    exitBtn = null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showAreaSelector") {
    createInfoPanel();
    startAreaSelector();
  }
});