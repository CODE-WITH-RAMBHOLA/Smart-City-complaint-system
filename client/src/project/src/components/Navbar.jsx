import { Link, useLocation } from 'react-router-dom';
import { FaRobot, FaBars, FaTimes, FaChevronDown, FaUser } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const mainFeatures = [
    { path: '/', label: 'Home' },
    { path: '/chat', label: 'Chat' },
    { path: '/notes-summarizer', label: 'Notes' },
    { path: '/study-plan', label: 'Study Plan' }
  ];

  const allFeatures = [
    { path: '/mcq-generator', label: 'MCQ Generator' },
    { path: '/code-explainer', label: 'Code Explainer' },
    { path: '/flashcards', label: 'Flashcards' },
    { path: '/video-summarizer', label: 'Video Summarizer' },
    { path: '/math-solver', label: 'Math Solver' },
    { path: '/slides-generator', label: 'Slides Generator' },
    { path: '/concept-comparison', label: 'Concept Comparison' },
    { path: '/career-assistant', label: 'Career Assistant' }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <FaRobot className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">AI Study Assistant</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {mainFeatures.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                More Features
                <FaChevronDown className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {allFeatures.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-4 py-2 text-sm ${
                          location.pathname === link.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Link */}
            <a
              href="https://sudhir-react-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <FaUser className="mr-2" />
              Profile
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {mainFeatures.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <div className="px-3 py-2 text-base font-medium text-gray-600">
                More Features
              </div>
              {allFeatures.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-6 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {/* Mobile Profile Link */}
            <a
              href="https://sudhir-react-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setIsOpen(false)}
            >
              <FaUser className="mr-2" />
              Profile
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 