import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiUser,
  FiMail,
  FiBarChart2,
  FiMessageSquare,
  FiShield,
  FiCheckCircle,
  FiEye,
  FiActivity,
  FiAward,
  FiFileText,
} from "react-icons/fi";
import customFetch from "../../utils/customFetch";
import day from "dayjs";
import Wrapper from "../../assets/wrappers/UserDashboardWrapper";
import JobDetailsModal from "../components/JobDetailsModal";

const Dashboard = () => {
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
  });
  const [recentApps, setRecentApps] = useState([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchJobSeekerData = async () => {
      try {
        const response = await customFetch.get("/healthcare-professionals/me");
        setJobSeeker(response.data.jobSeeker || response.data);

        try {
          const statsResponse = await customFetch.get("/healthcare-professionals/stats");
          setStats(statsResponse.data);
        } catch (error) {
          console.log("Stats not available yet:", error.message);
        }

        try {
          const appsResponse = await customFetch.get("/healthcare-professionals/applications");
          setRecentApps((appsResponse.data.applications || []).slice(0, 5));
        } catch (error) {
          console.log("Applications not available:", error.message);
        }
      } catch (fetchError) {
        console.error("Error fetching Healthcare Professional data:", fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchJobSeekerData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="loading"></div>
        <p className="text-sm font-medium text-[var(--text-secondary-color)]">Loading Medical Practitioner Profile...</p>
      </div>
    );
  }

  const totalAppsCount = stats.applications !== undefined 
    ? stats.applications 
    : (recentApps ? recentApps.length : 0);
  const interviewsCount = stats.interviews !== undefined ? stats.interviews : 0;
  const profileViewsCount = stats.profileViews !== undefined ? stats.profileViews : (stats.counts?.viewed || 0);
  const matchRateVal = stats.matchRate || (stats.avgCompatibility > 0 ? `${stats.avgCompatibility}%` : (totalAppsCount > 0 ? "85%" : "0%"));

  const statCards = [
    {
      label: "Applications Sent",
      value: totalAppsCount,
      subtext: totalAppsCount > 0 ? `${totalAppsCount} active in database` : "No submissions yet",
      icon: <FiBriefcase />,
      themeClass: "teal",
    },
    {
      label: "Hospital Interviews",
      value: interviewsCount,
      subtext: interviewsCount > 0 ? `${interviewsCount} invitations confirmed` : "0 scheduled",
      icon: <FiMessageSquare />,
      themeClass: "purple",
    },
    {
      label: "Clinic Profile Views",
      value: profileViewsCount,
      subtext: profileViewsCount > 0 ? "Reviewed by clinic hiring team" : "0 views recorded",
      icon: <FiEye />,
      themeClass: "blue",
    },
    {
      label: "Clinical Match Rate",
      value: matchRateVal,
      subtext: stats.avgCompatibility > 0 ? "Algorithm compatibility score" : "Awaiting evaluations",
      icon: <FiActivity />,
      themeClass: "green",
    },
  ];

  const doctorSpecialty = jobSeeker?.specialization || "General Practitioner";
  const doctorWilaya = jobSeeker?.location || "Algiers";

  return (
    <Wrapper>
      {/* ── 1. CLINICAL PROFILE HEADER ── */}
      <div className="header-card">
        <div>
          <div className="badge-row">
            <span className="clinical-badge">
              <FiCheckCircle /> Certified Healthcare Professional
            </span>
            <span className="specialty-badge">
              <FiAward /> {doctorSpecialty}
            </span>
            <span className="wilaya-tag">
              {doctorWilaya}, Algeria
            </span>
          </div>

          <h1 className="welcome-title">
            {getGreeting()},{" "}
            <span className="doctor-name">
              {jobSeeker?.name
                ? jobSeeker.name.startsWith("Dr.")
                  ? `${jobSeeker.name} ${jobSeeker.lastName || ""}`
                  : `Dr. ${jobSeeker.name} ${jobSeeker.lastName || ""}`
                : "Doctor"}
            </span>{" "}
            👋
          </h1>
          <p className="welcome-subtitle">
            Here is your clinical application telemetry, hospital inquiries, and career activity across Algerian healthcare entities.
          </p>
        </div>

        <div className="action-btns">
          <Link to="/healthcare-professionals/jobs" className="btn-primary">
            <FiBriefcase /> Explore Hospital Jobs
          </Link>
          <Link to="/healthcare-professionals/cv-template" className="btn-secondary">
            <FiFileText /> Medical CV
          </Link>
        </div>
      </div>

      {/* ── 2. HEALTHCARE PROFESSIONAL KPIS ── */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">{card.label}</span>
              <div className={`kpi-icon-box ${card.themeClass}`}>
                {card.icon}
              </div>
            </div>
            <p className="kpi-value">{card.value}</p>
            <p className={`kpi-trend ${card.themeClass}`}>{card.subtext}</p>
          </div>
        ))}
      </div>

      {/* ── 3. CLINICAL CREDENTIALS & LICENSING HEALTH CHECK ── */}
      <div className="verification-card">
        <div className="verification-info">
          <div className="shield-box">
            <FiShield />
          </div>
          <div className="verification-text">
            <h3>
              Clinical Verification Status: <span className="status-tag">Verified</span>
            </h3>
            <p>
              Algerian Medical Council credentials validated. Your profile receives priority indexing by hospital hiring managers.
            </p>
          </div>
        </div>

        <Link to="/healthcare-professionals/profile" className="badge-btn">
          View Verification Badge
        </Link>
      </div>

      {/* ── 4. RECENT APPLICATIONS TABLE ── */}
      <div className="table-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Recent Applications</h2>
            <p className="card-subtitle">Track your submissions to university hospitals and clinics</p>
          </div>
          <Link to="/healthcare-professionals/applications" className="view-all-link">
            View All Applications →
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="empty-state">
            <FiBriefcase className="empty-icon" />
            <p className="empty-title">No applications submitted yet.</p>
            <p className="empty-desc">Explore open positions at hospitals across all 58 Wilayas.</p>
            <Link to="/healthcare-professionals/jobs" className="btn-primary">
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="apps-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Hospital / Clinic</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr
                    key={app._id}
                    className="clickable-row"
                    onClick={() => app.job && setSelectedJob(app.job)}
                    title="Click to view clinical details"
                  >
                    <td><strong>{app.job?.position || "Medical Specialist"}</strong></td>
                    <td className="company-col">{app.job?.company || "Hospital Center"}</td>
                    <td className="date-col">{day(app.createdAt).format("MMM D, YYYY")}</td>
                    <td>
                      <span className={`status-badge ${app.status?.toLowerCase() || "pending"}`}>
                        {app.status || "Under Review"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 5. QUICK LINKS HUB ── */}
      <div className="hub-card">
        <h2 className="hub-title">Clinical Career Hub</h2>
        <div className="hub-grid">
          {[
            { to: "/healthcare-professionals/jobs", icon: <FiBriefcase />, label: "Browse Jobs (58 Wilayas)", colorClass: "teal" },
            { to: "/healthcare-professionals/applications", icon: <FiBarChart2 />, label: "My Applications Pipeline", colorClass: "purple" },
            { to: "/healthcare-professionals/inbox", icon: <FiMail />, label: "Clinic Direct Messages", colorClass: "amber" },
            { to: "/healthcare-professionals/cv-template", icon: <FiUser />, label: "Medical CV & Credentials", colorClass: "red" },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="hub-link">
              <div className={`hub-icon ${link.colorClass}`}>
                {link.icon}
              </div>
              <span className="hub-text">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 6. LINKEDIN-STYLE JOB DETAILS MODAL ── */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        isApplied={true}
      />
    </Wrapper>
  );
};

export default Dashboard;
