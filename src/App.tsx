import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import AuthPage from "./pages/AuthPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";
import AppearanceSettings from "./pages/settings/AppearanceSettings";
import AccountSettings from "./pages/settings/AccountSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import AccessibilitySettings from "./pages/settings/AccessibilitySettings";
import FamilyPage from "./pages/FamilyPage";
import MemberPage from "./pages/MemberPage";
import FamilyInvitationsPage from "./pages/FamilyInvitationsPage";

// Pages
import PantryPage from "./pages/pantry/PantryPage";
import AddPantryItemPage from "./pages/pantry/AddPantryItemPage";
import ShoppingListsPage from "./pages/shopping/ShoppingListsPage";
import ShoppingListDetailPage from "./pages/shopping/ShoppingListDetailPage";
import SpacesPage from "./pages/spaces/SpacesPage";
import SpaceDetailPage from "./pages/spaces/SpaceDetailPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import ReportsPage from "./pages/reports/ReportsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Settings routes */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/appearance" element={<AppearanceSettings />} />
        <Route path="/settings/account" element={<AccountSettings />} />
        <Route path="/settings/notifications" element={<NotificationSettings />} />
        <Route path="/settings/accessibility" element={<AccessibilitySettings />} />
        
        {/* Family routes */}
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/family/member/:id" element={<MemberPage />} />
        <Route path="/family/invitations" element={<FamilyInvitationsPage />} />
        
        {/* Pantry routes */}
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="/pantry/add" element={<AddPantryItemPage />} />
        
        {/* Shopping routes */}
        <Route path="/shopping" element={<ShoppingListsPage />} />
        <Route path="/shopping/list/:id" element={<ShoppingListDetailPage />} />
        <Route path="/shopping/new" element={<ShoppingListsPage />} />
        
        {/* Spaces routes */}
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/spaces/:id" element={<SpaceDetailPage />} />
        
        {/* Other pages */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner position="top-center" closeButton />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
