import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Study Assistant</h3>
            <p className="text-gray-600">
              Your intelligent companion for effective learning and study management.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-2">
              <li><a href="/chat" className="text-gray-600 hover:text-blue-600">AI Chat Assistant</a></li>
              <li><a href="/notes-summarizer" className="text-gray-600 hover:text-blue-600">Notes Summarizer</a></li>
              <li><a href="/study-plan" className="text-gray-600 hover:text-blue-600">Study Plan Generator</a></li>
              <li><a href="/flashcards" className="text-gray-600 hover:text-blue-600">Flashcards</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/history" className="text-gray-600 hover:text-blue-600">History</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaGithub className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaEnvelope className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} AI Study Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 