
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our settings
export type Language = "english" | "arabic" | "other";
export type Theme = "light" | "dark" | "system";
export type TextSize = "small" | "medium" | "large" | "extraLarge" | "huge";
export type ContrastMode = "normal" | "highContrast";
export type InputMethod = "touch" | "voice" | "switch";
export type NavItem = "home" | "pantry" | "shopping" | "spaces" | "family" | "tasks" | "calendar" | "notes" | "settings";

export interface Settings {
  // Appearance
  language: Language;
  theme: Theme;
  textSize: TextSize;
  
  // Accessibility
  highContrastMode: boolean;
  screenReaderCompatible: boolean;
  voiceCommands: boolean;
  boldText: boolean;
  reduceTransparency: boolean;
  reduceMotion: boolean;
  touchAccommodations: boolean;
  inputMethod: InputMethod;
  simplifiedMode: boolean;
  showLabelsWithIcons: boolean;
  reduceAnimations: boolean;
  
  // Navigation
  navItems: NavItem[];
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: Settings = {
  language: "english",
  theme: "light",
  textSize: "medium",
  
  highContrastMode: false,
  screenReaderCompatible: false,
  voiceCommands: false,
  boldText: false,
  reduceTransparency: false,
  reduceMotion: false,
  touchAccommodations: false,
  inputMethod: "touch",
  simplifiedMode: false,
  showLabelsWithIcons: true,
  reduceAnimations: false,
  
  navItems: ["home", "pantry", "shopping", "spaces", "family"],
};

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<Settings>(() => {
    const storedSettings = localStorage.getItem("koffa-settings");
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });

  // Update settings in localStorage when they change
  useEffect(() => {
    localStorage.setItem("koffa-settings", JSON.stringify(settings));
    
    // Apply theme to document body
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    
    // Apply text size classes to body
    document.body.classList.remove("text-size-small", "text-size-medium", "text-size-large", "text-size-extra-large", "text-size-huge");
    document.body.classList.add(`text-size-${settings.textSize}`);
    
    // Apply high contrast mode if enabled
    if (settings.highContrastMode) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    // Apply reduced motion if enabled
    if (settings.reduceMotion || settings.reduceAnimations) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }

    // Apply bold text if enabled
    if (settings.boldText) {
      document.documentElement.classList.add("bold-text");
    } else {
      document.documentElement.classList.remove("bold-text");
    }
    
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
