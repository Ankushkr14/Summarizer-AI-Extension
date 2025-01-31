function getSelectedText() {
  return window.getSelection().toString();
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SUMMARIZE_SELECTED_TEXT") {
    const selectedText = getSelectedText();

    if (selectedText) {

      chrome.storage.local.get(["token"], (result) => {
        const token = result.token;

        if (token) {
          
          chrome.runtime.sendMessage(
            {
              type: "SEND_SUMMARY",
              data: {
                token: token,
                text: selectedText,
              },
            },
            (response) => {
              if (response.summary) {
                alert(`Summary: ${response.summary}`);
              } else {
                alert(response.error || "An error occurred");
              }
            }
          );
        } else {
          alert("You need to log in first.");
        }
      });
    } else {
      alert("Please select some text to summarize.");
    }
  }
});
