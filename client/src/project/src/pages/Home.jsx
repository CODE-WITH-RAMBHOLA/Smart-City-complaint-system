import { Link } from 'react-router-dom';
import { FaRobot, FaBook, FaCalendarAlt, FaQuestionCircle, FaCode, FaLayerGroup, FaCheckSquare, FaYoutube, FaBalanceScale, FaBriefcase, FaCalculator, FaFilePowerpoint } from 'react-icons/fa';
import TodoList from '../features/todo/TodoList';

const Home = () => {
  const features = [
    {
      title: 'AI Chat Assistant',
      description: 'Get instant answers to your questions and study-related queries.',
      icon: <FaRobot className="text-4xl text-blue-500" />,
      path: '/ai-assistant/chat'
    },
    {
      title: 'Notes Summarizer',
      description: 'Summarize your study notes into concise, easy-to-understand points.',
      icon: <FaBook className="text-4xl text-blue-500" />,
      path: '/ai-assistant/notes-summarizer'
    },
    {
      title: 'Study Plan Generator',
      description: 'Create personalized study plans based on your topics and time.',
      icon: <FaCalendarAlt className="text-4xl text-blue-500" />,
      path: '/ai-assistant/study-plan'
    },
    {
      title: 'MCQ Generator',
      description: 'Generate multiple-choice questions to test your knowledge.',
      icon: <FaQuestionCircle className="text-4xl text-blue-500" />,
      path: '/ai-assistant/mcq-generator'
    },
    {
      title: 'Code Explainer',
      description: 'Get detailed explanations of code snippets in various programming languages.',
      icon: <FaCode className="text-4xl text-blue-500" />,
      path: '/ai-assistant/code-explainer'
    },
    {
      title: 'Flashcards',
      description: 'Create and study with AI-generated flashcards for better retention.',
      icon: <FaLayerGroup className="text-4xl text-blue-500" />,
      path: '/ai-assistant/flashcards'
    },
    {
      title: 'Todo List',
      description: 'Manage your study tasks and track your progress.',
      icon: <FaCheckSquare className="text-4xl text-blue-500" />,
      path: '/ai-assistant/todo'
    },
    {
      title: 'Video Summarizer',
      description: 'Get AI-powered summaries of educational YouTube videos.',
      icon: <FaYoutube className="text-4xl text-blue-500" />,
      path: '/ai-assistant/video-summarizer'
    },
    {
      title: 'Concept Comparison',
      description: 'Compare and contrast two concepts side by side.',
      icon: <FaBalanceScale className="text-4xl text-blue-500" />,
      path: '/ai-assistant/concept-comparison'
    },
    {
      title: 'Career Assistant',
      description: 'Get personalized guidance for job and internship preparation.',
      icon: <FaBriefcase className="text-4xl text-blue-500" />,
      path: '/ai-assistant/career-assistant'
    },
    {
      title: 'Math Solver',
      description: 'Solve mathematical problems with step-by-step solutions.',
      icon: <FaCalculator className="text-4xl text-blue-500" />,
      path: '/ai-assistant/math-solver'
    },
    {
      title: 'Slides Generator',
      description: 'Generate professional presentation slides for your projects.',
      icon: <FaFilePowerpoint className="text-4xl text-blue-500" />,
      path: '/ai-assistant/slides-generator'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to AI Study Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your intelligent companion for effective learning and study management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.path}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Tasks</h2>
        <TodoList />
      </div>
    </div>
  );
};

export default Home; 