import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";

// Auth Pages
import AuthPage from "./pages/auth/AuthPage";
import SignupPage from "./pages/SignupPage";
import CreateFamilyPage from "./pages/CreateFamilyPage";

// Main Pages
import HomePage from "./pages/HomePage";
import PantryPage from "./pages/pantry/PantryPage";
import AddPantryItemPage from "./pages/pantry/AddPantryItemPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import ShoppingListsPage from "./pages/shopping/ShoppingListsPage";
import ShoppingListDetailPage from "./pages/shopping/ShoppingListDetailPage";
import NewShoppingListPage from "./pages/shopping/NewShoppingListPage";
import ServicesPage from "./pages/services/ServicesPage";
import ChefDetailPage from "./pages/services/ChefDetailPage";
import UserBookingsPage from "./pages/services/UserBookingsPage";
import SpacesPage from "./pages/spaces/SpacesPage";
import SpaceDetailPage from "./pages/spaces/SpaceDetailPage";
import NewSpacePage from "./pages/spaces/NewSpacePage";
import RecipesPage from "./pages/recipes/RecipesPage";
import RecipeDetailPage from "./pages/recipes/RecipeDetailPage";
import RecipeFormPage from "./pages/recipes/RecipeFormPage";
import TasksPage from "./pages/tasks/TasksPage";
import ReportsPage from "./pages/reports/ReportsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";

// Settings Pages
import SettingsPage from "./pages/SettingsPage";
import AccountSettings from "./pages/settings/AccountSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import AppearanceSettings from "./pages/settings/AppearanceSettings";
import NavigationSettings from "./pages/settings/NavigationSettings";
import AccessibilitySettings from "./pages/settings/AccessibilitySettings";
import DialectSettings from "./pages/settings/DialectSettings";

// Family Pages
import FamilyPage from "./pages/FamilyPage";
import FamilyInvitationsPage from "./pages/FamilyInvitationsPage";
import MemberPage from "./pages/MemberPage";
import ProfilePage from "./pages/ProfilePage";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <AuthProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/create-family" element={<CreateFamilyPage />} />
                
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                
                {/* Pantry Routes */}
                <Route path="/pantry" element={<ProtectedRoute><PantryPage /></ProtectedRoute>} />
                <Route path="/pantry/add" element={<ProtectedRoute><AddPantryItemPage /></ProtectedRoute>} />
                
                {/* Calendar Routes */}
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                
                {/* Shopping Routes */}
                <Route path="/shopping" element={<ProtectedRoute><ShoppingListsPage /></ProtectedRoute>} />
                <Route path="/shopping/new" element={<ProtectedRoute><NewShoppingListPage /></ProtectedRoute>} />
                <Route path="/shopping/list/:listId" element={<ProtectedRoute><ShoppingListDetailPage /></ProtectedRoute>} />
                
                {/* Services Routes */}
                <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
                <Route path="/services/chef/:chefId" element={<ProtectedRoute><ChefDetailPage /></ProtectedRoute>} />
                <Route path="/services/bookings" element={<ProtectedRoute><UserBookingsPage /></ProtectedRoute>} />
                
                {/* Spaces Routes */}
                <Route path="/spaces" element={<ProtectedRoute><SpacesPage /></ProtectedRoute>} />
                <Route path="/spaces/new" element={<ProtectedRoute><NewSpacePage /></ProtectedRoute>} />
                <Route path="/spaces/:spaceId" element={<ProtectedRoute><SpaceDetailPage /></ProtectedRoute>} />
                
                {/* Recipe Routes */}
                <Route path="/recipes" element={<ProtectedRoute><RecipesPage /></ProtectedRoute>} />
                <Route path="/recipes/create" element={<ProtectedRoute><RecipeFormPage /></ProtectedRoute>} />
                <Route path="/recipes/:recipeId" element={<ProtectedRoute><RecipeDetailPage /></ProtectedRoute>} />
                <Route path="/recipes/:recipeId/edit" element={<ProtectedRoute><RecipeFormPage /></ProtectedRoute>} />
                
                {/* Other Routes */}
                <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                
                {/* Settings Routes */}
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/settings/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
                <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
                <Route path="/settings/appearance" element={<ProtectedRoute><AppearanceSettings /></ProtectedRoute>} />
                <Route path="/settings/navigation" element={<ProtectedRoute><NavigationSettings /></ProtectedRoute>} />
                <Route path="/settings/accessibility" element={<ProtectedRoute><AccessibilitySettings /></ProtectedRoute>} />
                <Route path="/settings/dialect" element={<ProtectedRoute><DialectSettings /></ProtectedRoute>} />
                
                {/* Family Routes */}
                <Route path="/family" element={<ProtectedRoute><FamilyPage /></ProtectedRoute>} />
                <Route path="/family/invitations" element={<ProtectedRoute><FamilyInvitationsPage /></ProtectedRoute>} />
                <Route path="/members/:memberId" element={<ProtectedRoute><MemberPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
