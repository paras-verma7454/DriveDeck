import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINT_URL } from '../hooks/user'; // Re-use ENDPOINT_URL

// Define the shape of the user context
interface UserContextType {
  user: any;
  role: string;
  permissions: string[];
  loading: boolean;
  refetch: () => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the UserProvider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);
  const [roleData, setRoleData] = useState<any>('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        // No token, so user is not logged in. Set to null and stop loading.
        setUserData(null);
        setRoleData('');
        setPermissions([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${ENDPOINT_URL}/v1/user`, {
        headers: {
          authorization: `${token}`
        },
      });

      const data = response.data;
      if (data) {
        setPermissions(data.permissions || []);
        setUserData(data.user);
        setRoleData(data.role?.roleName || '');
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("Failed to fetch user data:", error);
      // On error, assume user is not logged in or session is invalid
      setUserData(null);
      setRoleData('');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, [trigger]); // Depend on trigger for refetching

  const refetch = useCallback(() => {
    setTrigger(t => t + 1);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Re-run when fetchUserData (or trigger) changes

  const value = {
    user: userData,
    role: roleData,
    permissions,
    loading,
    refetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
