chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
  if (
    tabInfo.status == "complete" &&
    tab.url.startsWith("https://chat.openai.com/chat/")
  ) {
    chrome.tabs.sendMessage(
      tabId,
      {
        chatHistoryPageLoaded: true,
      },
      (res) => {
        console.log(res);
      }
    );
  } else if (
    tabInfo.status == "complete" &&
    tab.url == "https://chat.openai.com/chat"
  ) {
    chrome.tabs.sendMessage(
      tabId,
      {
        newChatPageLoaded: true,
      },
      (res) => {
        console.log(res);
      }
    );
  }
});
