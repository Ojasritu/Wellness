import React, { useState, useRef, useEffect } from 'react';
import './AyurvedicChatbot.css';

const AyurvedicChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'नमस्ते! 🙏 Ojasritu Wellness में आपका स्वागत है। मैं एक AI-संचालित आयुर्वेद विशेषज्ञ हूँ। क्या आप अपने स्वास्थ्य के बारे में कुछ जानना चाहते हैं?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: userText,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const csrfToken = getCookie('csrftoken');
      
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRFToken': csrfToken }),
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userText,
          language: language,
          history: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: data.message,
          timestamp: new Date(),
          isResponse: true
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'API Error');
      }
    } catch (error) {
      console.error('Chatbot Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें। / Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'दोष विश्लेषण', value: 'dosha' },
    { label: 'आयुर्वेद टिप्स', value: 'tips' },
    { label: 'उत्पाद सुझाव', value: 'products' },
    { label: 'परामर्श बुक करें', value: 'booking' }
  ];

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
    <div className="ayurvedic-chatbot-container">
      {/* Chatbot Widget Toggle Button */}
      <button 
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close Chat' : 'Open Chat'}
      >
        <span className="chatbot-icon">💬</span>
        <span className="chatbot-status">नमस्ते</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <h3>🧘 Ojasritu Wellness AI</h3>
              <p className="chatbot-subtitle">आयुर्वेद विशेषज्ञ</p>
            </div>
            <button 
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Language Selector */}
          <div className="language-selector">
            <button
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिंदी
            </button>
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'} ${
                  message.isError ? 'error-message' : ''
                }`}
              >
                <div className="message-avatar">
                  {message.type === 'user' ? '👤' : '🧘‍♀️'}
                </div>
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot-message typing">
                <div className="message-avatar">🧘‍♀️</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="quick-actions">
              {quickActions.map((action) => (
                <button
                  key={action.value}
                  className="quick-action-btn"
                  onClick={() => {
                    setInput(action.label);
                    setTimeout(() => {
                      document.querySelector('.chatbot-send-btn')?.click();
                    }, 100);
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'hi' ? 'अपना सवाल पूछें...' : 'Ask your question...'}
              disabled={loading}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="chatbot-send-btn"
            >
              {loading ? '...' : '📤'}
            </button>
          </form>

          {/* Footer */}
          <div className="chatbot-footer">
            <p className="footer-disclaimer">
              {language === 'hi'
                ? '⚠️ यह किसी चिकित्सीय सलाह का विकल्प नहीं है।'
                : '⚠️ This is not a substitute for medical advice.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AyurvedicChatbot;
