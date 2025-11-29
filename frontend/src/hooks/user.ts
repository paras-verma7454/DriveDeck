import { useState, useEffect } from "react";
import axios from "axios";

export const ENDPOINT_URL = import.meta.env.VITE_BACKEND_URL;
export const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;

export const user = async () => {
  try {
    const response = await axios.get(`${ENDPOINT_URL}/v1/user`, {
        headers:{
            authorization: `${localStorage.getItem("Authorization")}`
        }
    })
    console.log("user:", response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
}

export const useUser = () => {
  const [userData, setUserData] = useState<any>(null);
  const [roleData, setRoleData] = useState<any>('');
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const data = await user();
    console.log("user:", data.user)
    console.log("role:", data.role.roleName)
    setUserData(data.user);
    setRoleData(data.role.roleName);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user: userData, role: roleData, loading, refetch: fetchUser };
};