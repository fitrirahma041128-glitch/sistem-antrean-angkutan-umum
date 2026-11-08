import React, { useState } from 'react';
import { UserRole } from './types';
import { LoginView } from './components/auth/LoginView';
import { AdminLayout } from './components/admin/AdminLayout';
import { DriverMobileApp } from './components/driver/DriverMobileApp';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>({
    id: 'adm-1',
    name: 'Ibu Ratna Kumalasari, S.Pd',
    role: 'admin',
    email: 'admin.tu@smpmuh1wanareja.sch.id'
  });
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Login handler
  const handleLoginSuccess = (role: UserRole, user: any) => {
    setCurrentUser(user);
    setActiveRole(role);
    setIsLoggedIn(true);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Switch between Admin & Driver views
  const handleSwitchToDriver = () => {
    setActiveRole('driver');
    if (!currentUser || currentUser.role !== 'driver') {
      setCurrentUser({
        id: 'drv-1',
        name: 'Budi Santoso',
        role: 'driver',
        vehiclePlate: 'B 1234 KZ',
        vehicleName: 'Angkot 01',
        routeName: 'Rute Wanareja - Madusari'
      });
    }
  };

  const handleSwitchToAdmin = () => {
    setActiveRole('admin');
    if (!currentUser || currentUser.role !== 'admin') {
      setCurrentUser({
        id: 'adm-1',
        name: 'Ibu Ratna Kumalasari, S.Pd',
        role: 'admin',
        email: 'admin.tu@smpmuh1wanareja.sch.id'
      });
    }
  };

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  if (activeRole === 'driver') {
    return (
      <DriverMobileApp
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchToAdmin={handleSwitchToAdmin}
      />
    );
  }

  return (
    <AdminLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      onSwitchToDriver={handleSwitchToDriver}
    />
  );
}
