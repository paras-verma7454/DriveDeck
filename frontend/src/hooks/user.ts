/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // console.log("user:", response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
}

// The useUser hook implementation has been moved to frontend/src/context/UserContext.tsx