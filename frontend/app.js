const API_BASE_URL = 'http://localhost:8000';

class ChatBot {
    constructor() {
        this.conversationHistory = [];
        this.messageInput = document.getElementById('messageInput');
        this.chatMessages = document.getElementById('chatMessages');
        this.errorMessage = document.getElementById('errorMessage');
        this.chatForm = document.getElementById('chatForm');
        this.clearBtn = document.getElementById('clearBtn');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.documentText = document.getElementById('documentText');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearBtn.addEventListener('click', () => this.clearChat());
        this.uploadBtn.addEventListener('click', () => this.uploadDocument());
        
        // Real-time validation
        this.messageInput.addEventListener('input', (e) => this.validateInput(e.target));
    }
    
    validateInput(input) {
        const value = input.value.trim();
        
        // Clear previous errors
        this.showError('');
        
        // Validation rules
        if (value.length === 0) {
            return false;
        }
        
        if (value.length > 500) {
            this.showError('Message too long (max 500 characters)');
            return false;
        }
        
        // Check for potential XSS patterns
        const xssPattern = /<script|javascript:|onerror=/i;
        if (xssPattern.test(value)) {
            this.showError('Invalid characters detected');
            return false;
        }
        
        return true;
    }
    
    sanitizeInput(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.messageInput.value.trim();
        
        // Validate
        if (!this.validateInput(this.messageInput)) {
            return;
        }
        
        // Sanitize input
        const sanitizedMessage = this.sanitizeInput(message);
        
        // Add user message to UI
        this.addMessage(sanitizedMessage, 'user');
        this.conversationHistory.push(sanitizedMessage);
        
        // Clear input
        this.messageInput.value = '';
        
        // Show loading
        const loadingId = this.addMessage('Thinking...', 'assistant', true);
        
        try {
            const response = await this.sendMessage(sanitizedMessage);
            
            // Remove loading message
            document.getElementById(loadingId).remove();
            
            // Add assistant response
            this.addMessage(response.response, 'assistant');
            this.conversationHistory.push(response.response);
            
            // Show sources if available
            if (response.sources && response.sources.length > 0) {
                this.addSources(response.sources);
            }
            
        } catch (error) {
            document.getElementById(loadingId).remove();
            this.showError('Failed to get response. Please try again.');
            console.error(error);
        }
    }
    
    async sendMessage(message) {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation_history: this.conversationHistory.slice(-10)
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    }
    
    addMessage(text, sender, isLoading = false) {
        const messageDiv = document.createElement('div');
        const messageId = `msg-${Date.now()}`;
        messageDiv.id = messageId;
        messageDiv.className = `message ${sender}-message ${isLoading ? 'loading' : ''}`;
        messageDiv.textContent = text;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        return messageId;
    }
    
    addSources(sources) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'sources';
        sourcesDiv.innerHTML = '<strong>Sources:</strong>';
        
        sources.forEach((source, index) => {
            const sourceItem = document.createElement('div');
            sourceItem.className = 'source-item';
            sourceItem.textContent = `${index + 1}. ${source.text.substring(0, 100)}... (score: ${source.score.toFixed(2)})`;
            sourcesDiv.appendChild(sourceItem);
        });
        
        this.chatMessages.appendChild(sourcesDiv);
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = message ? 'block' : 'none';
    }
    
    clearChat() {
        this.conversationHistory = [];
        this.chatMessages.innerHTML = '';
        this.showError('');
    }
    
    async uploadDocument() {
        const text = this.documentText.value.trim();
        
        if (text.length === 0) {
            this.showError('Please enter document content');
            return;
        }
        
        try {
            const documents = [{
                id: `doc-${Date.now()}`,
                text: text,
                metadata: { uploaded_at: new Date().toISOString() }
            }];
            
            const response = await fetch(`${API_BASE_URL}/upload-knowledge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(documents)
            });
            
            if (response.ok) {
                alert('Document uploaded successfully!');
                this.documentText.value = '';
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            this.showError('Failed to upload document');
            console.error(error);
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});