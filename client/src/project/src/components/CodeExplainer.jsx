import { useState } from 'react';
import { FaClipboard, FaSpinner } from 'react-icons/fa';
import { explainCode } from '../utils/gemini';

const CodeExplainer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [explanations, setExplanations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await explainCode(code, language);
      setExplanations(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const formattedExplanations = explanations
      .map(exp => `Line ${exp.line}: ${exp.code}\nExplanation: ${exp.explanation}`)
      .join('\n\n');
    navigator.clipboard.writeText(formattedExplanations);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Code Explainer</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="language" className="text-sm font-medium text-gray-700">
            Programming Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="swift">Swift</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="text-sm font-medium text-gray-700">
            Code
          </label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="min-h-[200px] font-mono p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2"
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Explaining Code...
            </>
          ) : (
            'Explain Code'
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {explanations.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-700">Code Explanation</h3>
            <button
              onClick={copyToClipboard}
              className="btn-secondary flex items-center gap-2"
            >
              <FaClipboard />
              Copy
            </button>
          </div>
          
          <div className="space-y-4">
            {explanations.map((exp, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                    {exp.line}
                  </div>
                  <div className="flex-grow">
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mb-2">
                      {exp.code}
                    </div>
                    <p className="text-gray-700">
                      {exp.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExplainer; 