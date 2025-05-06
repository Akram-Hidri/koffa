
import { Settings } from "./types";

// Default settings
export const defaultSettings: Settings = {
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
