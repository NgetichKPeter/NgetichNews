// Open/Close toggle interface switches
function toggleAIChat() {
    const win = document.getElementById('ai-chat-window');
    const btn = document.getElementById('ai-toggle-btn');
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex';
        btn.style.display = 'none';
        loadChatHistory(); // Restore past chats instantly
    } else {
        win.style.display = 'none';
        btn.style.display = 'block';
    }
}

function handleAIPress(e) {
    if (e.key === 'Enter') sendAIMessage();
}

// Scrape your news site text fields for context summary requests
function getWebsiteContentSummary() {
    const mainTitle = document.querySelector('h1')?.innerText || document.title;
    const articleParagraphs = Array.from(document.querySelectorAll('article p, .article-text p'))
                                    .map(p => p.innerText)
                                    .join(" ");
    
    if (articleParagraphs.length > 50) {
        return `This article titled "${mainTitle}" covers the following core events: "${articleParagraphs.substring(0, 300)}..."`;
    }
    return "I am currently monitoring the Ngetich News Homepage index. Let me know if you would like me to process a specific topic segment!";
}

function sendAIMessage() {
    const input = document.getElementById('ai-user-input');
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    saveChatToStorage(text, 'user');
    input.value = '';

    // Human-like natural timing response delays
    setTimeout(() => {
        let aiResponse = "I've logged your query into my core databank. Could you expand on that?";
        const cleanText = text.toLowerCase();

        // Conversational natural text trees
        if (cleanText.includes('summarize') || cleanText.includes('summary') || cleanText.includes('what is this about')) {
            aiResponse = `📊 **Website Intel Matrix Summarization:** ${getWebsiteContentSummary()}`;
        } else if (cleanText.includes('hello') || cleanText.includes('hi ') || cleanText.includes('hey')) {
            aiResponse = "Hey there! 👋 I am the Ngetich News intelligent companion core. I can summarize any article here or chat about current daily trends. What's on your mind?";
        } else if (cleanText.includes('who created') || cleanText.includes('owner')) {
            aiResponse = "This platform and its system cores were architected entirely by Ngetich News. Pretty sleek, right?";
        } else if (cleanText.includes('clear')) {
            localStorage.removeItem('ngetich_chat_history');
            document.getElementById('ai-chat-messages').innerHTML = '';
            aiResponse = "Chat log history wiped cleanly from browser cache.";
        }

        appendMessage(aiResponse, 'bot');
        saveChatToStorage(aiResponse, 'bot');
    }, 1000);
}

// Append chat rows matching WhatsApp mechanics
function appendMessage(text, sender) {
    const container = document.getElementById('ai-chat-messages');
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const rowClass = sender === 'user' ? 'user-row' : 'bot-row';

    container.innerHTML += `
        <div class="msg-row ${rowClass}">
            <div class="bubble">
                ${text}
                <span class="chat-time">${timeString}</span>
            </div>
        </div>
    `;
    container.scrollTop = container.scrollHeight;
}

// Cache arrays locally inside user devices
function saveChatToStorage(text, sender) {
    let history = JSON.parse(localStorage.getItem('ngetich_chat_history')) || [];
    history.push({ text, sender, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    localStorage.setItem('ngetich_chat_history', JSON.stringify(history));
}

function loadChatHistory() {
    const container = document.getElementById('ai-chat-messages');
    container.innerHTML = ''; // Reset container frame
    let history = JSON.parse(localStorage.getItem('ngetich_chat_history')) || [];

    if (history.length === 0) {
        container.innerHTML = `
            <div class="msg-row bot-row">
                <div class="bubble">
                    Welcome to **Ngetich News AI**. I can read this webpage, summarize long articles instantly, or answer your questions. Ask me to "summarize" to try it out!
                </div>
            </div>
        `;
        return;
    }

    history.forEach(msg => {
        const rowClass = msg.sender === 'user' ? 'user-row' : 'bot-row';
        container.innerHTML += `
            <div class="msg-row ${rowClass}">
                <div class="bubble">
                    ${msg.text}
                    <span class="chat-time">${msg.time}</span>
                </div>
            </div>
        `;
    });
    container.scrollTop = container.scrollHeight;
}
