import { useState } from 'react';
import { FaSpinner, FaClipboard, FaYoutube, FaExclamationTriangle } from 'react-icons/fa';
import { generateVideoSummary } from '../../utils/gemini';
import { addToHistory } from '../../utils/localStorage';
import { STORAGE_KEYS } from '../../utils/localStorage';

const VideoSummarizer = () => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSummary('');
      const result = await generateVideoSummary(url);
      setSummary(result);

      // Add to history
      addToHistory(STORAGE_KEYS.STUDY_HISTORY, {
        type: 'video_summary',
        content: `Summarized video: ${url}`,
        summary: result
      });
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      // Create a temporary element to strip HTML tags for clipboard
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = summary;
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
          <FaYoutube className="text-3xl text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">YouTube Video Summarizer</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col space-y-4">
            <label htmlFor="video-url" className="text-lg font-medium text-gray-700">
              Enter YouTube Video URL
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                id="video-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaYoutube />
                    Summarize
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Video Summary</h3>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FaClipboard />
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>
            <div className="prose prose-lg max-w-none">
              <div
                className="rounded-lg bg-gray-50 p-6 shadow-sm"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSummarizer; 