import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the latest Gemini model
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
});

// Chat functionality
export const generateResponse = async (messages) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Format the conversation history
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const result = await model.generateContent({
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const response = result.response;
    const text = response.text();

    // Format the response with HTML tags
    const formattedResponse = formatResponse(text);
    return formattedResponse;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};

// Helper function to format the response with HTML tags
const formatResponse = (text) => {
  // Remove asterisks and other markdown symbols
  text = text.replace(/\*/g, '');
  
  // Split the text into lines
  const lines = text.split('\n');
  let formattedText = '';
  let inCodeBlock = false;
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        formattedText += '<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>';
        inCodeBlock = true;
      } else {
        formattedText += '</code></pre>';
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      formattedText += line + '\n';
      continue;
    }

    // Handle headings
    if (line.match(/^#+\s/)) {
      const level = line.match(/^#+/)[0].length;
      const content = line.replace(/^#+\s/, '');
      formattedText += `<h${level} class="text-${level === 1 ? '2xl' : level === 2 ? 'xl' : 'lg'} font-bold text-blue-600 mb-4">${content}</h${level}>`;
      continue;
    }

    // Handle lists
    if (line.match(/^[-•]\s/)) {
      if (!inList) {
        formattedText += '<ul class="list-disc list-inside space-y-2 mb-4">';
        inList = true;
        listType = 'ul';
      }
      formattedText += `<li class="text-gray-700">${line.replace(/^[-•]\s/, '')}</li>`;
      continue;
    } else if (line.match(/^\d+\.\s/)) {
      if (!inList) {
        formattedText += '<ol class="list-decimal list-inside space-y-2 mb-4">';
        inList = true;
        listType = 'ol';
      }
      formattedText += `<li class="text-gray-700">${line.replace(/^\d+\.\s/, '')}</li>`;
      continue;
    } else if (inList && line.trim() === '') {
      formattedText += `</${listType}>`;
      inList = false;
      continue;
    }

    // Handle regular paragraphs
    if (line.trim() !== '') {
      formattedText += `<p class="text-gray-700 leading-relaxed mb-4">${line}</p>`;
    }
  }

  // Close any open lists
  if (inList) {
    formattedText += `</${listType}>`;
  }

  return formattedText;
};

// Notes Summarizer
export const summarizeNotes = async (text) => {
  try {
    const prompt = `Please summarize the following text in clear, concise bullet points. Focus on key concepts and main ideas. Format the response with proper headings and bullet points:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return formatResponse(response.text());
  } catch (error) {
    console.error('Error in summarizeNotes:', error);
    throw new Error(`Failed to summarize notes: ${error.message}`);
  }
};

// Study Plan Generator
export const generateStudyPlan = async (topics, duration) => {
  try {
    const prompt = `Create a detailed study plan for the following topics: ${topics}. 
    Duration: ${duration}. 
    Include daily/weekly breakdowns, key concepts to cover, and suggested study methods.
    Format the response with proper headings, sections, and bullet points.
    Use h1 for main title, h2 for sections, and h3 for subsections.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return formatResponse(response.text());
  } catch (error) {
    console.error('Error in generateStudyPlan:', error);
    throw new Error(`Failed to generate study plan: ${error.message}`);
  }
};

// MCQ Generator
export const generateMCQs = async (topic, content) => {
  try {
    const prompt = `Generate 5 multiple-choice questions based on the following topic and content.
    Format each question as a JSON object with the following structure:
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option letter (A, B, C, or D)",
      "explanation": "Explanation of why this is the correct answer"
    }
    
    Topic: ${topic}
    Content: ${content}
    
    Return the questions as a JSON array. Make sure the response is valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure it's valid JSON
    let cleanedText = text.trim();
    
    // Remove any markdown code block indicators
    cleanedText = cleanedText.replace(/```json\n?|\n?```/g, '');
    
    // Remove any leading/trailing text that's not part of the JSON
    const jsonMatch = cleanedText.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in response');
    }
    
    cleanedText = jsonMatch[0];
    
    // Parse the cleaned JSON
    const questions = JSON.parse(cleanedText);
    
    // Validate the structure of each question
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }
    
    questions.forEach((question, index) => {
      if (!question.question || !question.options || !question.correctAnswer || !question.explanation) {
        throw new Error(`Invalid question structure at index ${index}`);
      }
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error(`Invalid options array at index ${index}`);
      }
    });
    
    return questions;
  } catch (error) {
    console.error('Error in generateMCQs:', error);
    throw new Error(`Failed to generate MCQs: ${error.message}`);
  }
};

// Code Explainer
export const explainCode = async (code, language) => {
  try {
    const prompt = `Provide a detailed line-by-line explanation of the following ${language} code. 
    Break down the explanation into the following sections:
    
    1. Overall Purpose
    • Explain the main purpose and functionality of the code
    • Describe what problem it solves
    
    2. Line-by-Line Analysis
    • For each line of code, explain:
      - What the line does
      - Why it's necessary
      - Any important concepts or patterns used
      - How it relates to other parts of the code
    
    3. Key Components
    • List and explain important functions, variables, and data structures
    • Explain their roles and relationships
    
    4. Technical Details
    • Explain any algorithms or patterns used
    • Discuss time/space complexity if relevant
    • Mention any language-specific features or best practices
    
    5. Potential Improvements
    • Suggest ways to optimize or improve the code
    • Discuss edge cases or potential issues
    
    Code:
    \`\`\`${language}
    ${code}
    \`\`\`

    Format your response with clear headings and use bullet points (•) for line-by-line explanations. Do not use asterisks (*) anywhere in the response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Format the response with HTML tags
    return formatResponse(text);
  } catch (error) {
    console.error('Error in explainCode:', error);
    throw new Error(`Failed to explain code: ${error.message}`);
  }
};

// Flashcard Generator
export const generateFlashcards = async (topic, content) => {
  try {
    const prompt = `Create a set of flashcards based on the following topic and content.
    Format each flashcard as a JSON object with the following structure:
    {
      "question": "The question text",
      "answer": "The answer text",
      "hint": "An optional hint to help remember the answer"
    }
    
    Topic: ${topic}
    Content: ${content}
    
    Return the flashcards as a JSON array. Make sure the response is valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure it's valid JSON
    let cleanedText = text.trim();
    
    // Remove any markdown code block indicators
    cleanedText = cleanedText.replace(/```json\n?|\n?```/g, '');
    
    // Remove any leading/trailing text that's not part of the JSON
    const jsonMatch = cleanedText.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in response');
    }
    
    cleanedText = jsonMatch[0];
    
    // Parse the cleaned JSON
    const flashcards = JSON.parse(cleanedText);
    
    // Validate the structure of each flashcard
    if (!Array.isArray(flashcards)) {
      throw new Error('Response is not an array');
    }
    
    flashcards.forEach((flashcard, index) => {
      if (!flashcard.question || !flashcard.answer) {
        throw new Error(`Invalid flashcard structure at index ${index}`);
      }
    });
    
    return flashcards;
  } catch (error) {
    console.error('Error in generateFlashcards:', error);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
};

// Helper function to extract YouTube video ID
const extractVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const generateVideoSummary = async (videoUrl) => {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL. Please provide a valid YouTube video link.');
    }

    // Fetch video information using YouTube's oEmbed endpoint
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oEmbedUrl);
    const videoData = await response.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    const prompt = `Please analyze and provide a comprehensive summary of the YouTube video titled "${videoData.title}" by ${videoData.author_name}. 

The video can be found at: ${videoUrl}

Please structure your response as follows:

# Video Overview
• Title: ${videoData.title}
• Creator: ${videoData.author_name}
• Video URL: ${videoUrl}

## 🎯 Main Topics
• What are the main subjects covered in this video?
• What are the key themes and central ideas discussed?

## 💡 Key Concepts
• What are the important concepts explained?
• What technical terms or theories are discussed?
• How are complex ideas broken down?

## 📝 Important Details
• What specific facts and figures are mentioned?
• What statistics or data are presented?
• What examples or case studies are used?

## 🔑 Key Takeaways
• What are the main lessons or insights?
• What are the most important conclusions?
• What are the key points to remember?

## 💪 Practical Applications
• How can the information be applied in practice?
• What actionable steps or recommendations are given?
• What real-world examples or applications are mentioned?

Please provide a detailed analysis focusing on educational value and practical insights.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const responseText = result.response.text();
    
    // Enhanced formatting with video metadata
    let formattedText = responseText
      // Format main headings with color and larger size
      .replace(/^# (.*)/gm, '<h1 class="text-2xl font-bold text-blue-600 mb-4">$1</h1>')
      // Format subheadings with color and medium size
      .replace(/^## (.*)/gm, '<h2 class="text-xl font-semibold text-indigo-600 mt-6 mb-3 flex items-center gap-2">$1</h2>')
      // Format bullet points with custom styling
      .replace(/^• (.*)/gm, '<li class="flex items-start gap-2 mb-2"><span class="text-blue-500">•</span><span class="text-gray-700">$1</span></li>')
      // Wrap bullet point sections in styled lists
      .replace(/((?:<li.*?>.*?<\/li>\n?)+)/g, '<ul class="list-none space-y-1 mb-4">$1</ul>');

    // Add video thumbnail if available
    if (videoData.thumbnail_url) {
      formattedText = `
        <div class="mb-6">
          <img src="${videoData.thumbnail_url}" alt="${videoData.title}" class="w-full max-w-2xl mx-auto rounded-lg shadow-md" />
        </div>
      ${formattedText}`;
    }

    return formattedText;
  } catch (error) {
    console.error('Error generating video summary:', error);
    if (error.message.includes('oembed')) {
      throw new Error('Unable to fetch video information. Please make sure the video exists and is publicly accessible.');
    }
    throw new Error('Failed to generate video summary. Please try again.');
  }
};

// PDF Text Extractor
export const extractPdfText = async (file) => {
  try {
    // Read the PDF file as base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
    });
    reader.readAsDataURL(file);

    const base64Data = await base64Promise;

    const prompt = `Please extract and summarize the key information from this PDF document. 
    Focus on the main topics, important points, and any significant data or conclusions.
    Format the response with clear headings and bullet points.
    
    PDF Content: ${base64Data}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const responseText = result.response.text();
    
    // Format the response with HTML tags
    let formattedText = responseText
      // Format main headings with color and larger size
      .replace(/^# (.*)/gm, '<h1 class="text-2xl font-bold text-blue-600 mb-4">$1</h1>')
      // Format subheadings with color and medium size
      .replace(/^## (.*)/gm, '<h2 class="text-xl font-semibold text-indigo-600 mt-6 mb-3 flex items-center gap-2">$1</h2>')
      // Format bullet points with custom styling
      .replace(/^• (.*)/gm, '<li class="flex items-start gap-2 mb-2"><span class="text-blue-500">•</span><span class="text-gray-700">$1</span></li>')
      // Wrap bullet point sections in styled lists
      .replace(/((?:<li.*?>.*?<\/li>\n?)+)/g, '<ul class="list-none space-y-1 mb-4">$1</ul>');

    return formattedText;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF. Please try again.');
  }
};