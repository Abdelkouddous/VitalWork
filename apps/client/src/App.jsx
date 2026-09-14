// app.jsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  DashboardLayout,
  Error,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  DeleteJob,
  EditJob,
  Admin,
  JobSeekers,
  Employers,
  SalaryGuide,
  ResumeTips,
  CareerResources,
  Login,
  Register,
  Blogs,
  BlogDetail,
  AdminBlogs,
  MyJobs,
  Candidates,
  Contact,
  Privacy,
  Terms,
  ForgotPassword,
  ForgotPasswordJobSeeker,
} from "./pages";

// for Healthcare Professionals
import RegisterJobSeeker from "./pages/healthcare-professionals/RegisterJobSeeker";
import ConfirmAccount from "./pages/healthcare-professionals/ConfirmAccount";
import LoginJobSeeker from "./pages/healthcare-professionals/LoginJobSeeker";
import JobsJobSeeker from "./pages/healthcare-professionals/JobsJobSeeker";
import StatsJobSeeker from "./pages/healthcare-professionals/StatsJobSeeker";
import InboxJobSeeker from "./pages/healthcare-professionals/InboxJobSeeker";
import ProfileJobSeeker from "./pages/healthcare-professionals/ProfileJobSeeker";
import ApplicationsJobSeeker from "./pages/healthcare-professionals/ApplicationsJobSeeker";
import CVTemplate from "./pages/healthcare-professionals/CVTemplate";
import Dashboard from "./pages/healthcare-professionals/Dashboard";
import ProtectedJobSeekerRoute from "./pages/components/ProtectedJobSeekerRoute";
// imported actions necessary
// removed actions for default auth routes; Healthcare Professional pages handle submit locally
// for job operations
import { action as addJobAction } from "./pages/jobs-operations/AddJob";
import { action as editJobAction } from "./pages/jobs-operations/EditJob";
import { action as deleteJobAction } from "./pages/jobs-operations/DeleteJob";
// for user operations
import { action as updateProfileAction } from "./pages/clinics/Profile";
// imported loaders necessary
import { loader as dashboardLoader } from "./pages/DashboardLayout";
// for job operations
import { loader as allJobsLoader } from "./pages/jobs-operations/AllJobs";
import { loader as editJobLoader } from "./pages/jobs-operations/EditJob";
// imported loaders for admin page
import { loader as adminLoader } from "./pages/Admin";
import AdminLayout, { loader as adminLayoutLoader } from "./pages/AdminLayout";
import AdminLogin from "./pages/AdminLogin";

// Add employer auth actions
import { action as loginAction } from "./pages/clinics/Login";
import { action as registerAction } from "./pages/clinics/Register";
// Add employer OTP confirm page
import ConfirmAccountEmployer from "./pages/clinics/ConfirmAccount";
import { loader as myJobsLoader } from "./pages/clinics/MyJobs";
import { loader as candidatesLoader } from "./pages/clinics/Candidates";
import ApplicantGeneratedCV from "./pages/clinics/ApplicantGeneratedCV";
import ClinicDashboard from "./pages/clinics/ClinicDashboard";
// Blog loader
import { blogLoader } from "./pages/loaders/blogLoader";

