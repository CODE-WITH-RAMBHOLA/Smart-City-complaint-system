import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner, FaTrash } from 'react-icons/fa';
import { generateResponse } from '../utils/gemini';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Generate response based on conversation history
      const response = await generateResponse([...messages, userMessage]);
      
      // Add AI response with formatted content
      const aiMessage = { 
        role: 'assistant', 
        content: response,
        formatted: true // Flag to indicate this is a formatted response
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">AI Chat Assistant</h2>
          <button
            onClick={clearChat}
            className="btn-secondary flex items-center gap-2"
          >
            <FaTrash />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Start a conversation with the AI assistant</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-white">{message.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div
                      className="space-y-4"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <FaSpinner className="animate-spin text-gray-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
            Send
          </button>
        </form>
        {error && (
          <div className="mt-2 p-2 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat; 