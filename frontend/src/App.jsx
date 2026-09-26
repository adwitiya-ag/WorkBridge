import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { PostJobPage } from './pages/PostJobPage';
import { CommunityPage } from './pages/CommunityPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { EmployerDashboardPage } from './pages/EmployerDashboardPage';
import { JobSeekerAuthPage } from './pages/JobSeekerAuthPage';
import { EmployerAuthPage } from './pages/EmployerAuthPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Routes config
import { ROUTES } from './config/routes.config';

// Global Styles
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.JOBS} element={<JobsPage />} />
                <Route path={ROUTES.JOB_DETAILS} element={<JobDetailsPage />} />
                <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />

                {/* Candidate Auth */}
                <Route path={ROUTES.USER_LOGIN} element={<JobSeekerAuthPage defaultTab="login" />} />
                <Route path={ROUTES.USER_REGISTER} element={<JobSeekerAuthPage defaultTab="register" />} />

                {/* Employer Auth */}
                <Route path={ROUTES.EMPLOYER_LOGIN} element={<EmployerAuthPage defaultTab="login" />} />
                <Route path={ROUTES.EMPLOYER_REGISTER} element={<EmployerAuthPage defaultTab="register" />} />

                {/* Candidate Protected Routes */}
                <Route
                  path={ROUTES.USER_PROFILE}
                  element={
                    <ProtectedRoute allowedRoles={['JobSeeker']}>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Employer Protected Routes */}
                <Route
                  path={ROUTES.POST_JOB}
                  element={
                    <ProtectedRoute allowedRoles={['Employer']}>
                      <PostJobPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.EMPLOYER_DASHBOARD}
                  element={
                    <ProtectedRoute allowedRoles={['Employer']}>
                      <EmployerDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
