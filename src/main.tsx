
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FamilyInvitationsPage from './pages/FamilyInvitationsPage.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/family/invitations" element={<FamilyInvitationsPage />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </SettingsProvider>
  </React.StrictMode>,
);
