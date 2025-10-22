import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import AboutUs from './components/AboutUs';
import ViewRestrooms from './components/ViewRestrooms';
import RequestQuote from './components/RequestQuote';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

type Page = 'home' | 'about' | 'restrooms' | 'quote' | 'admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isAdmin } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutUs />;
      case 'restrooms':
        return <ViewRestrooms onNavigate={setCurrentPage} />;
      case 'quote':
        return <RequestQuote />;
      case 'admin':
        if (isAdmin) {
          return (
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          );
        }
        return <AdminLogin onLoginSuccess={() => setCurrentPage('admin')} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const showNavAndFooter = currentPage !== 'admin' || !isAdmin;

  return (
    <div className="min-h-screen bg-white">
      {showNavAndFooter && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
      <main>
        {renderPage()}
      </main>
      {showNavAndFooter && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;