import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our settings
export type Language = "english" | "arabic" | "other";
export type Theme = "light" | "dark" | "system";
export type TextSize = "small" | "medium" | "large" | "extraLarge" | "huge";
export type ContrastMode = "normal" | "highContrast";
export type InputMethod = "touch" | "voice" | "switch";
export type NavItem = "home" | "pantry" | "shopping" | "spaces" | "family" | "tasks" | "calendar" | "notes" | "settings";

// Define types for family members
export type MemberRole = "admin" | "member" | "limitedUser" | "staff";
export type MemberStatus = "active" | "inactive" | "pending";

export interface FamilyMember {
  id: string;
  name: string;
  role: MemberRole;
  status: MemberStatus;
  joined: string;
  tasksAssigned: number;
  avatar?: string;
  permissions: {
    viewPantry: boolean;
    editPantry: boolean;
    viewTasks: boolean;
    completeTasks: boolean;
    createTasks: boolean;
    assignTasks: boolean;
    viewSpaces: boolean;
    manageSpaces: boolean;
    viewFamily: boolean;
    inviteMembers: boolean;
    viewStaff: boolean;
    manageStaff: boolean;
    viewFinancial: boolean;
    adminSettings: boolean;
    addToShoppingLists: boolean;
    createShoppingLists: boolean;
  };
}

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
  
  // Family Members
  familyMembers: FamilyMember[];
  staffMembers: FamilyMember[];
  pendingInvitations: number;
  
  // Dialect settings
  preferred_dialect_id?: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  generateInviteCode: () => string;
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
  
  // Sample family members
  familyMembers: [
    {
      id: "1",
      name: "Father",
      role: "admin",
      status: "active",
      joined: "01/01/23",
      tasksAssigned: 5,
      permissions: {
        viewPantry: true,
        editPantry: true,
        viewTasks: true,
        completeTasks: true,
        createTasks: true,
        assignTasks: true,
        viewSpaces: true,
        manageSpaces: true,
        viewFamily: true,
        inviteMembers: true,
        viewStaff: true,
        manageStaff: true,
        viewFinancial: true,
        adminSettings: true,
        addToShoppingLists: true,
        createShoppingLists: true
      }
    },
    {
      id: "2",
      name: "Mother",
      role: "admin",
      status: "active",
      joined: "01/01/23",
      tasksAssigned: 8,
      permissions: {
        viewPantry: true,
        editPantry: true,
        viewTasks: true,
        completeTasks: true,
        createTasks: true,
        assignTasks: true,
        viewSpaces: true,
        manageSpaces: true,
        viewFamily: true,
        inviteMembers: true,
        viewStaff: true,
        manageStaff: true,
        viewFinancial: true,
        adminSettings: true,
        addToShoppingLists: true,
        createShoppingLists: true
      }
    },
    {
      id: "3",
      name: "Ahmad",
      role: "member",
      status: "active",
      joined: "05/01/23",
      tasksAssigned: 3,
      permissions: {
        viewPantry: true,
        editPantry: true,
        viewTasks: true,
        completeTasks: true,
        createTasks: true,
        assignTasks: true,
        viewSpaces: true,
        manageSpaces: true,
        viewFamily: true,
        inviteMembers: false,
        viewStaff: true,
        manageStaff: false,
        viewFinancial: false,
        adminSettings: false,
        addToShoppingLists: true,
        createShoppingLists: true
      }
    },
    {
      id: "4",
      name: "Grandmother",
      role: "limitedUser",
      status: "active",
      joined: "10/02/23",
      tasksAssigned: 0,
      permissions: {
        viewPantry: true,
        editPantry: false,
        viewTasks: true,
        completeTasks: false,
        createTasks: false,
        assignTasks: false,
        viewSpaces: true,
        manageSpaces: false,
        viewFamily: true,
        inviteMembers: false,
        viewStaff: false,
        manageStaff: false,
        viewFinancial: false,
        adminSettings: false,
        addToShoppingLists: true,
        createShoppingLists: false
      }
    }
  ],
  staffMembers: [
    {
      id: "5",
      name: "Driver",
      role: "staff",
      status: "active",
      joined: "03/15/23",
      tasksAssigned: 2,
      permissions: {
        viewPantry: false,
        editPantry: false,
        viewTasks: true,
        completeTasks: true,
        createTasks: false,
        assignTasks: false,
        viewSpaces: false,
        manageSpaces: false,
        viewFamily: false,
        inviteMembers: false,
        viewStaff: true,
        manageStaff: false,
        viewFinancial: false,
        adminSettings: false,
        addToShoppingLists: false,
        createShoppingLists: false
      }
    },
    {
      id: "6",
      name: "Shopper",
      role: "staff",
      status: "active",
      joined: "04/20/23",
      tasksAssigned: 4,
      permissions: {
        viewPantry: true,
        editPantry: false,
        viewTasks: true,
        completeTasks: true,
        createTasks: false,
        assignTasks: false,
        viewSpaces: false,
        manageSpaces: false,
        viewFamily: false,
        inviteMembers: false,
        viewStaff: true,
        manageStaff: false,
        viewFinancial: false,
        adminSettings: false,
        addToShoppingLists: true,
        createShoppingLists: false
      }
    }
  ],
  pendingInvitations: 1
};

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem("koffa-settings");
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Ensure critical arrays exist
        return {
          ...defaultSettings,
          ...parsedSettings,
          familyMembers: Array.isArray(parsedSettings.familyMembers) 
            ? parsedSettings.familyMembers 
            : defaultSettings.familyMembers,
          staffMembers: Array.isArray(parsedSettings.staffMembers) 
            ? parsedSettings.staffMembers 
            : defaultSettings.staffMembers,
          navItems: Array.isArray(parsedSettings.navItems) 
            ? parsedSettings.navItems 
            : defaultSettings.navItems,
        };
      }
      return defaultSettings;
    } catch (error) {
      console.error("Error loading settings from localStorage:", error);
      return defaultSettings;
    }
  });

  // Update settings in localStorage when they change
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
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

  const addFamilyMember = (member: FamilyMember) => {
    setSettings(prevSettings => {
      // Ensure arrays exist
      const currentFamilyMembers = Array.isArray(prevSettings.familyMembers) 
        ? prevSettings.familyMembers 
        : [];
        
      const currentStaffMembers = Array.isArray(prevSettings.staffMembers) 
        ? prevSettings.staffMembers 
        : [];
        
      if (member.role === 'staff') {
        return {
          ...prevSettings,
          staffMembers: [...currentStaffMembers, member],
          pendingInvitations: Math.max(0, prevSettings.pendingInvitations - 1)
        };
      } else {
        return {
          ...prevSettings,
          familyMembers: [...currentFamilyMembers, member],
          pendingInvitations: Math.max(0, prevSettings.pendingInvitations - 1)
        };
      }
    });
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setSettings(prevSettings => {
      // Ensure arrays exist
      const familyMembers = Array.isArray(prevSettings.familyMembers) 
        ? prevSettings.familyMembers 
        : [];
        
      const staffMembers = Array.isArray(prevSettings.staffMembers) 
        ? prevSettings.staffMembers 
        : [];
      
      // Check if the member is in familyMembers array
      const familyIndex = familyMembers.findIndex(member => member.id === id);
      
      if (familyIndex !== -1) {
        const updatedFamilyMembers = [...familyMembers];
        updatedFamilyMembers[familyIndex] = { 
          ...updatedFamilyMembers[familyIndex], 
          ...updates 
        };
        
        return {
          ...prevSettings,
          familyMembers: updatedFamilyMembers
        };
      }
      
      // Check if the member is in staffMembers array
      const staffIndex = staffMembers.findIndex(member => member.id === id);
      
      if (staffIndex !== -1) {
        const updatedStaffMembers = [...staffMembers];
        updatedStaffMembers[staffIndex] = { 
          ...updatedStaffMembers[staffIndex], 
          ...updates 
        };
        
        return {
          ...prevSettings,
          staffMembers: updatedStaffMembers
        };
      }
      
      return prevSettings;
    });
  };

  const removeFamilyMember = (id: string) => {
    setSettings(prevSettings => {
      // Ensure arrays exist
      const familyMembers = Array.isArray(prevSettings.familyMembers) 
        ? prevSettings.familyMembers 
        : [];
        
      const staffMembers = Array.isArray(prevSettings.staffMembers) 
        ? prevSettings.staffMembers 
        : [];
      
      return {
        ...prevSettings,
        familyMembers: familyMembers.filter(member => member.id !== id),
        staffMembers: staffMembers.filter(member => member.id !== id)
      };
    });
  };
  
  const generateInviteCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Increase pending invitations count
    setSettings(prevSettings => ({
      ...prevSettings,
      pendingInvitations: prevSettings.pendingInvitations + 1
    }));
    
    return code;
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      resetSettings,
      addFamilyMember,
      updateFamilyMember,
      removeFamilyMember,
      generateInviteCode
    }}>
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
