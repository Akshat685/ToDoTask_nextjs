"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import "react-toastify/dist/ReactToastify.css";

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export default function Logout() {
  const { logout } = useAuth();
  const router = useRouter();
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logoutMutation();
        
        // Set a flag in localStorage to indicate successful logout
        localStorage.setItem("logoutSuccess", "true");
      } catch (err) {
        console.error("Logout error:", err);
        // Set a flag in localStorage to indicate logout with error
        localStorage.setItem("logoutError", "true");
      }
      
      setTimeout(() => {
        logout();
        router.push("/login?status=logout");
        setIsLoggingOut(false);
      }, 1000);
    };
    
    performLogout();
  }, [logout, router, logoutMutation]);
  
  // Return a minimal component while logout is processing
  return (
    isLoggingOut && (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Logging out...</span>
          </div>
          <p>Logging out...</p>
        </div>
      </div>
    )
  );
}