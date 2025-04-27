
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/appearance" element={<AppearanceSettings />} />
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/accessibility" element={<AccessibilitySettings />} />
          <Route path="/grab-and-go" element={<HomePage />} /> {/* Placeholder route */}
          <Route path="/lists" element={<HomePage />} /> {/* Placeholder route */}
          <Route path="/lists/:id" element={<HomePage />} /> {/* Placeholder route */}
          <Route path="/lists/new" element={<HomePage />} /> {/* Placeholder route */}
          <Route path="/pantry" element={<HomePage />} /> {/* Placeholder route */}
          <Route path="/profile" element={<HomePage />} /> {/* Placeholder route */}
          <Route path="/suggestions" element={<HomePage />} /> {/* Placeholder route */}
          <Route path="/reminders" element={<HomePage />} /> {/* Placeholder route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner position="top-center" closeButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
