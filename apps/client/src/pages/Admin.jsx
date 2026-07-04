import { useLoaderData, redirect, useRevalidator } from "react-router-dom";
import { Clock, ShieldCheck } from "lucide-react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/AdminContainer";
import { useAdminContext } from "./AdminLayout";

// Tab Components
import OverviewTab from "./components/Admin/OverviewTab";
import FinancialsTab from "./components/Admin/FinancialsTab";
import RecruitersTab from "./components/Admin/RecruitersTab";
import SeekersTab from "./components/Admin/SeekersTab";
import InsightsTab from "./components/Admin/InsightsTab";
import ProfileTab from "./components/Admin/ProfileTab";

// Loader to pull all CEO Analytics, Recruiter lists, and Seekers lists concurrently
export const loader = async () => {
  try {
    const [analyticsRes, employersRes, seekersRes] = await Promise.all([
      customFetch.get("/admin/ceo-analytics"),
      customFetch.get("/admin/clinics"),
      customFetch.get("/clinics/all-seekers"),
    ]);

    return {
      kpis: analyticsRes.data.kpis,
      growth: analyticsRes.data.growth,
      monthlyGrowth: analyticsRes.data.monthlyGrowth,
      dailyApplications: analyticsRes.data.dailyApplications,
      planDistribution: analyticsRes.data.planDistribution,
      jobStatusBreakdown: analyticsRes.data.jobStatusBreakdown,
      jobTypeBreakdown: analyticsRes.data.jobTypeBreakdown,
      topSpecializations: analyticsRes.data.topSpecializations,
      topSeekerSpecializations: analyticsRes.data.topSeekerSpecializations,
      blogCategories: analyticsRes.data.blogCategories,
      topLocations: analyticsRes.data.topLocations,
      applicationFunnel: analyticsRes.data.applicationFunnel,
      compatibilityBuckets: analyticsRes.data.compatibilityBuckets,
      engagement: analyticsRes.data.engagement,
      financials: analyticsRes.data.financials,
      health: analyticsRes.data.health,
      recentRecruiters: analyticsRes.data.recentRecruiters,
      recentJobSeekers: analyticsRes.data.recentJobSeekers,
      topJobsByApplications: analyticsRes.data.topJobsByApplications,
      quotaUtilization: analyticsRes.data.quotaUtilization,
      topBlogsByViews: analyticsRes.data.topBlogsByViews,
      today: analyticsRes.data.today,
      generatedAt: analyticsRes.data.generatedAt,
      employers: employersRes.data.users || [],
      seekers: seekersRes.data.jobSeekers || [],
    };
  } catch (error) {
    console.error("Error fetching CEO admin stats:", error);
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    if (!isAuthError) {
      toast.error("Access Denied — Restored to CEO Security Bounds.");
    }
    return redirect("/dashboard");
  }
};

const Admin = () => {
  const data = useLoaderData();
  const revalidator = useRevalidator();
  
  // Navigation tabs state
  const { activeTab } = useAdminContext();

  if (!data || !data.kpis) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
        <p>Loading admin dashboard data...</p>
      </div>
    );
  }

  return (
    <Wrapper>
      {/* Header Panel */}
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>
            VitalWork Command Centre
            <span className="status-badge approved" style={{ textTransform: "none" }}>
              <ShieldCheck className="h-3.5 w-3.5" />
              Platform Owner Session
            </span>
          </h1>
          <p>
            Real-time analytics engine & database operations hub.
          </p>
        </div>
        <div className="admin-sync-badge">
          <Clock className="h-4 w-4 text-[var(--primary-500)]" />
          <span>Synced at: {new Date(data.generatedAt).toLocaleTimeString()}</span>
          {revalidator.state === "loading" && (
            <span className="text-[var(--primary-500)] font-medium animate-pulse ml-2">Refreshing...</span>
          )}
        </div>
      </div>

      {/* Conditional Tabs rendering */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "financials" && <FinancialsTab />}
      {activeTab === "recruiters" && <RecruitersTab />}
      {activeTab === "seekers" && <SeekersTab />}
      {activeTab === "insights" && <InsightsTab />}
      {activeTab === "profile" && <ProfileTab />}
    </Wrapper>
  );
};

export default Admin;
