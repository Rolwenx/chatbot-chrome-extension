document.getElementById('save-button').addEventListener('click', function (e) {
  e.preventDefault();
  const chatbotName = document.getElementById('chatbot-name').value.trim();
  const chatbotUrl = document.getElementById('chatbot-url').value.trim();
  const errorTip = document.getElementById('error-tip');

  if (chatbotName === "" || chatbotUrl === "") {
    errorTip.textContent = "Le nom et l'URL du Chatbot ne peuvent pas être vides.";
    return;
  }

  errorTip.textContent = "";

  // this check existing chatbots from storage to add the new one
  chrome.storage.sync.get({ chatbots: [] }, function (result) {
    const chatbots = result.chatbots;

    if (chatbots.some(chatbot => chatbot.name === chatbotName)) {
      alert('Un chatbot avec ce nom existe déjà.');
      return;
    }

    chatbots.push({ name: chatbotName, url: chatbotUrl });

    // Save updated chatbot list and set the new one as active
    chrome.storage.sync.set({ 
      chatbots, 
      activeChatbotIndex: chatbots.length - 1, // Index of the newly added chatbot
      chatbotUrl // Save the URL of the new active chatbot
    }, function () {
      alert('Chatbot sauvegardé et activé avec succès!');
      // Optionally, clear input fields
      document.getElementById('chatbot-name').value = "";
      document.getElementById('chatbot-url').value = "";
    });
  });
});

// Navigate to the "Saved Chatbot" page
document.getElementById('saved-chatbot').addEventListener('click', function () {
  window.location.href = '../pages/saved_chatbots.html';
});