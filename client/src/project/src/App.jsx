import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './features/chat/Chat';
import NotesSummarizer from './features/notes/NotesSummarizer';
import StudyPlanGenerator from './features/study/StudyPlanGenerator';
import MCQGenerator from './features/quiz/MCQGenerator';
import CodeExplainer from './features/code/CodeExplainer';
import FlashcardGenerator from './features/flashcards/FlashcardGenerator';
import TodoList from './features/todo/TodoList';
import VideoSummarizer from './features/video/VideoSummarizer';
import ConceptComparison from './features/compare/ConceptComparison';
import CareerAssistant from './features/career/CareerAssistant';
import MathSolver from './features/math/MathSolver';
import SlidesGenerator from './features/slides/SlidesGenerator';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { useState, useRef, useEffect } from 'react';

const GEMINI_API_KEY = 'AIzaSyBdMTyiPONO-Db72RYClR6bEo-CD78SRSE';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: input
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="h-[400px] overflow-y-auto mb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="text-center text-gray-500">
                      Thinking...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Type your message..."
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/notes-summarizer" element={<NotesSummarizer />} />
            <Route path="/study-plan" element={<StudyPlanGenerator />} />
            <Route path="/mcq-generator" element={<MCQGenerator />} />
            <Route path="/code-explainer" element={<CodeExplainer />} />
            <Route path="/flashcards" element={<FlashcardGenerator />} />
            <Route path="/todo" element={<TodoList />} />
            <Route path="/video-summarizer" element={<VideoSummarizer />} />
            <Route path="/concept-comparison" element={<ConceptComparison />} />
            <Route path="/career-assistant" element={<CareerAssistant />} />
            <Route path="/math-solver" element={<MathSolver />} />
            <Route path="/slides-generator" element={<SlidesGenerator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 