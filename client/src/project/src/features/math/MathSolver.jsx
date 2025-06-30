import { useState } from 'react';
import { FaCalculator, FaSpinner, FaExclamationTriangle, FaClipboard } from 'react-icons/fa';
import { generateResponse } from '../../utils/gemini';
import { addToHistory } from '../../utils/localStorage';
import { STORAGE_KEYS } from '../../utils/localStorage';

const MathSolver = () => {
  const [problem, setProblem] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) {
      setError('Please enter a math problem');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setResponse('');

      const prompt = `Solve the following math problem and provide a detailed step-by-step solution:

      Problem: ${problem}

      Please structure your response with the following sections:

      # Problem Statement
      • Restate the problem clearly
      • Identify the type of problem (e.g., differentiation, integration, algebra)

      # Solution Steps
      • Show each step of the solution
      • Explain the reasoning behind each step
      • Include any relevant formulas or theorems used

      # Final Answer
      • Present the final answer clearly
      • Include units if applicable
      • Verify the solution if possible

      # Additional Notes
      • Any important concepts or formulas to remember
      • Common mistakes to avoid
      • Alternative approaches if applicable

      Please ensure the solution is accurate and well-explained.`;

      const result = await generateResponse([{ role: 'user', content: prompt }]);
      setResponse(result);

      // Add to history
      addToHistory(STORAGE_KEYS.STUDY_HISTORY, {
        type: 'math_solution',
        content: `Solved: ${problem}`,
        summary: result
      });
    } catch (err) {
      setError(err.message || 'Failed to solve the problem');
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
          <FaCalculator className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Math Problem Solver</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="problem" className="text-lg font-medium text-gray-700">
                Enter Math Problem
              </label>
              <textarea
                id="problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g., Find the derivative of x^2 + 3x, Solve ∫(2x + 1)dx, Factor x^2 - 4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              />
            </div>
            <div className="text-sm text-gray-500">
              <p>Examples of problems you can solve:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Differentiation: d/dx(x^2 + 3x)</li>
                <li>Integration: ∫(2x + 1)dx</li>
                <li>Algebra: Solve 2x + 5 = 15</li>
                <li>Trigonometry: sin(x) + cos(x) = 1</li>
                <li>Calculus: Find the limit as x approaches 0 of (sin x)/x</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || !problem.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Solving...
                </>
              ) : (
                <>
                  <FaCalculator />
                  Solve Problem
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
              <h3 className="text-lg font-medium text-gray-900">Solution</h3>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FaClipboard />
                {copied ? 'Copied!' : 'Copy Solution'}
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

export default MathSolver; 