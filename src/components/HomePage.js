import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Hero from './Hero';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigateToFeature = (feature) => {
    if (feature === 'create-project') {
      // Check authentication before allowing project creation
      if (isAuthenticated) {
        navigate('/create-project');
      } else {
        navigate('/auth');
      }
    } else if (feature === 'design-inspiration') {
      navigate('/design-inspiration');
    } else if (feature === 'cursor-tips') {
      navigate('/cursor-tips');
    } else if (feature === 'files-guidance') {
      navigate('/files-guidance');
    }
  };

  const handleNavigateToDashboard = () => {
    // Check authentication before allowing dashboard access
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToDesignInspiration={() => navigate('/design-inspiration')}
        onNavigateToHome={() => navigate('/')}
      />
      <main className="max-w-6xl mx-auto px-6 py-12 pt-24">
        <Hero onNavigateToFeature={handleNavigateToFeature} />
      </main>
    </div>
  );
};

export default HomePage; 