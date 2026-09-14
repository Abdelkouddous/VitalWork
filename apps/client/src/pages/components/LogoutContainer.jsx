import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import { FiUser, FiFileText, FiBriefcase, FiLogOut } from "react-icons/fi";
import { useDashboardContext } from "../DashboardLayout";
import Wrapper from "../../assets/wrappers/LogoutContainer";

const LogoutContainer = ({ user: propUser, onLogout: propLogout, roleTitle: propRole }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Gracefully attempt context reading if inside DashboardLayout
  let contextUser = null;
  let contextLogout = null;
  try {
    const ctx = useDashboardContext();
    if (ctx) {
      contextUser = ctx.user;
      contextLogout = ctx.logoutUser;
    }
  } catch {
    // Outside DashboardContext (e.g. JobSeekers or Admin layout)
  }

  const activeUser = propUser || contextUser;
  const handleLogout = propLogout || contextLogout || (() => navigate("/login"));

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const displayName = activeUser?.name 
    ? (activeUser.lastName ? `${activeUser.name} ${activeUser.lastName}` : activeUser.name)
    : "Healthcare User";

  const initial = displayName.charAt(0).toUpperCase() || "U";
  const userRole = propRole || activeUser?.role || (activeUser?.specialization ? "Doctor" : "Clinic");
  const isDoctor = activeUser?.role === "healthcareprofessional" || Boolean(activeUser?.specialization);
  const profilePath = isDoctor ? "/healthcare-professionals/profile" : "/dashboard/profile";
  const appsPath = isDoctor ? "/healthcare-professionals/applications" : "/dashboard/candidates";
  const jobsOrCvPath = isDoctor ? "/healthcare-professionals/cv-template" : "/dashboard/my-jobs";
  const jobsOrCvLabel = isDoctor ? "Medical CV" : "My Job Postings";

  return (
    <Wrapper ref={containerRef}>
      <button
        type="button"
        className="user-bar-btn"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="User account menu"
      >
        <div className="avatar-wrap">
          {activeUser?.avatar ? (
            <img src={activeUser.avatar} alt="avatar" className="user-avatar" />
          ) : (
            <div className="user-avatar">{initial}</div>
          )}
          <span className="status-dot" />
        </div>

        <div className="user-meta">
          <span className="user-name">{displayName}</span>
          <span className="user-role">
            {activeUser?.specialization || userRole}
          </span>
        </div>

        <FaCaretDown className={`caret-icon ${showDropdown ? "caret-rotate" : ""}`} />
      </button>

      <div className={`dropdown ${showDropdown ? "show-dropdown" : ""}`}>
        <div className="dropdown-header">
          <p className="header-name">{displayName}</p>
          <p className="header-email">{activeUser?.email || "verified@vitalwork.dz"}</p>
          <span className="header-badge">
            {isDoctor ? "Licensed Practitioner" : "Verified Clinic"}
          </span>
        </div>

        <Link
          to={profilePath}
          className="dropdown-item"
          onClick={() => setShowDropdown(false)}
        >
          <FiUser />
          <span>Profile & License</span>
        </Link>

        <Link
          to={appsPath}
          className="dropdown-item"
          onClick={() => setShowDropdown(false)}
        >
          <FiBriefcase />
          <span>{isDoctor ? "My Applications" : "Candidate Pipeline"}</span>
        </Link>

        <Link
          to={jobsOrCvPath}
          className="dropdown-item"
          onClick={() => setShowDropdown(false)}
        >
          <FiFileText />
          <span>{jobsOrCvLabel}</span>
        </Link>

        <button
          type="button"
          className="dropdown-item logout"
          onClick={() => {
            setShowDropdown(false);
            handleLogout();
          }}
        >
          <FiLogOut />
          <span>Sign Out</span>
        </button>
      </div>
    </Wrapper>
  );
};

export default LogoutContainer;
