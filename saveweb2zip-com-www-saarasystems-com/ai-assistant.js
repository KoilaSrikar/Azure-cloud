// AI Assistant JavaScript - RAG Chatbot Implementation
class AIAssistant {
    constructor() {
        this.knowledgeBase = null;
        this.chatHistory = [];
        this.isTyping = false;
        this.init();
    }

    async init() {
        console.log('AI Assistant initializing...');
        await this.loadKnowledgeBase();
        this.setupEventListeners();
        this.addWelcomeMessage();
        this.updateCharCount();
        console.log('AI Assistant initialized successfully');
    }

    async loadKnowledgeBase() {
        try {
            const response = await fetch('knowledge-base.json');
            this.knowledgeBase = await response.json();
        } catch (error) {
            console.error('Error loading knowledge base:', error);
            // Fallback knowledge base
            this.knowledgeBase = {
                azure_cost_optimization: {
                    title: "Azure Cost Optimization",
                    content: "We help businesses optimize Azure costs by analyzing resource utilization, removing idle resources, rightsizing virtual machines, and implementing reserved instances for long-term savings."
                },
                data_engineering: {
                    title: "Data Engineering Specialists",
                    content: "We build scalable modern data platforms using Azure Data Factory, Azure Synapse Analytics, Azure Data Lake, and Databricks for analytics and ETL pipelines."
                },
                ai_automation: {
                    title: "AI & Automation Solutions",
                    content: "We provide next-gen AI solutions using Azure Cognitive Services, Azure OpenAI, Machine Learning models, and intelligent workflow automation."
                },
                cloud_migration: {
                    title: "Cloud Migration",
                    content: "We support zero-downtime cloud migration from on-premise or other cloud providers to Azure infrastructure."
                },
                azure_security: {
                    title: "Azure Security",
                    content: "We implement Azure Defender, Sentinel, IAM policies, and compliance frameworks for enterprise-grade security."
                }
            };
        }
    }

