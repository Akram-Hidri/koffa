
import { Settings, FamilyMember } from "./types";

// Apply theme based on settings
export const applyThemeSettings = (settings: Settings): void => {
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
  
  // Apply text size classes to body - remove all first, then add the correct one
  document.body.classList.remove("text-size-small", "text-size-medium", "text-size-large", "text-size-extraLarge", "text-size-huge");
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
  
  console.log('Applied text size setting:', settings.textSize);
  console.log('Body classes:', document.body.className);
};

// Format invite code for better readability
export const formatInviteCode = (code: string): string => {
  if (code?.length === 8) {
    return `${code.substring(0, 4)}-${code.substring(4)}`;
  }
  return code || '';
};

// Make sure arrays exist in settings
export const ensureSettingsArrays = (settings: Settings): Settings => {
  return {
    ...settings,
    familyMembers: Array.isArray(settings.familyMembers) 
      ? settings.familyMembers 
      : [],
    staffMembers: Array.isArray(settings.staffMembers) 
      ? settings.staffMembers 
      : [],
    navItems: Array.isArray(settings.navItems) 
      ? settings.navItems 
      : ["home"]
  };
};
