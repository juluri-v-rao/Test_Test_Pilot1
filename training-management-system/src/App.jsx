import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminProvider } from './hooks/useAdmin.jsx';
import { ToastProvider, useToast } from './hooks/useToast.jsx';
import { TrainingDataProvider } from './hooks/useTrainingData.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Analytics from './pages/Analytics.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EmployeeDetails from './pages/EmployeeDetails.jsx';
import Employees from './pages/Employees.jsx';
import Modules from './pages/Modules.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Toast from './components/Toast.jsx';

function AppShell() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const { toast, clear } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <BrowserRouter>
      <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
      <Toast toast={toast} onClose={clear} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <ToastProvider>
        <TrainingDataProvider>
          <AppShell />
        </TrainingDataProvider>
      </ToastProvider>
    </AdminProvider>
  );
}
