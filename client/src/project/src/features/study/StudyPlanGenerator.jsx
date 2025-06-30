import { useState } from 'react';
import { generateGeminiResponse } from '../../utils/geminiApi';
import { FaBook, FaClock, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';

function StudyPlanGenerator() {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('beginner');
  const [studyPlan, setStudyPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !duration.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Create a detailed study plan for ${subject} at ${level} level, to be completed in ${duration}. Format the response with clear sections, bullet points, and numbered lists. Include specific topics, time allocation, and recommended resources. Make it easy to read and follow.`;
      const response = await generateGeminiResponse(prompt);
      setStudyPlan(response);
    } catch (error) {
      setStudyPlan('Sorry, there was an error generating your study plan.');
    }
    setIsLoading(false);
  };

  const formatStudyPlan = (content) => {
    const sections = content.split('\n\n');
    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n');
      const title = lines[0];
      const content = lines.slice(1);

      return (
        <div key={sectionIndex} className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center gap-2">
            {title.includes('Week') || title.includes('Phase') ? (
              <FaClock className="text-blue-500" />
            ) : title.includes('Resources') ? (
              <FaBook className="text-green-500" />
            ) : title.includes('Assessment') ? (
              <FaCheckCircle className="text-purple-500" />
            ) : (
              <FaGraduationCap className="text-blue-500" />
            )}
            {title}
          </h3>
          <div className="pl-6 space-y-2">
            {content.map((line, lineIndex) => {
              if (line.startsWith('•')) {
                return (
                  <div key={lineIndex} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{line.substring(1).trim()}</span>
                  </div>
                );
              } else if (/^\d+\./.test(line)) {
                return (
                  <div key={lineIndex} className="flex items-start gap-2">
                    <span className="text-green-500 font-medium">{line.match(/^\d+/)[0]}.</span>
                    <span className="text-gray-700">{line.substring(line.indexOf('.') + 1).trim()}</span>
                  </div>
                );
              }
              return <p key={lineIndex} className="text-gray-700">{line}</p>;
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Study Plan Generator</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <FaGraduationCap className="text-blue-500" />
              Generate Study Plan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="e.g., Mathematics, Physics, History"
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="e.g., 2 weeks, 1 month, 3 months"
                />
              </div>
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaGraduationCap />
                    Generate Study Plan
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <FaBook className="text-blue-500" />
              Your Study Plan
            </h2>
            <div className="h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {studyPlan ? (
                <div className="prose max-w-none">
                  {formatStudyPlan(studyPlan)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <FaGraduationCap className="text-4xl text-blue-500 mb-4" />
                  <p className="text-lg">Your study plan will appear here...</p>
                  <p className="text-sm mt-2">Fill in the details and generate a personalized study plan with clear sections and bullet points.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPlanGenerator; 