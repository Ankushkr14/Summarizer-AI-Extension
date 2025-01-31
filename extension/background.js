chrome.runtime.onInstalled.addListener(() => {
  console.log("Summarizer Extension installed!");
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_TOKEN") {
    
    chrome.storage.local.get(["token"], (result) => {
      sendResponse({ token: result.token });
    });
    return true; 
  }

  if (message.type === "SEND_SUMMARY") {
    const { token, text } = message.data;

    if (!token) {
      sendResponse({ error: "Authentication required" });
      return;
    }

    fetch("http://localhost:5000/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }), 
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.summary) {
          sendResponse({ summary: data.summary });
        } else {
          sendResponse({ error: data.message || "Error summarizing text" });
        }
      })
      .catch((err) => {
        sendResponse({ error: err.message });
      });

    return true; 
  }
});
