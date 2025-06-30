import { useState } from 'react';
import { FaFilePowerpoint, FaSpinner, FaExclamationTriangle, FaDownload } from 'react-icons/fa';
import { generateResponse } from '../../utils/gemini';
import { addToHistory } from '../../utils/localStorage';
import { STORAGE_KEYS } from '../../utils/localStorage';

const SlidesGenerator = () => {
  const [projectDetails, setProjectDetails] = useState('');
  const [slides, setSlides] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectDetails.trim()) {
      setError('Please enter project details');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSlides('');

      const prompt = `Create a detailed presentation outline for the following project:

      Project Details: ${projectDetails}

      Please structure the presentation with the following sections:

      # Title Slide
      • Project Title
      • Team Members
      • Date

      # Introduction
      • Project Overview
      • Objectives
      • Scope

      # Methodology
      • Approach
      • Tools & Technologies
      • Implementation Steps

      # Results
      • Key Findings
      • Data/Statistics
      • Visualizations

      # Conclusion
      • Summary
      • Future Work
      • Q&A

      Please provide detailed content for each slide, including bullet points and key talking points.`;

      const result = await generateResponse([{ role: 'user', content: prompt }]);
      setSlides(result);

      // Add to history
      addToHistory(STORAGE_KEYS.STUDY_HISTORY, {
        type: 'slides',
        content: `Generated slides for: ${projectDetails}`,
        summary: result
      });
    } catch (err) {
      setError(err.message || 'Failed to generate slides');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSlides = () => {
    const element = document.createElement('a');
    const file = new Blob([slides], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'project_slides.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaFilePowerpoint className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Project Slides Generator</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="projectDetails" className="text-lg font-medium text-gray-700">
                Enter Project Details
              </label>
              <textarea
                id="projectDetails"
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                placeholder="Enter your project details, including topic, requirements, and any specific points you want to cover..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              />
            </div>
            <div className="text-sm text-gray-500">
              <p>Include information about:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Project topic and objectives</li>
                <li>Key points to cover</li>
                <li>Target audience</li>
                <li>Any specific requirements</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || !projectDetails.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FaFilePowerpoint />
                  Generate Slides
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

        {slides && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Generated Slides</h3>
              <button
                onClick={downloadSlides}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FaDownload />
                Download Slides
              </button>
            </div>
            <div className="prose prose-lg max-w-none">
              <div
                className="rounded-lg bg-gray-50 p-6 shadow-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: slides }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidesGenerator; 