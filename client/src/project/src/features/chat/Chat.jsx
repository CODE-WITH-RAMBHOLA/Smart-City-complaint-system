import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner, FaTrash, FaRobot, FaUser } from 'react-icons/fa';
import { generateGeminiResponse } from '../../utils/geminiApi';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateGeminiResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    }

    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Modern, colorful, Gemini-like formatting
  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('•')) {
        return (
          <div key={index} className="flex items-start gap-3 mb-2">
            <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 mt-2 shadow-md"></span>
            <span className="text-base md:text-lg font-medium text-gray-900">{line.substring(1).trim()}</span>
          </div>
        );
      } else if (/^\d+\./.test(line)) {
        return (
          <div key={index} className="flex items-start gap-3 mb-2">
            <span className="inline-block w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold text-base shadow-md mt-1">{line.match(/^\d+/)[0]}</span>
            <span className="text-base md:text-lg font-medium text-gray-900">{line.substring(line.indexOf('.') + 1).trim()}</span>
          </div>
        );
      } else if (line.startsWith('#')) {
        return (
          <div key={index} className="flex items-center gap-2 mt-6 mb-3">
            <span className="inline-block w-2 h-8 rounded bg-gradient-to-b from-blue-400 to-cyan-400"></span>
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-500 bg-clip-text text-transparent drop-shadow-md">{line.substring(1).trim()}</h3>
          </div>
        );
      }
      return <p key={index} className="mb-2 text-base md:text-lg text-gray-800 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-3 shadow-sm w-full">
        <div className="flex justify-between items-center w-full max-w-full">
          <div className="flex items-center gap-3">
            <FaRobot className="text-2xl text-blue-500" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">AI Study Assistant</h2>
          </div>
          <button
            onClick={clearChat}
            className="text-gray-500 hover:text-blue-600 flex items-center gap-2 text-base md:text-lg font-medium transition-colors rounded-lg px-3 py-1.5 bg-gray-100 hover:bg-blue-50 shadow-sm"
          >
            <FaTrash />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 flex flex-col justify-end w-full px-0 md:px-8 py-6">
        <div className="w-full max-w-full flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <FaRobot className="text-7xl md:text-8xl text-blue-500 mb-4 drop-shadow-lg" />
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome to AI Study Assistant
              </h3>
              <p className="text-gray-600 max-w-xl text-lg md:text-xl">
                Ask me anything, and I'll help you with your questions or tasks.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } w-full`}
              >
                <div
                  className={`rounded-3xl p-6 md:p-8 w-full shadow-xl transition-all duration-300 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                      : 'bg-white/90 backdrop-blur-lg border border-blue-100'
                  }`}
                  style={{ minWidth: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {message.role === 'user' ? (
                      <FaUser className="text-white text-xl md:text-2xl" />
                    ) : (
                      <FaRobot className="text-blue-500 text-xl md:text-2xl" />
                    )}
                    <span className={`font-semibold text-lg md:text-xl ${message.role === 'user' ? 'text-white' : 'text-blue-700'}`}>
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  <div className={`prose max-w-full ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}
                    style={{ wordBreak: 'break-word' }}>
                    {formatMessage(message.content)}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="bg-white/90 rounded-3xl p-8 shadow-xl w-full border border-blue-100 flex items-center gap-3">
                <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                <span className="text-gray-600 text-lg md:text-xl">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/90 backdrop-blur px-0 md:px-8 py-4 w-full">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="relative w-full flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-4 pr-16 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-lg md:text-xl shadow-md bg-white/80"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-2xl px-6 py-2 text-lg md:text-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 