import { useState } from 'react';
import { FaClipboard, FaSpinner } from 'react-icons/fa';
import { generateStudyPlan } from '../utils/gemini';

const StudyPlanGenerator = () => {
  const [topics, setTopics] = useState('');
  const [duration, setDuration] = useState('');
  const [studyPlan, setStudyPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topics.trim() || !duration.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await generateStudyPlan(topics, duration);
      setStudyPlan(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(studyPlan);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Study Plan Generator</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="topics" className="text-sm font-medium text-gray-700">
            Topics to Study
          </label>
          <input
            id="topics"
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="e.g., Calculus, Physics, Chemistry"
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="duration" className="text-sm font-medium text-gray-700">
            Study Duration
          </label>
          <input
            id="duration"
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 2 weeks, 1 month, 3 months"
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2"
          disabled={isLoading || !topics.trim() || !duration.trim()}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Generating Plan...
            </>
          ) : (
            'Generate Study Plan'
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {studyPlan && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-700">Your Study Plan</h3>
            <button
              onClick={copyToClipboard}
              className="btn-secondary flex items-center gap-2"
            >
              <FaClipboard />
              Copy
            </button>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="prose prose-sm max-w-none">
              {studyPlan.split('\n').map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanGenerator; 