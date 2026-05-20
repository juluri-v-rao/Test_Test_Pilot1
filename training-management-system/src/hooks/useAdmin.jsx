import { createContext, useContext, useMemo, useState } from 'react';
import { validateAdminPassword } from '../services/api.js';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('training-admin') === 'true');

  function login(password) {
    if (!validateAdminPassword(password)) return false;
    sessionStorage.setItem('training-admin', 'true');
    setIsAdmin(true);
    return true;
  }

  function logout() {
    sessionStorage.removeItem('training-admin');
    setIsAdmin(false);
  }

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin must be used inside AdminProvider');
  return value;
}
