import { createContext, useContext, useEffect, useState } from 'react';
import { getUserFromToken } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getUserFromToken();
      setUser(current);
    }, 1000); // Poll for changes like login/logout
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
