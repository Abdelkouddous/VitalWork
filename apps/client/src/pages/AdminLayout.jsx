import React, { createContext, useContext, useState } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { AdminBigSidebar, AdminSmallSidebar } from "./components/AdminSidebar";
import { AdminNavbar } from "./components/AdminNavbar";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const AdminContext = createContext();

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/clinics/current-user");
    if (data?.user?.role !== "admin") {
      return redirect("/dashboard");
    }
    return data;
  } catch (error) {
    return redirect("/login");
  }
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useLoaderData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    try {
      await customFetch.get("/auth/logout");
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        showSidebar,
        setShowSidebar,
        toggleSidebar,
        logoutUser,
        activeTab,
        setActiveTab,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <AdminSmallSidebar />
          <AdminBigSidebar />
          <div className="dashboard-content">
            <AdminNavbar />
            <div className="dashboard-page">
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
export default AdminLayout;
