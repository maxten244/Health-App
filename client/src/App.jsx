import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import CrisisButton from './components/CrisisButton';
import CrisisModal from './components/CrisisModal';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MoodHistory from './pages/MoodHistory';
import Community from './pages/Community';
import CommunityNew from './pages/CommunityNew';
import PostDetail from './pages/PostDetail';
import CrisisPage from './pages/CrisisPage';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner" role="status" aria-live="polite"><span className="visually-hidden">Loading…</span></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner" role="status" aria-live="polite"><span className="visually-hidden">Loading…</span></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route
          path="/login"
          element={(
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/signup"
          element={(
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood-history"
          element={
            <ProtectedRoute>
              <Layout><MoodHistory /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Layout><Community /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/new"
          element={
            <ProtectedRoute>
              <Layout><CommunityNew /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/:postId"
          element={
            <ProtectedRoute>
              <Layout><PostDetail /></Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/crisis" element={<Layout><CrisisPage /></Layout>} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<Layout><NotFound /></Layout>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <CrisisButton />
      <CrisisModal />
    </>
  );
}