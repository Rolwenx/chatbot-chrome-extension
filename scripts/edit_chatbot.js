// Extract index from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const index = urlParams.get('index');

if (!index) {
  alert('Aucun chatbot spécifié.');
  window.location.href = '../pages/saved_chatbots.html';
}

// Elements
const chatbotNameInput = document.getElementById('chatbot-name');
const chatbotUrlInput = document.getElementById('chatbot-url');
const saveButton = document.getElementById('save-button');
const deleteButton = document.getElementById('delete-button');

// Load the chatbot data
chrome.storage.sync.get(['chatbots'], function (result) {
  const chatbots = result.chatbots || [];

  if (!chatbots[index]) {
    alert('Chatbot non trouvé.');
    window.location.href = '../pages/saved_chatbots.html';
    return;
  }

  const chatbot = chatbots[index];
  chatbotNameInput.value = chatbot.name;
  chatbotUrlInput.value = chatbot.url;
});

// Save changes
saveButton.addEventListener('click', function () {
  const updatedName = chatbotNameInput.value.trim();
  const updatedUrl = chatbotUrlInput.value.trim();

  if (!updatedName || !updatedUrl) {
    alert('Le nom et l\'URL sont requis.');
    return;
  }

  chrome.storage.sync.get(['chatbots'], function (result) {
    const chatbots = result.chatbots || [];

    if (!chatbots[index]) {
      alert('Chatbot non trouvé.');
      return;
    }

    chatbots[index] = { name: updatedName, url: updatedUrl };

    chrome.storage.sync.set({ chatbots }, function () {
      alert('Chatbot mis à jour avec succès!');
      window.location.href = '../pages/saved_chatbots.html';
    });
  });
});

// Delete chatbot
// Delete chatbot
deleteButton.addEventListener('click', function () {
  const confirmation = confirm('Es-tu sûr de vouloir supprimer ce chatbot?');
  if (!confirmation) return;

  chrome.storage.sync.get(['chatbots', 'chatbotUrl'], function (result) {
    const chatbots = result.chatbots || [];

    // Check if the chatbot to be deleted exists
    if (!chatbots[index]) {
      alert('Chatbot non trouvé.');
      return;
    }

    const deletedChatbotUrl = chatbots[index].url;
    chatbots.splice(index, 1);

    const updates = { chatbots };

    // If the active chatbot matches the deleted one, clear the active URL
    if (result.chatbotUrl === deletedChatbotUrl) {
      updates.chatbotUrl = null;
    }

    chrome.storage.sync.set(updates, function () {
      alert('Chatbot supprimé avec succès!');
      window.location.href = '../pages/saved_chatbots.html';
    });
  });
});
