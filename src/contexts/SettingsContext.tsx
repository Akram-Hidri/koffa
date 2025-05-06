
import React, { createContext, useContext, useState, useEffect } from "react";
import { Settings, SettingsContextType, FamilyMember } from "./settings/types";
import { defaultSettings } from "./settings/defaultSettings";
import { applyThemeSettings, generateInviteCode as generateRandomInviteCode, ensureSettingsArrays } from "./settings/settingsUtils";

// Re-export types for convenience
export type { Language, Theme, TextSize, ContrastMode, InputMethod, NavItem, MemberRole, MemberStatus, FamilyMember } from "./settings/types";

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
        return ensureSettingsArrays({...defaultSettings, ...parsedSettings});
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
      applyThemeSettings(settings);
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
      const updatedSettings = ensureSettingsArrays(prevSettings);
      
      if (member.role === 'staff') {
        return {
          ...updatedSettings,
          staffMembers: [...updatedSettings.staffMembers, member],
          pendingInvitations: Math.max(0, updatedSettings.pendingInvitations - 1)
        };
      } else {
        return {
          ...updatedSettings,
          familyMembers: [...updatedSettings.familyMembers, member],
          pendingInvitations: Math.max(0, updatedSettings.pendingInvitations - 1)
        };
      }
    });
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setSettings(prevSettings => {
      const updatedSettings = ensureSettingsArrays(prevSettings);
      
      // Check if the member is in familyMembers array
      const familyIndex = updatedSettings.familyMembers.findIndex(member => member.id === id);
      
      if (familyIndex !== -1) {
        const updatedFamilyMembers = [...updatedSettings.familyMembers];
        updatedFamilyMembers[familyIndex] = { 
          ...updatedFamilyMembers[familyIndex], 
          ...updates 
        };
        
        return {
          ...updatedSettings,
          familyMembers: updatedFamilyMembers
        };
      }
      
      // Check if the member is in staffMembers array
      const staffIndex = updatedSettings.staffMembers.findIndex(member => member.id === id);
      
      if (staffIndex !== -1) {
        const updatedStaffMembers = [...updatedSettings.staffMembers];
        updatedStaffMembers[staffIndex] = { 
          ...updatedStaffMembers[staffIndex], 
          ...updates 
        };
        
        return {
          ...updatedSettings,
          staffMembers: updatedStaffMembers
        };
      }
      
      return updatedSettings;
    });
  };

  const removeFamilyMember = (id: string) => {
    setSettings(prevSettings => {
      const updatedSettings = ensureSettingsArrays(prevSettings);
      
      return {
        ...updatedSettings,
        familyMembers: updatedSettings.familyMembers.filter(member => member.id !== id),
        staffMembers: updatedSettings.staffMembers.filter(member => member.id !== id)
      };
    });
  };
  
  const generateInviteCode = () => {
    const code = generateRandomInviteCode();
    
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
