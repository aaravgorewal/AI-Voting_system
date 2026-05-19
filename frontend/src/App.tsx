import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import RoleRoute from './components/routing/RoleRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import AdminOverview from './pages/admin/AdminOverview';
import ElectionsPage from './pages/admin/ElectionsPage';
import CandidatesPage from './pages/admin/CandidatesPage';
import UsersPage from './pages/admin/UsersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import LiveResults from './pages/elections/LiveResults';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public + Voter Routes (shared navbar/footer layout) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/elections/:id/live" element={<LiveResults />} />
            </Route>
          </Route>

          {/* Admin Routes — own layout, role-gated */}
          <Route element={<RoleRoute allowedRoles={['admin', 'superadmin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"                element={<AdminOverview />} />
              <Route path="/admin/elections"      element={<ElectionsPage />} />
              <Route path="/admin/candidates"     element={<CandidatesPage />} />
              <Route path="/admin/users"          element={<UsersPage />} />
              <Route path="/admin/analytics"      element={<AnalyticsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" toastOptions={{
        style: { background: '#1A1F2C', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
    </AuthProvider>
  );
}

export default App;
