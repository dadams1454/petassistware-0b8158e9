
import React, { createContext, useContext, useState, useEffect } from 'react';

type DogColorPreference = {
  dogId: string;
  color: string;
};

interface UserPreferences {
  dogColors: Record<string, string>; // dogId -> color
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setDogColor: (dogId: string, color: string) => void;
  getDogColor: (dogId: string) => string | undefined;
  resetDogColor: (dogId: string) => void;
  resetAllPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  dogColors: {},
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load preferences from localStorage on initial render
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const setDogColor = (dogId: string, color: string) => {
    setPreferences(prev => ({
      ...prev,
      dogColors: {
        ...prev.dogColors,
        [dogId]: color,
      }
    }));
  };

  const getDogColor = (dogId: string) => {
    return preferences.dogColors[dogId];
  };

  const resetDogColor = (dogId: string) => {
    const updatedColors = { ...preferences.dogColors };
    delete updatedColors[dogId];
    
    setPreferences(prev => ({
      ...prev,
      dogColors: updatedColors,
    }));
  };

  const resetAllPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        setDogColor,
        getDogColor,
        resetDogColor,
        resetAllPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
