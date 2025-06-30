import { useState } from 'react';
import { FaBalanceScale, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { generateResponse } from '../../utils/gemini';
import { addToHistory } from '../../utils/localStorage';
import { STORAGE_KEYS } from '../../utils/localStorage';

const ConceptComparison = () => {
  const [concept1, setConcept1] = useState('');
  const [concept2, setConcept2] = useState('');
  const [comparison, setComparison] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!concept1.trim() || !concept2.trim()) {
      setError('Please enter both concepts to compare');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setComparison('');

      const prompt = `Compare and contrast the following two concepts in detail:
      
      Concept 1: ${concept1}
      Concept 2: ${concept2}
      
      Please structure your response with the following sections:
      
      # Overview
      • Brief introduction to both concepts
      
      # Similarities
      • Key similarities between the concepts
      • Common characteristics or features
      
      # Differences
      • Key differences between the concepts
      • Distinct characteristics or features
      
      # Applications
      • How each concept is used in practice
      • Real-world examples or use cases
      
      # Key Takeaways
      • Main points to remember
      • When to use each concept`;

      const result = await generateResponse([{ role: 'user', content: prompt }]);
      setComparison(result);

      // Add to history
      addToHistory(STORAGE_KEYS.STUDY_HISTORY, {
        type: 'concept_comparison',
        content: `Compared: ${concept1} vs ${concept2}`,
        summary: result
      });
    } catch (err) {
      setError(err.message || 'Failed to generate comparison');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaBalanceScale className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Concept Comparison</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label htmlFor="concept1" className="text-lg font-medium text-gray-700">
                First Concept
              </label>
              <input
                id="concept1"
                type="text"
                value={concept1}
                onChange={(e) => setConcept1(e.target.value)}
                placeholder="Enter first concept"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-4">
              <label htmlFor="concept2" className="text-lg font-medium text-gray-700">
                Second Concept
              </label>
              <input
                id="concept2"
                type="text"
                value={concept2}
                onChange={(e) => setConcept2(e.target.value)}
                placeholder="Enter second concept"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || !concept1.trim() || !concept2.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  <FaBalanceScale />
                  Compare Concepts
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

        {comparison && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comparison Result</h3>
            <div className="prose prose-lg max-w-none">
              <div
                className="rounded-lg bg-gray-50 p-6 shadow-sm"
                dangerouslySetInnerHTML={{ __html: comparison }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptComparison; 