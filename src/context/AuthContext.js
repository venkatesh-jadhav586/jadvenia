import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const loginWithGoogle = () => {
    // Replace with real Google OAuth in production
    setUser({
      id: 'u_001',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@gmail.com',
      avatar: 'AS',
      phone: '+91 98765 43210',
      kycStatus: 'pending', // pending | verified | rejected
      role: 'both', // seeker | host | both
      joinedAt: new Date().toISOString(),
    });
  };

  const loginWithEmail = (email, password) => {
    // Replace with real API call
    setUser({
      id: 'u_002',
      name: email.split('@')[0],
      email,
      avatar: email.slice(0, 2).toUpperCase(),
      phone: '',
      kycStatus: 'pending',
      role: 'seeker',
      joinedAt: new Date().toISOString(),
    });
  };

  const signup = (name, email, password) => {
    setUser({
      id: 'u_003',
      name,
      email,
      avatar: name.slice(0, 2).toUpperCase(),
      phone: '',
      kycStatus: 'pending',
      role: 'seeker',
      joinedAt: new Date().toISOString(),
    });
  };

  const logout = () => setUser(null);

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginWithEmail, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
