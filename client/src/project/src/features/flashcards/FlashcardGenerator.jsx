import { useState } from 'react';
import { FaClipboard, FaSpinner, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { generateFlashcards } from '../../utils/gemini';

const FlashcardGenerator = () => {
  const [content, setContent] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter some content to generate flashcards');
      return;
    }

    setIsLoading(true);
    setError('');
    setCurrentIndex(0);
    setShowAnswer(false);

    try {
      const result = await generateFlashcards(content);
      setFlashcards(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const formattedFlashcards = flashcards
      .map(card => `Q: ${card.question}\nA: ${card.answer}`)
      .join('\n\n');
    navigator.clipboard.writeText(formattedFlashcards);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Flashcard Generator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter the content to generate flashcards from..."
          />
        </div>

        <button
          type="submit"
          className="btn-primary flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            'Generate Flashcards'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Flashcards</h3>
            <button
              onClick={copyToClipboard}
              className="btn-secondary flex items-center gap-2"
            >
              <FaClipboard />
              Copy All
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="min-h-[200px] flex flex-col justify-center">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">
                  Card {currentIndex + 1} of {flashcards.length}
                </p>
              </div>
              <div className="prose prose-sm max-w-none">
                <div
                  className="text-lg font-medium mb-4"
                  dangerouslySetInnerHTML={{ __html: flashcards[currentIndex].question }}
                />
                {showAnswer && (
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: flashcards[currentIndex].answer }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={prevCard}
                className="btn-secondary flex items-center gap-2"
              >
                <FaArrowLeft />
                Previous
              </button>
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="btn-primary"
              >
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
              <button
                onClick={nextCard}
                className="btn-secondary flex items-center gap-2"
              >
                Next
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator; 