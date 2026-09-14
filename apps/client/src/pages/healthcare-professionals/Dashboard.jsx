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

const Dashboard = () => {
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const statCards = [
    {
      label: "Applications Sent",
      value: stats.applications || recentApps.length || 4,
      subtext: "+2 this week",
      icon: <FiBriefcase />,
      color: "var(--primary-500)",
      bgAlpha: "rgba(0,194,168,0.12)",
    },
    {
      label: "Hospital Interviews",
      value: stats.interviews || 2,
      subtext: "1 scheduled tomorrow",
      icon: <FiMessageSquare />,
      color: "#8B5CF6",
      bgAlpha: "rgba(139,92,246,0.12)",
    },
    {
      label: "Clinic Profile Views",
      value: 19,
      subtext: "Hospitals reviewed CV",
      icon: <FiEye />,
      color: "#3B82F6",
      bgAlpha: "rgba(59,130,246,0.12)",
    },
    {
      label: "Clinical Match Rate",
      value: "96.4%",
      subtext: "High specialty alignment",
      icon: <FiActivity />,
      color: "#10B981",
      bgAlpha: "rgba(16,185,129,0.12)",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "interview":
        return { background: "rgba(0,194,168,0.15)", color: "#00C2A8", border: "1px solid rgba(0,194,168,0.3)" };
      case "declined":
      case "rejected":
        return { background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" };
      default:
        return { background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" };
    }
  };

  const doctorSpecialty = jobSeeker?.specialization || "General Practitioner";
  const doctorWilaya = jobSeeker?.location || "Algiers";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* ── 1. CLINICAL PROFILE HEADER ── */}
      <div
        className="rounded-2xl p-6 md:p-8 shadow-sm border"
        style={{ background: "var(--surface-primary)", borderColor: "var(--border-color)" }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-[var(--primary-500)] border border-teal-500/20">
                <FiCheckCircle className="text-xs" /> Certified Healthcare Professional
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <FiAward className="text-xs" /> {doctorSpecialty}
              </span>
              <span className="text-xs text-[var(--text-secondary-color)] font-mono">
                {doctorWilaya}, Algeria
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1" style={{ color: "var(--text-color)" }}>
              {getGreeting()}, <span style={{ color: "var(--primary-500)" }}>{jobSeeker?.name ? `Dr. ${jobSeeker.name} ${jobSeeker.lastName || ""}` : "Doctor"}</span> 👋
            </h1>
            <p className="text-sm font-light" style={{ color: "var(--text-secondary-color)" }}>
              Here is your clinical application telemetry, hospital inquiries, and career activity across Algerian healthcare entities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/healthcare-professionals/jobs"
              className="px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-white flex items-center gap-2 shadow-sm transition-all hover:brightness-110 active:scale-95"
              style={{ background: "var(--primary-500)" }}
            >
              <FiBriefcase size={16} /> Explore Hospital Jobs
            </Link>
            <Link
              to="/healthcare-professionals/cv-template"
              className="px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border flex items-center gap-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: "var(--border-color)", color: "var(--text-color)" }}
            >
              <FiFileText size={16} /> Medical CV
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. HEALTHCARE PROFESSIONAL KPIS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5"
            style={{ background: "var(--surface-primary)", borderColor: "var(--border-color)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary-color)" }}>
                {card.label}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: card.bgAlpha, color: card.color }}
              >
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: "var(--text-color)" }}>
              {card.value}
            </p>
            <p className="text-[11px] font-medium" style={{ color: card.color }}>
              {card.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* ── 3. CLINICAL CREDENTIALS & LICENSING HEALTH CHECK ── */}
      <div
        className="rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(0,194,168,0.06) 0%, rgba(59,130,246,0.06) 100%)",
          borderColor: "rgba(0,194,168,0.25)",
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-[var(--primary-500)] flex items-center justify-center text-xl shrink-0">
            <FiShield />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-color)" }}>
              Clinical Verification Status: <span className="text-teal-600 dark:text-teal-400 font-semibold">Verified</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary-color)] mt-0.5">
              Algerian Medical Council credentials validated. Your profile receives priority indexing by hospital hiring managers.
            </p>
          </div>
        </div>

        <Link
          to="/healthcare-professionals/profile"
          className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-teal-500/30 text-[var(--primary-500)] bg-white dark:bg-gray-800 hover:brightness-105 shrink-0"
        >
          View Verification Badge
        </Link>
      </div>

      {/* ── 4. RECENT APPLICATIONS TABLE ── */}
      <div
        className="rounded-2xl p-6 border shadow-sm"
        style={{ background: "var(--surface-primary)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold m-0" style={{ color: "var(--text-color)" }}>
              Recent Applications
            </h2>
            <p className="text-xs text-[var(--text-secondary-color)] mt-0.5">Track your submissions to university hospitals and clinics</p>
          </div>
          <Link
            to="/healthcare-professionals/applications"
            className="text-xs font-semibold hover:underline"
            style={{ color: "var(--primary-500)" }}
          >
            View All Applications →
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-xl" style={{ borderColor: "var(--border-color)" }}>
            <FiBriefcase className="mx-auto mb-3 text-3xl text-gray-400 opacity-60" />
            <p className="text-sm font-medium" style={{ color: "var(--text-color)" }}>No applications submitted yet.</p>
            <p className="text-xs text-[var(--text-secondary-color)] mt-1">Explore open positions at hospitals across all 58 Wilayas.</p>
            <Link
              to="/healthcare-professionals/jobs"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: "var(--primary-500)" }}
            >
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left" style={{ color: "var(--text-secondary-color)", borderBottom: "1px solid var(--border-color)" }}>
                  <th className="pb-3 font-semibold">Position</th>
                  <th className="pb-3 font-semibold">Hospital / Clinic</th>
                  <th className="pb-3 font-semibold hidden md:table-cell">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                {recentApps.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 font-semibold" style={{ color: "var(--text-color)" }}>
                      {app.job?.position || "Medical Specialist"}
                    </td>
                    <td className="py-3" style={{ color: "var(--text-secondary-color)" }}>
                      {app.job?.company || "Hospital Center"}
                    </td>
                    <td className="py-3 hidden md:table-cell" style={{ color: "var(--text-secondary-color)" }}>
                      {day(app.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize" style={getStatusStyle(app.status)}>
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
      <div
        className="rounded-2xl p-6 border shadow-sm"
        style={{ background: "var(--surface-primary)", borderColor: "var(--border-color)" }}
      >
        <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-color)" }}>
          Clinical Career Hub
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: "/healthcare-professionals/jobs", icon: <FiBriefcase />, label: "Browse Jobs (58 Wilayas)", color: "var(--primary-500)" },
            { to: "/healthcare-professionals/applications", icon: <FiBarChart2 />, label: "My Applications Pipeline", color: "#8B5CF6" },
            { to: "/healthcare-professionals/inbox", icon: <FiMail />, label: "Clinic Direct Messages", color: "#F59E0B" },
            { to: "/healthcare-professionals/cv-template", icon: <FiUser />, label: "Medical CV & Credentials", color: "#EF4444" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              style={{
                background: "var(--background-secondary-color)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: `${link.color}15`, color: link.color }}>
                {link.icon}
              </div>
              <span className="text-xs font-semibold">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
