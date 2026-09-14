import { useEffect, useCallback } from "react";
import {
  FiX,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiAward,
  FiCheckCircle,
  FiBookmark,
  FiShare2,
  FiCheck,
  FiClock,
  FiActivity,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/JobDetailsModalWrapper";
import day from "dayjs";

/**
 * JobDetailsModal — LinkedIn-Style Clinical Opportunity Drawer
 *
 * Implements accessible modal dialog mechanics:
 * - Traps scroll via document.body overflow lock.
 * - Handles Escape key dismiss and backdrop dismiss.
 * - Adheres strictly to the Integer Money Guard (int min_cents -> DZD formatting).
 * - Styled strictly through JobDetailsModalWrapper (zero inline style dicts).
 */
const JobDetailsModal = ({
  job,
  isOpen,
  onClose,
  onApply,
  isApplied = false,
  isSaved = false,
  onToggleSave,
  isApplying = false,
}) => {
  // Handle keyboard ESC dismiss
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !job) return null;

  // Adhere strictly to the Integer Money Guard (cents to whole DZD)
  const formatSalary = () => {
    if (job.salaryRange?.min_cents) {
      const minVal = Math.round(job.salaryRange.min_cents / 100).toLocaleString();
      if (job.salaryRange?.max_cents) {
        const maxVal = Math.round(job.salaryRange.max_cents / 100).toLocaleString();
        return `${minVal} - ${maxVal} DZD / month`;
      }
      return `From ${minVal} DZD / month`;
    }
    if (job.salary) {
      return `${job.salary} DZD / month`;
    }
    return "Competitive / Negotiable";
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    } else {
      toast.info("Sharing enabled for this clinical posting.");
    }
  };

  const postedDate = job.createdAt
    ? day(job.createdAt).format("MMM D, YYYY")
    : "Recently Posted";

  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : "H";
  const specialization = job.specialization || "General Medicine";
  const jobType = job.jobType || "Full-time";
  const location = job.jobLocation || "Algiers, Algeria";

  return (
    <Wrapper
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-job-title"
    >
      <div className="modal-dialog">
        {/* ── 1. TOP ACTION CONTROLS ── */}
        <div className="modal-top-bar">
          <div className="top-badge-group">
            <span className="featured-tag">Verified Health Entity</span>
            <span className="status-tag">58 Wilayas Priority</span>
          </div>

          <div className="top-btn-group">
            <button
              type="button"
              className={`icon-action-btn ${isSaved ? "saved" : ""}`}
              onClick={() => onToggleSave && onToggleSave(job._id)}
              title={isSaved ? "Remove from saved jobs" : "Save this job"}
              aria-label="Bookmark job"
            >
              <FiBookmark />
            </button>
            <button
              type="button"
              className="icon-action-btn"
              onClick={handleShare}
              title="Share job link"
              aria-label="Share job"
            >
              <FiShare2 />
            </button>
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              title="Close modal"
              aria-label="Close modal"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* ── 2. MODAL HERO / HEADER ── */}
        <div className="modal-hero">
          <div className="hospital-avatar">
            {companyInitial}
          </div>
          <div className="hero-meta">
            <h2 id="modal-job-title" className="job-title">
              {job.position}
            </h2>
            <div className="company-row">
              <span className="company-name">
                {job.company}
                <span className="verified-badge">
                  <FiCheckCircle /> Verified
                </span>
              </span>
              <span>•</span>
              <span className="location-item">
                <FiMapPin /> {location}
              </span>
              <span>•</span>
              <span className="posting-timeline">
                <FiCalendar /> Posted {postedDate}
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. SCROLLABLE BODY CONTENT ── */}
        <div className="modal-body">
          {/* Key Clinical Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-box teal">
                <FiAward />
              </div>
              <div className="metric-data">
                <span className="metric-label">Specialty</span>
                <span className="metric-value">{specialization}</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box blue">
                <FiClock />
              </div>
              <div className="metric-data">
                <span className="metric-label">Contract Type</span>
                <span className="metric-value">{jobType}</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box green">
                <FiDollarSign />
              </div>
              <div className="metric-data">
                <span className="metric-label">Remuneration</span>
                <span className="metric-value">{formatSalary()}</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box amber">
                <FiActivity />
              </div>
              <div className="metric-data">
                <span className="metric-label">Department</span>
                <span className="metric-value">{job.department || "Clinical Unit"}</span>
              </div>
            </div>
          </div>

          {/* Clinical Overview Section */}
          <div className="details-section">
            <h3 className="section-heading">
              <FiBriefcase /> About the Clinical Role
            </h3>
            <p className="section-text">
              {job.notes ||
                job.description ||
                `The institution is seeking a qualified ${specialization} practitioner to join the clinical team in ${location}. This position involves diagnostic evaluation, inpatient rounds, patient treatment protocols, and collaborative care delivery according to Algerian Ministry of Health guidelines.`}
            </p>
          </div>

          {/* Key Clinical Responsibilities */}
          <div className="details-section">
            <h3 className="section-heading">
              <FiCheckCircle /> Core Clinical Responsibilities
            </h3>
            <ul className="checklist">
              <li className="checklist-item">
                <FiCheck /> Perform specialized clinical evaluations, patient consultations, and diagnostic management in accordance with national healthcare protocols.
              </li>
              <li className="checklist-item">
                <FiCheck /> Participate in multidisciplinary team discussions, mortality/morbidity audits, and clinical ward rounds.
              </li>
              <li className="checklist-item">
                <FiCheck /> Oversee patient medical documentation, prescription orders, and electronic health record maintenance.
              </li>
              <li className="checklist-item">
                <FiCheck /> Ensure compliance with hospital hygiene, aseptic standards, and patient confidentiality policies.
              </li>
            </ul>
          </div>

          {/* Licensure & Qualifications Checklist */}
          <div className="details-section">
            <h3 className="section-heading">
              <FiShield /> Licensure & Regulatory Requirements
            </h3>
            <ul className="checklist">
              <li className="checklist-item">
                <FiCheck /> Valid Algerian Medical Council (Conseil de l'Ordre des Médecins) registration license.
              </li>
              <li className="checklist-item">
                <FiCheck /> State Medical Doctorate (Doctorat en Médecine) or Specialized Medical Diploma (DEMS).
              </li>
              <li className="checklist-item">
                <FiCheck /> Active BLS/ACLS certification preferred for acute and emergency inpatient departments.
              </li>
              <li className="checklist-item">
                <FiCheck /> Full residency completion or minimum 1-year verified post-residency clinical experience.
              </li>
            </ul>
          </div>

          {/* Institution Profile */}
          <div className="hospital-info-box">
            <h4 className="hospital-info-title">About {job.company}</h4>
            <p className="hospital-info-desc">
              {job.company} is an accredited healthcare facility operating in {location}. The institution provides comprehensive primary, specialty, and emergency medical services to regional populations, supported by modern biomedical diagnostics and inpatient facilities.
            </p>
          </div>
        </div>

        {/* ── 4. STICKY ACTION FOOTER ── */}
        <div className="modal-footer">
          <div className="footer-salary-info">
            <span className="salary-label">Monthly Compensation</span>
            <span className="salary-value">{formatSalary()}</span>
          </div>

          <div className="footer-actions">
            <button
              type="button"
              className="btn-dismiss"
              onClick={onClose}
            >
              Back to Jobs
            </button>

            {isApplied ? (
              <button
                type="button"
                className="btn-apply-modal applied"
                disabled
              >
                <FiCheck /> Application Submitted
              </button>
            ) : (
              <button
                type="button"
                className="btn-apply-modal"
                disabled={isApplying}
                onClick={() => onApply && onApply(job._id)}
              >
                <FiBriefcase /> {isApplying ? "Submitting Application..." : "Apply to Position"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default JobDetailsModal;
