const GEMINI_API_KEY = 'AIzaSyBdMTyiPONO-Db72RYClR6bEo-CD78SRSE';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const formatResponse = (text) => {
  // Remove asterisks and other markdown symbols
  let formattedText = text.replace(/\*/g, '');
  
  // Convert markdown-style lists to HTML lists
  formattedText = formattedText.replace(/^\s*[-*]\s+(.+)$/gm, '• $1');
  
  // Add proper spacing between paragraphs
  formattedText = formattedText.replace(/\n\n+/g, '\n\n');
  
  // Convert numbered lists
  formattedText = formattedText.replace(/^\s*(\d+)\.\s+(.+)$/gm, '$1. $2');
  
  return formattedText;
};

export const generateGeminiResponse = async (prompt) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const rawResponse = data.candidates[0].content.parts[0].text;
      return formatResponse(rawResponse);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}; 