import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://jnrwwtmmxfpzqocvwcjk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impucnd3dG1teGZwenFvY3Z3Y2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MzUwOTMsImV4cCI6MjA1MzIxMTA5M30.bmAk383bGToVZAtuznwdKnEkAfLIGqyGOv_uSIBeWE4';
const supabase = createClient(supabaseUrl, supabaseKey);

let lastMessageTime = null;

// Enable chat functionality
function enableChat() {
    const input = document.getElementById('message-input');
    const button = document.getElementById('send-button');

    input.disabled = false;
    button.disabled = false;

    button.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
}

// Load messages from the Chat table
async function loadMessages() {
    const { data, error } = await supabase
        .from('Chat')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error loading messages:', error);
        return;
    }

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';

    data.forEach(({ Message }) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'other-message');
        messageElement.textContent = Message;
        chatBox.appendChild(messageElement);
    });

    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Send a message
function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    const errorMessage = document.getElementById('error-message');

    if (!message) return;

    errorMessage.textContent = '';

    // Check if the user is sending messages too quickly
    const now = new Date();
    if (lastMessageTime && (now - lastMessageTime) / 1000 < 10) {
        const remainingTime = Math.ceil(10 - (now - lastMessageTime) / 1000);
        errorMessage.textContent = `Please wait ${remainingTime} seconds before sending another message.`;
        return;
    }

    lastMessageTime = now; // Update the last message time

    // Insert message into Chat table
    supabase
        .from('Chat')
        .insert([{ Message: message }])
        .then(() => {
            input.value = '';
            loadMessages();
        })
        .catch((error) => console.error('Error sending message:', error));
}

// Initialize chat on page load
enableChat();
loadMessages();
