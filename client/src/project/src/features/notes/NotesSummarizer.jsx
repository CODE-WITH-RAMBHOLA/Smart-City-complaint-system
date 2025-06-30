import { useState } from 'react';
import { generateGeminiResponse } from '../../utils/geminiApi';

function NotesSummarizer() {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Please summarize the following notes in a clear and concise way. Format the response with proper paragraphs and bullet points where appropriate:\n\n${notes}`;
      const response = await generateGeminiResponse(prompt);
      setSummary(response);
    } catch (error) {
      setSummary('Sorry, there was an error processing your notes.');
    }
    setIsLoading(false);
  };

  const formatSummary = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('•')) {
        return <li key={index} className="ml-4 mb-2">{line}</li>;
      } else if (/^\d+\./.test(line)) {
        return <li key={index} className="ml-4 mb-2">{line}</li>;
      }
      return <p key={index} className="mb-4">{line}</p>;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Notes Summarizer</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Input Notes</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-[400px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="Paste your notes here..."
              />
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Summarizing...' : 'Summarize Notes'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Summary</h2>
            <div className="h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {summary ? (
                <div className="prose max-w-none">
                  {formatSummary(summary)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <p>Your summary will appear here...</p>
                  <p className="text-sm mt-2">The summary will be formatted with proper paragraphs and bullet points for better readability.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotesSummarizer; 