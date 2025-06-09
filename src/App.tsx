
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import SignupPage from "./pages/SignupPage";
import FamilyPage from "./pages/FamilyPage";
import CreateFamilyPage from "./pages/CreateFamilyPage";
import FamilyInvitationsPage from "./pages/FamilyInvitationsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import MemberPage from "./pages/MemberPage";
import NotFound from "./pages/NotFound";

// Feature Pages
import SpacesPage from "./pages/spaces/SpacesPage";
import NewSpacePage from "./pages/spaces/NewSpacePage";
import SpaceDetailPage from "./pages/spaces/SpaceDetailPage";
import PantryPage from "./pages/pantry/PantryPage";
import AddPantryItemPage from "./pages/pantry/AddPantryItemPage";
import ShoppingListsPage from "./pages/shopping/ShoppingListsPage";
import NewShoppingListPage from "./pages/shopping/NewShoppingListPage";
import ShoppingListDetailPage from "./pages/shopping/ShoppingListDetailPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import TasksPage from "./pages/tasks/TasksPage";
import RecipesPage from "./pages/recipes/RecipesPage";
import RecipeFormPage from "./pages/recipes/RecipeFormPage";
import RecipeDetailPage from "./pages/recipes/RecipeDetailPage";
import ServicesPage from "./pages/services/ServicesPage";
import ChefDetailPage from "./pages/services/ChefDetailPage";
import UserBookingsPage from "./pages/services/UserBookingsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import ReportsPage from "./pages/reports/ReportsPage";

// Settings Pages
import AccountSettings from "./pages/settings/AccountSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import AppearanceSettings from "./pages/settings/AppearanceSettings";
import AccessibilitySettings from "./pages/settings/AccessibilitySettings";
import NavigationSettings from "./pages/settings/NavigationSettings";
import DialectSettings from "./pages/settings/DialectSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Protected routes */}
                <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/family" element={<ProtectedRoute><FamilyPage /></ProtectedRoute>} />
                <Route path="/family/create" element={<ProtectedRoute><CreateFamilyPage /></ProtectedRoute>} />
                <Route path="/family/invitations" element={<ProtectedRoute><FamilyInvitationsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/member/:id" element={<ProtectedRoute><MemberPage /></ProtectedRoute>} />
                
                {/* Feature routes */}
                <Route path="/spaces" element={<ProtectedRoute><SpacesPage /></ProtectedRoute>} />
                <Route path="/spaces/new" element={<ProtectedRoute><NewSpacePage /></ProtectedRoute>} />
                <Route path="/spaces/:id" element={<ProtectedRoute><SpaceDetailPage /></ProtectedRoute>} />
                <Route path="/pantry" element={<ProtectedRoute><PantryPage /></ProtectedRoute>} />
                <Route path="/pantry/add" element={<ProtectedRoute><AddPantryItemPage /></ProtectedRoute>} />
                <Route path="/shopping" element={<ProtectedRoute><ShoppingListsPage /></ProtectedRoute>} />
                <Route path="/shopping/new" element={<ProtectedRoute><NewShoppingListPage /></ProtectedRoute>} />
                <Route path="/shopping/:id" element={<ProtectedRoute><ShoppingListDetailPage /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
                <Route path="/recipes" element={<ProtectedRoute><RecipesPage /></ProtectedRoute>} />
                <Route path="/recipes/new" element={<ProtectedRoute><RecipeFormPage /></ProtectedRoute>} />
                <Route path="/recipes/:id" element={<ProtectedRoute><RecipeDetailPage /></ProtectedRoute>} />
                <Route path="/recipes/:id/edit" element={<ProtectedRoute><RecipeFormPage /></ProtectedRoute>} />
                <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
                <Route path="/services/chef/:id" element={<ProtectedRoute><ChefDetailPage /></ProtectedRoute>} />
                <Route path="/services/bookings" element={<ProtectedRoute><UserBookingsPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                
                {/* Settings routes */}
                <Route path="/settings/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
                <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
                <Route path="/settings/appearance" element={<ProtectedRoute><AppearanceSettings /></ProtectedRoute>} />
                <Route path="/settings/accessibility" element={<ProtectedRoute><AccessibilitySettings /></ProtectedRoute>} />
                <Route path="/settings/navigation" element={<ProtectedRoute><NavigationSettings /></ProtectedRoute>} />
                <Route path="/settings/dialect" element={<ProtectedRoute><DialectSettings /></ProtectedRoute>} />
                
                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
