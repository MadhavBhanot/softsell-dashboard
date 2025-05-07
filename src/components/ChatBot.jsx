import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../App';

// Sample predefined responses and questions
const PREDEFINED_QA = {
  "how do i sell my license?": "To sell your license, simply complete the form on our contact page with your license details. Our team will provide a valuation within 24 hours. Once approved, you'll receive payment within 3 business days.",
  
  "what types of licenses do you buy?": "We purchase a wide range of software licenses including Microsoft Office, Adobe Creative Cloud, AutoCAD, Windows OS, and many enterprise software solutions. Both individual and volume licenses are accepted.",
  
  "how much can i get for my license?": "License valuations typically range from 40-70% of the retail price, depending on the software type, remaining subscription period, and market demand. Premium enterprise licenses often fetch higher percentages.",
  
  "is this legal?": "Yes, our service is 100% legal. We only deal with transferable licenses that comply with the software publisher's terms of service. We verify all licenses before purchase to ensure legitimacy.",
  
  "how fast will i get paid?": "After accepting our offer, you'll receive payment within 3 business days. We offer multiple payment options including bank transfer, PayPal, and cryptocurrency.",
  
  "what about privacy?": "We take privacy seriously. Your personal information is encrypted and never shared with third parties. License information is only used to verify legitimacy and complete the transaction."
};

// Default suggestions to show users
const SUGGESTED_QUESTIONS = [
  "How do I sell my license?",
  "What types of licenses do you buy?",
  "How much can I get for my license?",
  "Is this legal?",
  "How fast will I get paid?"
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm SoftSell Assistant. How can I help you today?", isBot: true, timestamp: new Date() },
    { id: 2, text: "Note: This is a demo chat with pre-programmed responses, not an actual AI.", isBot: true, timestamp: new Date(Date.now() + 100) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { isDark } = useContext(ThemeContext);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage = { 
      id: messages.length + 1, 
      text, 
      isBot: false, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const response = getResponse(text);
      const botMessage = { 
        id: messages.length + 2, 
        text: response, 
        isBot: true, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  // Get response based on user input
  const getResponse = (text) => {
    const normalizedInput = text.toLowerCase().trim();
    
    // Check for predefined QA pairs
    for (const [question, answer] of Object.entries(PREDEFINED_QA)) {
      if (normalizedInput.includes(question) || 
          question.includes(normalizedInput) || 
          normalizedInput.split(' ').some(word => question.includes(word) && word.length > 3)) {
        return answer;
      }
    }
    
    // Fallback response if no match found
    return "I don't have specific information about that. Please contact our support team for more details, or try asking about our license selling process, payment methods, or supported software.";
  };
  
  // Format timestamp for messages
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chat button - positioned in the bottom left corner */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isDark 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
        } ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
      
      {/* Chat window */}
      <div className={`fixed bottom-20 right-6 z-50 w-80 sm:w-96 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className={`rounded-xl overflow-hidden shadow-2xl flex flex-col transition-colors duration-300 ${
          isDark 
            ? 'bg-[#1a123a] border border-purple-900/30'
            : 'bg-white border border-gray-200'
        }`}>
          {/* Chat header */}
          <div className={`p-4 ${
            isDark ? 'bg-indigo-900' : 'bg-indigo-600'
          } text-white flex justify-between items-center`}>
            <div className="flex items-center">
              <div className="mr-3 bg-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">SoftSell Assistant</h3>
                <p className="text-xs text-white/70 mt-0.5">Demo Chat (Prewritten Responses)</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Messages container */}
          <div className={`flex-1 p-4 overflow-y-auto max-h-96 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {messages.map(message => (
              <div 
                key={message.id}
                className={`mb-3 ${message.isBot ? 'text-left' : 'text-right'}`}
              >
                <div className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                  message.isBot 
                    ? isDark 
                      ? 'bg-indigo-800/40 text-white' 
                      : 'bg-indigo-100 text-gray-800'
                    : isDark 
                      ? 'bg-purple-700/30 text-white' 
                      : 'bg-purple-100 text-gray-800'
                }`}>
                  {message.text}
                </div>
                <div className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="mb-3 text-left">
                <div className={`inline-block rounded-lg px-4 py-2 ${
                  isDark ? 'bg-indigo-800/40 text-white' : 'bg-indigo-100 text-gray-800'
                }`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested questions */}
          {messages.length < 4 && (
            <div className={`px-4 py-2 ${
              isDark ? 'border-t border-purple-900/30' : 'border-t border-gray-200'
            }`}>
              <p className={`text-xs mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className={`text-xs rounded-full px-3 py-1 ${
                      isDark 
                        ? 'bg-indigo-800/40 text-white hover:bg-indigo-700/40' 
                        : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                    }`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input area */}
          <div className={`p-3 ${
            isDark ? 'border-t border-purple-900/30' : 'border-t border-gray-200'
          }`}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 px-4 py-2 rounded-l-lg focus:outline-none ${
                  isDark 
                    ? 'bg-[#12082e] text-white border-purple-900/30 border' 
                    : 'bg-gray-100 text-gray-900 border-gray-200 border'
                }`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`px-4 py-2 rounded-r-lg transition-colors ${
                  inputValue.trim()
                    ? isDark 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    : isDark 
                      ? 'bg-indigo-800/40 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot; 