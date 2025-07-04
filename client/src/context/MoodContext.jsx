// src/context/MoodContext.jsx
import { createContext, useState, useContext } from 'react';

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [showMoodModal, setShowMoodModal] = useState(false);

  return (
    <MoodContext.Provider value={{ showMoodModal, setShowMoodModal }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => useContext(MoodContext);
