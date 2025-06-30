import { useState } from 'react';
import { FaBriefcase, FaSpinner, FaExclamationTriangle, FaClipboard } from 'react-icons/fa';
import { generateResponse } from '../../utils/gemini';
import { addToHistory } from '../../utils/localStorage';
import { STORAGE_KEYS } from '../../utils/localStorage';

const CareerAssistant = () => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Please enter a job role');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setResponse('');

      const prompt = `Help me prepare for a ${role} position${company ? ` at ${company}` : ''}. 
      Please provide a comprehensive preparation guide including:

      # Role Overview
      • Key responsibilities and expectations
      • Required skills and qualifications
      • Industry standards and best practices

      # Technical Preparation
      • Essential technical skills to master
      • Common tools and technologies used
      • Recommended learning resources

      # Interview Preparation
      • Common interview questions and answers
      • Technical assessment tips
      • Behavioral interview guidance

      # Portfolio & Projects
      • Relevant project ideas
      • Portfolio building tips
      • GitHub repository suggestions

      # Career Growth
      • Learning path recommendations
      • Certifications to consider
      • Industry trends to follow

      Please provide detailed, actionable advice.`;

      const result = await generateResponse([{ role: 'user', content: prompt }]);
      setResponse(result);

      // Add to history
      addToHistory(STORAGE_KEYS.STUDY_HISTORY, {
        type: 'career_preparation',
        content: `Career prep for: ${role}${company ? ` at ${company}` : ''}`,
        summary: result
      });
    } catch (err) {
      setError(err.message || 'Failed to generate preparation guide');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      // Create a temporary element to strip HTML tags for clipboard
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = response;
      const textContent = tempDiv.textContent || tempDiv.innerText;
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaBriefcase className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Career Preparation Assistant</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="text-lg font-medium text-gray-700">
                Job Role
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Frontend Developer, Data Scientist"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="company" className="text-lg font-medium text-gray-700">
                Company (Optional)
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Microsoft"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || !role.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Generating Guide...
                </>
              ) : (
                <>
                  <FaBriefcase />
                  Generate Preparation Guide
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        {response && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Preparation Guide</h3>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FaClipboard />
                {copied ? 'Copied!' : 'Copy Guide'}
              </button>
            </div>
            <div className="prose prose-lg max-w-none">
              <div
                className="rounded-lg bg-gray-50 p-6 shadow-sm"
                dangerouslySetInnerHTML={{ __html: response }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerAssistant; 