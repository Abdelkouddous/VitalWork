import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import PropTypes from "prop-types";

const ProtectedJobSeekerRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for authentication using cookies instead of token in localStorage
        await customFetch.get("/healthcare-professionals/me");
        setIsAuthenticated(true);
      } catch (error) {
        console.warn("Auth check failed, redirecting to login:", error?.response?.status);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/healthcare-professionals/login" state={{ from: location }} replace />
    );
  }

  return children;
};

ProtectedJobSeekerRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedJobSeekerRoute;
