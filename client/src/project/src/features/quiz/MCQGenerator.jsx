import { useState } from 'react';
import { FaClipboard, FaSpinner, FaCheck, FaTimes, FaLightbulb, FaGraduationCap } from 'react-icons/fa';
import { generateMCQs } from '../../utils/gemini';

const MCQGenerator = () => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !content.trim()) return;

    setIsLoading(true);
    setError('');
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const result = await generateMCQs(topic, content);
      setQuestions(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FaGraduationCap className="text-3xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">MCQ Generator</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="topic" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                Topic
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Physics, History, Mathematics"
                className="p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaClipboard className="text-blue-500" />
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste or type the content you want to generate questions from..."
                className="min-h-[150px] p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            disabled={isLoading || !topic.trim() || !content.trim()}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-xl" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <FaGraduationCap />
                <span>Generate MCQs</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 flex items-center gap-3">
            <FaTimes className="text-red-500" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <FaGraduationCap className="text-blue-600" />
              Generated Questions
            </h3>
            {!showResults && (
              <button
                onClick={checkAnswers}
                className="py-2 px-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={Object.keys(selectedAnswers).length !== questions.length}
              >
                Check Answers
              </button>
            )}
          </div>

          <div className="space-y-8">
            {questions.map((question, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-blue-200 transition-all duration-200"
              >
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  {index + 1}. {question.question}
                </p>
                
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswers[index] === option;
                    const isCorrect = showResults && option === question.correctAnswer;
                    const isWrong = showResults && isSelected && option !== question.correctAnswer;

                    return (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                        } ${isCorrect ? 'border-green-500 bg-green-50' : ''} ${
                          isWrong ? 'border-red-500 bg-red-50' : ''
                        }`}
                        onClick={() => !showResults && handleAnswerSelect(index, option)}
                      >
                        <div className="flex items-center gap-3">
                          {showResults && (
                            <>
                              {isCorrect && <FaCheck className="text-green-500 text-xl" />}
                              {isWrong && <FaTimes className="text-red-500 text-xl" />}
                            </>
                          )}
                          <span className="text-gray-700">{option}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                    <p className="text-gray-700">
                      <span className="font-semibold text-blue-700">Explanation:</span> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showResults && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
              <p className="text-center text-2xl font-bold text-blue-700">
                Your Score: {calculateScore()}%
              </p>
              <p className="text-center text-gray-600 mt-2">
                {calculateScore() >= 80 ? 'Excellent!' : calculateScore() >= 60 ? 'Good job!' : 'Keep practicing!'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MCQGenerator; 