
// Types for our settings
export type Language = "english" | "arabic" | "other";
export type Theme = "light" | "dark" | "system";
export type TextSize = "small" | "medium" | "large" | "extraLarge" | "huge";
export type ContrastMode = "normal" | "highContrast";
export type InputMethod = "touch" | "voice" | "switch";
export type NavItem = "home" | "pantry" | "shopping" | "spaces" | "family" | "tasks" | "calendar" | "notes" | "settings";

// Types for family members
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

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  generateInviteCode: () => string;
}
