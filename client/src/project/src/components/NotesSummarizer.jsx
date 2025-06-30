import { useState } from 'react';
import { FaClipboard, FaSpinner } from 'react-icons/fa';
import { summarizeNotes } from '../utils/gemini';

const NotesSummarizer = () => {
  const [originalText, setOriginalText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await summarizeNotes(originalText);
      setSummary(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Notes Summarizer</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="Paste your notes here..."
          className="min-h-[200px] p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2"
          disabled={isLoading || !originalText.trim()}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Summarizing...
            </>
          ) : (
            'Summarize Notes'
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-700">Summary</h3>
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
              {summary.split('\n').map((line, index) => (
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

export default NotesSummarizer; 