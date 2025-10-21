// background.js
chrome.contextMenus.create({
  id: "openSite",
  title: "打开网站",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "selectArea",
  title: "区域选择",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "setColumn",
  title: "设置栏目",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "help",
  title: "帮助",
  contexts: ["all"]
});

// 处理菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "selectArea") {
    chrome.tabs.sendMessage(tab.id, { action: "showAreaSelector" });
  } else if (info.menuItemId === "help") {
    chrome.tabs.create({ url: "help.html" });
  } else if (info.menuItemId === "openSite") {
    // 示例：打开指定网址
    chrome.tabs.create({ url: "https://www.example.com" });
  }
});