/**
 * Main export file that centralizes all component imports/exports
 * Contains exports for:
 * - Layout components (Dashboard, Home)
 * - Authentication pages (Login, Register)
 * - Core pages (Landing, Error, Profile, Admin, Stats)
 * - Job operation pages (Add, View, Delete, Edit jobs)
 * - UI components (Footer, Navbar, FormRow)
 * - Navigation components (Sidebars, Logout)
 * - Admin-specific components (AdminCard, RecentActivity)
 */

export { default as DashboardLayout } from "./DashboardLayout";
export { default as AdminLayout } from "./AdminLayout";
export { default as Landing } from "./Landing";
export { default as HomeLayout } from "./HomeLayout";
export { default as Error } from "./Error";
export { default as Login } from "./clinics/Login";
export { default as Profile } from "./clinics/Profile";
export { default as Register } from "./clinics/Register";
export { default as Admin } from "./Admin";
export { default as Stats } from "./Stats";
export { default as SalaryGuide } from "./SalaryGuide";
export { default as ResumeTips } from "./ResumeTips";
export { default as CareerResources } from "./CareerResources";
export { default as Employers } from "./clinics/Employers";
export { default as MyJobs } from "./clinics/MyJobs";
export { default as Candidates } from "./clinics/Candidates";
export { default as Blogs } from "./Blogs";
export { default as BlogDetail } from "./BlogDetail";
export { default as AdminBlogs } from "./AdminBlogs";
export { default as Contact } from "./Contact";
export { default as Privacy } from "./Privacy";
export { default as Terms } from "./Terms";
// job operations
export { default as AddJob } from "./jobs-operations/AddJob";
export { default as AllJobs } from "./jobs-operations/AllJobs";
export { default as DeleteJob } from "./jobs-operations/DeleteJob";
export { default as EditJob } from "./jobs-operations/EditJob";
//header and footer
export { default as Footer } from "../footer/Footer";
export { default as Navbar } from "../navbar/Navbar";
//sidebars
export { default as SmallSideBar } from "../pages/components/SmallSideBar";
export { default as BigSideBar } from "../pages/components/BigSideBar";
export { default as FormRow } from "../pages/components/FormRow";
export { default as LogoutContainer } from "../pages/components/LogoutContainer";
//
export { default as AdminCard } from "../pages/components/Admin/AdminCard";
export { default as RecentActivityItem } from "../pages/components/Admin/RecentActivity";
// Healthcare Professionals
export { default as RegisterJobSeeker } from "./healthcare-professionals/RegisterJobSeeker";
export { default as LoginJobSeeker } from "./healthcare-professionals/LoginJobSeeker";
export { default as JobsJobSeeker } from "./healthcare-professionals/JobsJobSeeker";
export { default as StatsJobSeeker } from "./healthcare-professionals/StatsJobSeeker";
export { default as InboxJobSeeker } from "./healthcare-professionals/InboxJobSeeker";
export { default as JobSeekers } from "./healthcare-professionals/JobSeekers";
export { default as ApplicationsJobSeeker } from "./healthcare-professionals/ApplicationsJobSeeker";
export { default as ForgotPassword } from "./clinics/ForgotPassword";
export { default as ForgotPasswordJobSeeker } from "./healthcare-professionals/ForgotPasswordJobSeeker";

