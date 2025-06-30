import { useState, useEffect } from 'react';
import { FaTrash, FaClock, FaBook, FaCode, FaGraduationCap, FaQuestionCircle, FaClipboard } from 'react-icons/fa';
import { getFromLocalStorage, clearHistory, STORAGE_KEYS } from '../utils/localStorage';

const History = () => {
  const [activeTab, setActiveTab] = useState('study');
  const [history, setHistory] = useState([]);

  const tabs = [
    { id: 'chat', label: 'Chat', key: STORAGE_KEYS.CHAT_HISTORY },
    { id: 'notes', label: 'Notes', key: STORAGE_KEYS.NOTES_HISTORY },
    { id: 'code', label: 'Code', key: STORAGE_KEYS.CODE_HISTORY },
    { id: 'study', label: 'Study', key: STORAGE_KEYS.STUDY_HISTORY },
    { id: 'quiz', label: 'Quiz', key: STORAGE_KEYS.QUIZ_HISTORY },
    { id: 'flashcards', label: 'Flashcards', key: STORAGE_KEYS.FLASHCARDS_HISTORY }
  ];

  useEffect(() => {
    loadHistory();
  }, [activeTab]);

  const loadHistory = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    console.log('Loading history for tab:', currentTab);
    const historyData = getFromLocalStorage(currentTab.key) || [];
    console.log('Loaded history data:', historyData);
    setHistory(historyData);
  };

  const handleClearHistory = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    clearHistory(currentTab.key);
    setHistory([]);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'notes': return <FaBook />;
      case 'code': return <FaCode />;
      case 'study': return <FaGraduationCap />;
      case 'quiz': return <FaQuestionCircle />;
      case 'flashcards': return <FaClipboard />;
      default: return <FaClock />;
    }
  };

  const renderContent = (item) => {
    // If the content is HTML (study plans, notes, etc.)
    if (typeof item.content === 'string' && item.content.includes('</')) {
      return (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: item.content }} 
        />
      );
    }

    // If there's a specific query or summary field
    if (item.query) {
      return <p className="text-gray-800">{item.query}</p>;
    }

    // For other types of content
    return (
      <div>
        {item.topics && (
          <p className="font-medium mb-2">
            Topics: {item.topics}
          </p>
        )}
        {item.duration && (
          <p className="text-gray-600 mb-2">
            Duration: {item.duration}
          </p>
        )}
        {item.content && (
          <p className="text-gray-800">
            {typeof item.content === 'string' ? item.content : JSON.stringify(item.content)}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">History</h1>
          <button
            onClick={handleClearHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaTrash />
            <span>Clear History</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No history found for {activeTab}
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={item.id || `${item.timestamp}-${index}`}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 w-full">
                    <span className="text-blue-600 text-xl mt-1">
                      {getIcon(activeTab)}
                    </span>
                    <div className="flex-1">
                      {renderContent(item)}
                      <p className="text-sm text-gray-500 mt-2">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History; 