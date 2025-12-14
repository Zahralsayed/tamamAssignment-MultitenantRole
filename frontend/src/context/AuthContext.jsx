import React, { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  const login = (tenantId, role, userName) => {
    setSession({ tenantId, role, userName });
  };

  const logout = () => setSession(null);

  const value = useMemo(() => ({ session, login, logout }), [session]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};