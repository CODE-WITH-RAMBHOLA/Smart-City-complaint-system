// Storage Keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'chat_history',
  NOTES_HISTORY: 'notes_history',
  CODE_HISTORY: 'code_history',
  STUDY_HISTORY: 'study_history',
  QUIZ_HISTORY: 'quiz_history',
  FLASHCARDS_HISTORY: 'flashcards_history',
  TODO_LIST: 'todos'
};

// Save item to local storage
export const saveToLocalStorage = (key, data) => {
  try {
    console.log(`Saving to localStorage - Key: ${key}`, data);
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log('Save successful');
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Get item from local storage
export const getFromLocalStorage = (key) => {
  try {
    console.log(`Getting from localStorage - Key: ${key}`);
    const item = localStorage.getItem(key);
    if (!item) {
      console.log('No data found for key:', key);
      return null;
    }
    const parsedData = JSON.parse(item);
    console.log('Retrieved data:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Clear specific history
export const clearHistory = (key) => {
  try {
    console.log(`Clearing history for key: ${key}`);
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

// Clear all history
export const clearAllHistory = () => {
  try {
    console.log('Clearing all history');
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing all history:', error);
    return false;
  }
};

// Add item to history
export const addToHistory = (key, item) => {
  try {
    console.log(`Adding item to history - Key: ${key}`, item);
    
    // Get existing history
    const history = getFromLocalStorage(key) || [];
    console.log('Current history:', history);

    // Create new history item with timestamp and ID
    const newItem = {
      ...item,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Add new item to the beginning of the array
    const newHistory = [newItem, ...history].slice(0, 50); // Keep only last 50 items
    
    // Save updated history
    const saveSuccess = saveToLocalStorage(key, newHistory);
    if (!saveSuccess) {
      throw new Error('Failed to save to localStorage');
    }

    console.log('Updated history:', newHistory);
    return newHistory;
  } catch (error) {
    console.error('Error adding to history:', error);
    return [];
  }
}; 