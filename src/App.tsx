import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeOffboarding from './pages/EmployeeOffboarding';
import EmployeeStatus from './pages/EmployeeStatus';
import AccessRequest from './pages/AccessRequest';
import Ticketing from './pages/Ticketing';
import AssetCollection from './pages/AssetCollection';
import AdminPanel from './pages/AdminPanel';
import { useAppStore } from './lib/store';

function App() {
  const { isAuthenticated, user } = useAppStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employee-offboarding" element={<EmployeeOffboarding />} />
          <Route path="employee-status" element={<EmployeeStatus />} />
          <Route path="access-request" element={<AccessRequest />} />
          <Route path="ticketing" element={<Ticketing />} />
          <Route path="asset-collection" element={<AssetCollection />} />
          {user?.role === 'admin' && (
            <Route path="admin" element={<AdminPanel />} />
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;