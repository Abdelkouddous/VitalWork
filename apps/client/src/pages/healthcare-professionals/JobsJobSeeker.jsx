import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  FiBriefcase,
  FiMapPin,
  FiSearch,
  FiFilter,
  FiBookmark,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiEye,
  FiCheck,
} from "react-icons/fi";
import Wrapper from "../../assets/wrappers/JobSeekerJobsWrapper";
import JobDetailsModal from "../components/JobDetailsModal";
import day from "dayjs";

/**
 * JobsJobSeeker — Clinical Positions Board with LinkedIn-Style Details Modal
 *
 * Implements:
 * - Unified modeling via JobSeekerJobsWrapper (zero inline style dicts).
 * - LinkedIn-style detail modal enabling comprehensive preview before applying.
 * - Integer Money Guard compliance (int min_cents to formatted DZD).
 * - Synchronized application tracking and optimistic application feedback.
 */
function JobsJobSeeker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [isGuest, setIsGuest] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const [filters, setFilters] = useState({
    jobType: "",
    specialization: "",
    location: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const jobsPerPage = 10;

  const locationHook = useLocation();
  const navigate = useNavigate();

  // Fetch jobs from REST endpoint
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.specialization) params.specialization = filters.specialization;
      if (filters.location) params.jobLocation = filters.location;
      if (sortBy) params.sort = sortBy;

      const res = await customFetch.get("/jobs", { params });
      setJobs(res.data.jobs || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load clinical positions");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, sortBy]);

  // Load existing user applications to display "Applied" state
  useEffect(() => {
    const fetchUserTelemetry = async () => {
      try {
        await customFetch.get("/healthcare-professionals/me");
        setIsGuest(false);

        try {
          const appRes = await customFetch.get("/healthcare-professionals/applications");
          const submittedIds = new Set(
            (appRes.data.applications || []).map((app) => app.job?._id || app.job)
          );
          setAppliedJobIds(submittedIds);
        } catch {
          // Applications not yet initialized
        }
      } catch {
        setIsGuest(true);
      }
    };
    fetchUserTelemetry();
  }, []);

  // Format currency complying with Integer Money Guard
  const formatSalary = (job) => {
    if (job.salaryRange?.min_cents) {
      const minDzd = Math.round(job.salaryRange.min_cents / 100).toLocaleString();
      if (job.salaryRange?.max_cents) {
        const maxDzd = Math.round(job.salaryRange.max_cents / 100).toLocaleString();
        return `${minDzd} - ${maxDzd} DZD`;
      }
      return `${minDzd} DZD`;
    }
    if (job.salary) {
      return `${job.salary} DZD`;
    }
    return "Negotiable";
  };

  // Submit clinical application
  const apply = async (jobId) => {
    if (appliedJobIds.has(jobId)) {
      toast.info("You have already submitted an application for this position.");
      return;
    }

    try {
      setIsApplying(true);
      await customFetch.get("/healthcare-professionals/me");
      await customFetch.post(`/healthcare-professionals/apply/${jobId}`);
      
      setAppliedJobIds((prev) => new Set(prev).add(jobId));
      toast.success("Application successfully submitted to hospital hiring team!");
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.info("Please sign in or create your medical credentials to apply");
        navigate("/healthcare-professionals/login");
      } else {
        toast.error(e?.response?.data?.message || "Application submission failed");
      }
    } finally {
      setIsApplying(false);
    }
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        toast.info("Job removed from saved bookmarks");
      } else {
        next.add(jobId);
        toast.success("Job bookmarked for later review");
      }
      return next;
    });
  };

  // Sync URL parameters
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    setSearchTerm(params.get("search") || "");
    setFilters({
      jobType: params.get("jobType") || "",
      specialization: params.get("specialization") || "",
      location: params.get("jobLocation") || "",
    });
    setSortBy(params.get("sort") || "newest");
  }, [locationHook.search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filters, sortBy]);

  const clearFilters = () => {
    setFilters({ jobType: "", specialization: "", location: "" });
    setSearchTerm("");
    setSortBy("newest");
  };

  const uniqueJobTypes = [...new Set(jobs.map((j) => j.jobType).filter(Boolean))];
  const uniqueSpecializations = [
    ...new Set(jobs.map((j) => j.specialization).filter(Boolean)),
  ];

  const totalJobs = jobs.length;
  const numOfPages = Math.ceil(totalJobs / jobsPerPage) || 1;
  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > numOfPages) newPage = numOfPages;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="loading"></div>
        <p className="text-sm font-medium text-[var(--text-secondary-color)]">
          Loading Clinical Positions Across Algeria...
        </p>
      </div>
    );
  }

  return (
    <Wrapper>
      {/* ── 1. GUEST CTA BANNER ── */}
      {isGuest && (
        <div className="guest-banner">
          <p className="guest-banner-text">
            Viewing clinical openings as guest. Log in or create a medical practitioner profile to submit direct applications.
          </p>
          <div className="guest-banner-actions">
            <button
              type="button"
              className="btn-hipster"
              onClick={() => navigate("/healthcare-professionals/register")}
            >
              Create Account
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/healthcare-professionals/login")}
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* ── 2. PAGE HEADER ── */}
      <div className="header-section">
        <div className="header-top">
          <div>
            <h1 className="page-title">Explore Hospital Positions</h1>
            <p className="page-subtitle">
              Verified clinical opportunities across public hospital centers and private clinics in all 58 Wilayas
            </p>
          </div>
          <div className="jobs-counter">
            <FiTrendingUp />
            <span>{jobs.length} Positions Available</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-card">
          <div className="search-row">
            <div className="search-input-wrapper">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by position title, hospital, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Clinic A-Z</option>
              <option value="position">Position A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. TWO-COLUMN LAYOUT: SIDEBAR + FEED ── */}
      <div className="layout-grid">
        {/* Filter Sidebar */}
        <aside className="sidebar-filter">
          <div className="filter-box">
            <div className="filter-header">
              <h3>
                <FiFilter /> Filters
              </h3>
              <button type="button" onClick={clearFilters}>
                Clear
              </button>
            </div>

            {/* Job Type Filter */}
            <div className="filter-group">
              <label>Contract Type</label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
              >
                <option value="">All Contracts</option>
                {uniqueJobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialization Filter */}
            <div className="filter-group">
              <label>Specialization</label>
              <select
                value={filters.specialization}
                onChange={(e) =>
                  setFilters({ ...filters, specialization: e.target.value })
                }
              >
                <option value="">All Specializations</option>
                {uniqueSpecializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Wilaya / Location Filter */}
            <div className="filter-group">
              <label>Wilaya / Location</label>
              <input
                type="text"
                placeholder="e.g. Algiers, Oran, Setif"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              >
              </input>
            </div>
          </div>
        </aside>

        {/* Jobs Feed */}
        <div className="jobs-feed">
          {jobs.length === 0 ? (
            <div className="empty-state">
              <FiBriefcase />
              <h3>No Clinical Positions Found</h3>
              <p>Try adjusting your search criteria or resetting filters.</p>
              <button type="button" className="btn" onClick={clearFilters}>
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="jobs-list">
              {currentJobs.map((job) => {
                const isApplied = appliedJobIds.has(job._id);
                const isSaved = savedJobs.has(job._id);

                return (
                  <article
                    key={job._id}
                    className="job-card"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="job-card-main">
                      <div className="job-details-col">
                        <div className="job-top-row">
                          <div className="hospital-icon-avatar">
                            {job.company?.charAt(0)?.toUpperCase() || "H"}
                          </div>
                          <div className="job-heading-wrap">
                            <h3 className="job-position">
                              <span>{job.position}</span>
                              <button
                                type="button"
                                className={`bookmark-btn ${isSaved ? "saved" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveJob(job._id);
                                }}
                                title={isSaved ? "Bookmarked" : "Save Job"}
                                aria-label="Save Job"
                              >
                                <FiBookmark />
                              </button>
                            </h3>
                            <div className="job-hospital-meta">
                              <span className="hospital-name">{job.company}</span>
                              <span>•</span>
                              <span>
                                <FiMapPin className="inline mr-1" />
                                {job.jobLocation || "Algiers, Algeria"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pill-group">
                          <span className="specialty-pill">
                            {job.specialization || "General Medicine"}
                          </span>
                          <span className="type-pill">
                            {job.jobType || "Full-time"}
                          </span>
                          {job.department && (
                            <span className="type-pill">{job.department}</span>
                          )}
                        </div>

                        {job.notes && (
                          <p className="job-snippet">{job.notes}</p>
                        )}
                      </div>

                      {/* Right-aligned Actions & Remuneration */}
                      <div className="card-action-col">
                        <div className="action-btn-group">
                          <button
                            type="button"
                            className="btn-details"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                            }}
                          >
                            <FiEye /> View Details
                          </button>

                          {isApplied ? (
                            <button
                              type="button"
                              className="btn-apply-card applied"
                              disabled
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiCheck /> Applied
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-apply-card"
                              disabled={isApplying}
                              onClick={(e) => {
                                e.stopPropagation();
                                apply(job._id);
                              }}
                            >
                              <FiBriefcase /> Apply
                            </button>
                          )}
                        </div>

                        <div className="card-salary-box">
                          <span className="card-salary-label">Remuneration</span>
                          <span className="card-salary-val">
                            <FiDollarSign /> {formatSalary(job)}
                          </span>
                        </div>

                        <div className="card-date-posted">
                          <FiClock /> {day(job.createdAt).format("MMM D, YYYY")}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalJobs > jobsPerPage && (
            <div className="pagination-container">
              <button
                type="button"
                className="page-num-btn"
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              {Array.from({ length: numOfPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`page-num-btn ${p === page ? "active" : ""}`}
                  onClick={() => changePage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                className="page-num-btn"
                onClick={() => changePage(page + 1)}
                disabled={page === numOfPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── 4. LINKEDIN-STYLE JOB DETAILS MODAL ── */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onApply={apply}
        isApplied={appliedJobIds.has(selectedJob?._id)}
        isSaved={savedJobs.has(selectedJob?._id)}
        onToggleSave={toggleSaveJob}
        isApplying={isApplying}
      />
    </Wrapper>
  );
}

export default JobsJobSeeker;