// Create a function that determines and applies the default theme.
// Prefers saved user preference (localStorage) and falls back to system preference.
export const checkDefaultTheme = () => {
  let isDarkTheme = false;
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      isDarkTheme = true;
    } else if (saved === "light") {
      isDarkTheme = false;
    } else {
      const savedOldDark = localStorage.getItem("darkTheme");
      if (savedOldDark !== null) {
        isDarkTheme = savedOldDark === "true";
      } else if (typeof window !== "undefined" && window.matchMedia) {
        isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    }
  } catch {
    if (typeof window !== "undefined" && window.matchMedia) {
      isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

//================================================================
//VARIABLES & functions
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error></Error>,
    element: <HomeLayout></HomeLayout>,
    children: [
      // they are relative to the parent path "/"
      {
        index: true,
        element: <Landing></Landing>,
      },
      {
        path: "jobs",
        element: <JobsJobSeeker />,
      },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      // Admin specific login
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
      // Employer/admin OTP confirmation page
      {
        path: "confirm-account",
        element: <ConfirmAccountEmployer />,
      },
      {
        path: "landing",
        element: (
          <div>
            <Landing></Landing>
          </div>
        ),
      },
      {
        path: "clinics",
        element: <Employers />,
      },
      {
        path: "salary-guide",
        element: <SalaryGuide />,
      },
      {
        path: "resume-tips",
        element: <ResumeTips />,
      },
      {
        path: "career-resources",
        element: <CareerResources />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "blogs",
        element: <Blogs />,
        loader: blogLoader,
      },
      {
        path: "blogs/:id",
        element: <BlogDetail />,
        loader: blogLoader,
      },
    ],
  },

  // Dashboard routes for employers
  {
    path: "dashboard",
    element: (
      <>
        <DashboardLayout></DashboardLayout>
      </>
    ),
    loader: dashboardLoader,
    children: [
      { index: true, element: <ClinicDashboard /> },
      {
        path: "stats",
        element: <ClinicDashboard />,
      },
      {
        path: "all-jobs",
        element: <AllJobs />,
        loader: allJobsLoader,
      },
      {
        path: "add-job",
        element: <AddJob></AddJob>,
        action: addJobAction,
      },
      {
        path: "edit-job/:id",
        element: <EditJob></EditJob>,
        loader: editJobLoader,
        action: editJobAction,
      },
      {
        path: "delete-job/:id",
        element: <DeleteJob></DeleteJob>,
        action: deleteJobAction,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
        action: updateProfileAction,
      },
      {
        path: "my-jobs",
        element: <MyJobs />,
        loader: myJobsLoader,
      },
      {
        path: "candidates",
        element: <Candidates />,
        loader: candidatesLoader,
      },
      {
        path: "generated-cv/:id",
        element: <ApplicantGeneratedCV />,
      },
      {
        path: "blog-management",
        element: <AdminBlogs></AdminBlogs>,
        loader: blogLoader,
      },
    ],
  },
  {
    path: "dashboard/admin",
    element: <AdminLayout />,
    loader: adminLayoutLoader,
    children: [
      {
        index: true,
        element: <Admin />,
        loader: adminLoader,
      },
    ],
  },

  // Public Healthcare Professional auth routes
  {
    path: "healthcare-professionals/login",
    element: <LoginJobSeeker />,
  },
  {
    path: "healthcare-professionals/forgot-password",
    element: <ForgotPasswordJobSeeker />,
  },


  {
    path: "healthcare-professionals/confirm-account",
    element: <ConfirmAccount />,
  },
  {
    path: "healthcare-professionals/register",
    element: <RegisterJobSeeker />,
  },

  // Healthcare Professionals routes (authenticated area)
  {
    // Healthcare Professionals routes - PROTECTED STRUCTURE

    path: "healthcare-professionals",
    element: (
      <ProtectedJobSeekerRoute>
        <JobSeekers />
      </ProtectedJobSeekerRoute>
    ),
    children: [
      // Default route - redirect to dashboard
      { index: true, element: <Dashboard /> },
      // Nested routes (relative to /healthcare-professionals)
      { path: "dashboard", element: <Dashboard /> },
      { path: "jobs", element: <JobsJobSeeker /> },
      { path: "stats", element: <Dashboard /> },
      { path: "inbox", element: <InboxJobSeeker /> },
      { path: "applications", element: <ApplicationsJobSeeker /> },
      { path: "profile", element: <ProfileJobSeeker /> },
      { path: "cv-template", element: <CVTemplate /> },
      { path: "blog-management", element: <AdminBlogs />, loader: blogLoader },
    ],
  },

  // Public Healthcare Professional auth routes
  // {
  //   path: "healthcare-professionals/login",
  //   element: <LoginJobSeeker />,
  // },
  // {
  //   path: "healthcare-professionals/register",
  //   element: <RegisterJobSeeker />,
  // },

  // Keep the old routes for backward compatibility (optional)
  {
    path: "login-jobseeker",
    element: <LoginJobSeeker />,
  },
  {
    path: "register-jobseeker",
    element: <RegisterJobSeeker />,
  },

  // Catch all route
  {
    path: "*",
    element: <Error></Error>,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
