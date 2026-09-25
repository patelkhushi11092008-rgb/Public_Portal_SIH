import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ObservationProvider } from './context/ObservationContext';
import { CivilianAuthProvider } from './context/CivilianAuthContext';

// Pages
import HomePage from './pages/HomePage';
import CivilianDashboard from './pages/CivilianDashboard';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import TransparencyPage from './pages/TransparencyPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <CivilianAuthProvider>
      <ObservationProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<CivilianDashboard />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/project/:id" element={<ProjectDetailPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/feedback" element={<ReportPage />} />
              <Route path="/report-issue" element={<ReportPage />} />
              <Route path="/my-feedback" element={<CivilianDashboard />} />
              <Route path="/my-issues" element={<CivilianDashboard />} />
              <Route path="/transparency" element={<TransparencyPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ObservationProvider>
    </CivilianAuthProvider>
  );
}
