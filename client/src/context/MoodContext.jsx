// src/context/MoodContext.jsx
import { createContext, useState, useContext } from 'react';

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodCategory, setMoodCategory] = useState(() => {
    return localStorage.getItem('moodCategory') || null;
  });

  // ✅ This function updates both state and localStorage
  const updateMoodSummary = (category, timestamp) => {
    setMoodCategory(category);
    localStorage.setItem('moodCategory', category);
    localStorage.setItem('lastMoodCheck', timestamp.toString());
  };

  return (
    <MoodContext.Provider
      value={{
        showMoodModal,
        setShowMoodModal,
        moodCategory,
        setMoodCategory,
        updateMoodSummary,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => useContext(MoodContext);
