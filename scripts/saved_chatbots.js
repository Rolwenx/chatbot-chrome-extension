document.addEventListener('DOMContentLoaded', function () {
    const chatbotList = document.getElementById('chatbot-list');
  
    chrome.storage.sync.get({ chatbots: [] }, function (result) {
      const chatbots = result.chatbots;
  
      if (chatbots.length === 0) {
        chatbotList.innerHTML = '<p class="text-gray-700">Aucun chatbot sauvegardé.</p>';
      } else {
        chatbots.forEach((chatbot, index) => {
          const chatbotEntry = document.createElement('div');
          chatbotEntry.className = "mb-4 p-2 border border-gray-300 rounded bg-gray-50";
  
          chatbotEntry.innerHTML = `
            <p class="font-semibold">${chatbot.name}</p>
            <p class="text-sm italic text-gray-600">${chatbot.url}</p>
            <button data-index="${index}" class="edit-chatbot mt-2 text-blue-500 hover:underline">Editer</button>
            <button data-index="${index}" class="use-chatbot mt-2 text-white-500 rounded-md hover:underline bg-blue-400 text-white py-2 px-2 hover:bg-blue-600">Utiliser</button>
          `;
  
          chatbotList.appendChild(chatbotEntry);
        });
      }
    });
  
    // Handle adding a new chatbot
    document.getElementById('add-new-chatbot').addEventListener('click', function () {
      window.location.href = '../pages/options.html';
    });
  
    // Handle editing a chatbot
    chatbotList.addEventListener('click', function (e) {
      if (e.target.classList.contains('edit-chatbot')) {
        const index = e.target.getAttribute('data-index');
        window.location.href = `../pages/edit_chatbot.html?index=${index}`;
      }
    });

    // Handle setting chatbot as active
    chatbotList.addEventListener('click', function (e) {
      if (e.target.classList.contains('use-chatbot')) {
        const index = e.target.getAttribute('data-index');
        chrome.storage.sync.get({ chatbots: [] }, function (result) {
          const chatbots = result.chatbots;
          if (chatbots[index]) {
            const activeChatbotUrl = chatbots[index].url;
            // Save both the active chatbot index and its URL
            chrome.storage.sync.set({ 
              activeChatbotIndex: index, 
              chatbotUrl: activeChatbotUrl 
            }, function () {
              alert('Chatbot activé avec succès!');
            });
          }
        });
      }
    });
    
  });
  