    setupEventListeners() {
        // Send button
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send (Shift+Enter for new line)
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', () => {
            this.autoResizeTextarea(messageInput);
            this.updateCharCount();
        });

        // Suggested questions
        document.querySelectorAll('.question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                messageInput.value = question;
                this.autoResizeTextarea(messageInput);
                this.updateCharCount();
                this.sendMessage();
            });
        });

        // Clear chat
        document.getElementById('clearChat').addEventListener('click', () => {
            this.clearChat();
        });

        // Download chat
        document.getElementById('downloadChat').addEventListener('click', () => {
            this.downloadChat();
        });
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    updateCharCount() {
        const messageInput = document.getElementById('messageInput');
        const charCount = document.querySelector('.char-count');
        const currentLength = messageInput.value.length;
        charCount.textContent = `${currentLength} / 500`;
        
        // Change color if approaching limit
        if (currentLength > 450) {
            charCount.style.color = '#ef4444';
        } else if (currentLength > 400) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#64748b';
        }
    }

    addWelcomeMessage() {
        console.log('Adding welcome message...');
        const welcomeMessage = {
            type: 'bot',
            content: "Hi 👋 I am your Azure Solutions Assistant. Ask me about cloud cost optimization, data engineering, AI automation, migration, and security.",
            timestamp: new Date()
        };
        this.addMessageToChat(welcomeMessage);
        console.log('Welcome message added');
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || this.isTyping) return;

        // Add user message
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date()
        };
        this.addMessageToChat(userMessage);

        // Clear input
        messageInput.value = '';
        this.autoResizeTextarea(messageInput);
        this.updateCharCount();

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate processing delay
        await this.delay(1000 + Math.random() * 1000);

        // Get bot response
        const botResponse = await this.generateResponse(message);
        
        // Hide typing indicator
        this.hideTypingIndicator();

        // Add bot message
        this.addMessageToChat(botResponse);

        // Scroll to bottom
        this.scrollToBottom();
    }

    async generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Smart keyword matching logic as requested
        if (lowerMessage.includes("azure cost")) {
            return {
                type: 'bot',
                content: this.knowledgeBase.azure_cost_optimization.content,
                timestamp: new Date()
            };
        }
        
        if (lowerMessage.includes("data")) {
            return {
                type: 'bot',
                content: this.knowledgeBase.data_engineering.content,
                timestamp: new Date()
            };
        }
        
        if (lowerMessage.includes("ai")) {
            return {
                type: 'bot',
                content: this.knowledgeBase.ai_automation.content,
                timestamp: new Date()
            };
        }
        
        if (lowerMessage.includes("cloud migration")) {
            return {
                type: 'bot',
                content: this.knowledgeBase.cloud_migration.content,
                timestamp: new Date()
            };
        }
        
        if (lowerMessage.includes("security")) {
            return {
                type: 'bot',
                content: this.knowledgeBase.azure_security.content,
                timestamp: new Date()
            };
        }

        // Default response for unmatched queries
        const defaultResponses = [
            "I can help you with Azure cost optimization, data engineering, AI solutions, cloud migration, and security. Could you be more specific about which area interests you?",
            "I specialize in Azure solutions including cost optimization, data platforms, AI services, migration, and security. What would you like to know more about?",
            "Based on your question, I'd be happy to help with our Azure services. Could you specify if you're interested in cost optimization, data engineering, AI solutions, migration, or security?"
        ];

        return {
            type: 'bot',
            content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
            timestamp: new Date()
        };
    }

    addMessageToChat(message) {
        console.log('Adding message to chat:', message);
        const chatMessages = document.getElementById('chatMessages');
        
        if (!chatMessages) {
            console.error('Chat messages container not found!');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = message.type === 'bot' ? '🤖' : '👤';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message.content;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(message.timestamp);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        
        chatMessages.appendChild(messageDiv);
        
        // Store in history
        this.chatHistory.push(message);
        
        console.log('Message added, total messages:', this.chatHistory.length);
        
        // Scroll to bottom
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingIndicator = document.getElementById('typingIndicator');
        const sendBtn = document.getElementById('sendBtn');
        
        typingIndicator.style.display = 'block';
        sendBtn.disabled = true;
        
        // Add typing dots animation
        this.addTypingDots();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        const sendBtn = document.getElementById('sendBtn');
        
        typingIndicator.style.display = 'none';
        sendBtn.disabled = false;
        
        // Remove typing dots
        this.removeTypingDots();
    }

    addTypingDots() {
        console.log('Adding typing dots...');
        const chatMessages = document.getElementById('chatMessages');
        
        if (!chatMessages) {
            console.error('Cannot find chat messages container for typing dots');
            return;
        }
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typing-dots';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = '🤖';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<span class="typing-dots">🤔 Thinking...</span>';
        
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        console.log('Typing dots added');
    }

    removeTypingDots() {
        const typingDots = document.getElementById('typing-dots');
        if (typingDots) {
            typingDots.remove();
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatTime(timestamp) {
        return timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    clearChat() {
        if (confirm('Are you sure you want to clear chat history?')) {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '';
            this.chatHistory = [];
            this.addWelcomeMessage();
        }
    }

    downloadChat() {
        if (this.chatHistory.length === 0) {
            alert('No chat history to download.');
            return;
        }

        let chatText = 'AI Assistant Chat History\n';
        chatText += '=' .repeat(50) + '\n\n';
        
        this.chatHistory.forEach((message, index) => {
            chatText += `[${this.formatTime(message.timestamp)}] ${message.type.toUpperCase()}\n`;
            chatText += `${message.content}\n\n`;
        });

        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-assistant-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});

// Add typing dots animation CSS
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: inline-block;
        animation: typing 1.5s infinite;
    }
    
    @keyframes typing {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
    }
`;
document.head.appendChild(style);
