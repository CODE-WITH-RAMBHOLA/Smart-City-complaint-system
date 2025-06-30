import { useState } from 'react';
import { FaClipboard, FaSpinner, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { generateFlashcards } from '../utils/gemini';

const FlashcardGenerator = () => {
  const [content, setContent] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

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

  const previousCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Flashcard Generator</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or type the content you want to generate flashcards from..."
            className="min-h-[200px] p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2"
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Generating Flashcards...
            </>
          ) : (
            'Generate Flashcards'
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Flashcards</h3>
            <button
              onClick={copyToClipboard}
              className="btn-secondary flex items-center gap-2"
            >
              <FaClipboard />
              Copy All
            </button>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] bg-white rounded-lg shadow-lg p-6 flex flex-col">
              <div className="flex-grow flex items-center justify-center">
                <p className="text-xl text-center">
                  {showAnswer
                    ? flashcards[currentIndex].answer
                    : flashcards[currentIndex].question}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={previousCard}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaArrowLeft />
                  Previous
                </button>
                
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="btn-primary"
                >
                  {showAnswer ? 'Show Question' : 'Show Answer'}
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
            
            <div className="mt-2 text-center text-sm text-gray-500">
              Card {currentIndex + 1} of {flashcards.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator; 