import { Link } from 'react-router-dom';
import { FaBook, FaClipboardList, FaQuestionCircle, FaCode, FaLightbulb, FaBrain } from 'react-icons/fa';

const features = [
  {
    title: 'Notes Summarizer',
    description: 'Transform your lengthy notes into concise, easy-to-understand summaries. Perfect for quick revision and better retention.',
    icon: <FaClipboardList className="w-8 h-8" />,
    path: '/notes-summarizer',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Study Plan Generator',
    description: 'Create personalized study plans based on your topics and available time. Get structured schedules and study recommendations.',
    icon: <FaBook className="w-8 h-8" />,
    path: '/study-plan',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'MCQ Generator',
    description: 'Generate multiple-choice questions from your study material. Test your knowledge and prepare for exams effectively.',
    icon: <FaQuestionCircle className="w-8 h-8" />,
    path: '/mcq-generator',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Code Explainer',
    description: 'Understand complex code snippets with detailed explanations. Perfect for programming students and developers.',
    icon: <FaCode className="w-8 h-8" />,
    path: '/code-explainer',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    title: 'Flashcard Generator',
    description: 'Create interactive flashcards from your study material. Enhance your learning with spaced repetition.',
    icon: <FaLightbulb className="w-8 h-8" />,
    path: '/flashcard-generator',
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'AI Chat Assistant',
    description: 'Get instant help with your study questions. Our AI assistant is here to guide you through your learning journey.',
    icon: <FaBrain className="w-8 h-8" />,
    path: '/chat',
    color: 'bg-indigo-100 text-indigo-600'
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              AI Study Assistant
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your intelligent companion for effective learning. Generate study materials, get explanations, and enhance your learning experience with AI.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`${feature.color} p-3 rounded-lg inline-block mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">
                {feature.description}
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-500">
                Try it now →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} AI Study Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 