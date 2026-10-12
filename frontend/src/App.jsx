import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';

// Simple check to ensure user is logged in
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('crm_user');
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Everything inside here requires login */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}

export default App;