import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { Search, Filter, Mail, MapPin, Check, Ban, AlertCircle } from "lucide-react";
import customFetch from "../../../utils/customFetch";
import { toast } from "react-toastify";

const PLAN_COLORS = {
  trial: "#94a3b8",      // slate-400
  basic: "#0ea5e9",      // sky-500
  pro: "#6366f1",        // indigo-500
  enterprise: "#a855f7"  // purple-500
};

const RecruitersTab = () => {
  const data = useLoaderData();
  const revalidator = useRevalidator();

  // Search & Filter States
  const [recruiterSearch, setRecruiterSearch] = useState("");
  const [recruiterPlanFilter, setRecruiterPlanFilter] = useState("all");
  const [recruiterStatusFilter, setRecruiterStatusFilter] = useState("all");

  // Inline editing state for quotas
  const [editingQuotaId, setEditingQuotaId] = useState(null);
  const [quotaInputValue, setQuotaInputValue] = useState("");

  // Local updating loading state
  const [isUpdating, setIsUpdating] = useState(false);

  // Status handler
  const handleUpdateStatus = async (employerId, currentStatus) => {
    let nextStatus = "approved";
    if (currentStatus === "approved") {
      nextStatus = "blocked";
    } else if (currentStatus === "blocked") {
      nextStatus = "approved";
    } else if (currentStatus === "pending") {
      nextStatus = "approved";
    }

    setIsUpdating(true);
    try {
      const res = await customFetch.patch(`/admin/clinics/${employerId}/status`, {
        status: nextStatus,
      });
      toast.success(res.data.msg || `Status successfully updated to ${nextStatus}`);
      revalidator.revalidate();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update recruiter status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Quota handler
  const handleSaveQuota = async (employerId) => {
    const quotaVal = Number(quotaInputValue);
    if (isNaN(quotaVal) || quotaVal < 0) {
      toast.error("Please enter a valid positive number for the quota.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await customFetch.patch(`/admin/clinics/${employerId}/quota`, {
        jobOffersQuota: quotaVal,
      });
      toast.success(res.data.msg || "Quota limit updated successfully.");
      setEditingQuotaId(null);
      revalidator.revalidate();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update quota.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Plan handler
  const handlePlanChange = async (employerId, newPlan) => {
    setIsUpdating(true);
    try {
      const res = await customFetch.patch(`/admin/clinics/${employerId}/quota`, {
        plan: newPlan,
      });
      toast.success(res.data.msg || `Recruiter subscription set to ${newPlan.toUpperCase()}`);
      revalidator.revalidate();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update subscription tier.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filters logic
  const filteredRecruiters = data.employers.filter((emp) => {
    if (emp.role === "admin") return false;

    const matchesSearch =
      emp.name.toLowerCase().includes(recruiterSearch.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(recruiterSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(recruiterSearch.toLowerCase()) ||
      (emp.location && emp.location.toLowerCase().includes(recruiterSearch.toLowerCase()));

    const matchesPlan = recruiterPlanFilter === "all" ? true : emp.plan === recruiterPlanFilter;
    const matchesStatus =
      recruiterStatusFilter === "all" ? true : emp.status === recruiterStatusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="admin-tab-container space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[var(--text-color)]">
          Recruiter Accounts Registry
        </h2>
        {isUpdating && (
          <span className="text-[var(--primary-500)] text-xs font-semibold animate-pulse">
            Syncing data...
          </span>
        )}
      </div>

      {/* Filter Panel */}
      <div className="filter-panel">
        <div className="search-wrapper">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search recruiters by name, email or city..."
            value={recruiterSearch}
            onChange={(e) => setRecruiterSearch(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <span>Filters:</span>
          <select
            value={recruiterPlanFilter}
            onChange={(e) => setRecruiterPlanFilter(e.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="trial">Trial</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <select
            value={recruiterStatusFilter}
            onChange={(e) => setRecruiterStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Recruiters List Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Recruiter Hospital / Clinic</th>
                <th>Location</th>
                <th>Subscription Plan</th>
                <th>Quota Utilized</th>
                <th>Auth Verification</th>
                <th>Platform Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecruiters.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                    No recruiters found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredRecruiters.map((emp) => {
                  const isPending = emp.status === "pending";
                  const isBlocked = emp.status === "blocked";
                  const isEditingQuota = editingQuotaId === emp._id;

                  return (
                    <tr key={emp._id}>
                      {/* Name / Email */}
                      <td>
                        <div className="font-bold text-sm text-[var(--text-color)]">
                          {emp.name} {emp.lastName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--text-secondary-color)]">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {emp.email}
                        </div>
                      </td>

                      {/* Location */}
                      <td>
                        <div className="flex items-center gap-1 text-xs text-[var(--text-color)]">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--primary-500)]" />
                          {emp.location || "Not Provided"}
                        </div>
                      </td>

                      {/* Plan Dropdown selector */}
                      <td>
                        <select
                          value={emp.plan}
                          onChange={(e) => handlePlanChange(emp._id, e.target.value)}
                          className="px-2 py-1 rounded font-bold text-[10px] uppercase tracking-wide cursor-pointer"
                          style={{
                            color: PLAN_COLORS[emp.plan],
                            border: `1px solid var(--border-color)`,
                            background: `var(--background-color)`,
                          }}
                        >
                          <option value="trial" style={{ color: PLAN_COLORS.trial }}>
                            Trial
                          </option>
                          <option value="basic" style={{ color: PLAN_COLORS.basic }}>
                            Basic
                          </option>
                          <option value="pro" style={{ color: PLAN_COLORS.pro }}>
                            Pro
                          </option>
                          <option value="enterprise" style={{ color: PLAN_COLORS.enterprise }}>
                            Enterprise
                          </option>
                        </select>
                      </td>

                      {/* Quota Settings Inline */}
                      <td>
                        {isEditingQuota ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={quotaInputValue}
                              onChange={(e) => setQuotaInputValue(e.target.value)}
                              style={{
                                width: "60px",
                                background: "var(--background-color)",
                                border: "1px solid var(--border-color)",
                                color: "var(--text-color)",
                              }}
                              className="rounded px-1.5 py-0.5 text-xs font-bold"
                            />
                            <button
                              onClick={() => handleSaveQuota(emp._id)}
                              style={{ cursor: "pointer" }}
                              className="p-1 rounded bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingQuotaId(null)}
                              style={{ cursor: "pointer" }}
                              className="p-1 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--text-color)]">
                              {emp.lifetimeJobOffersCreated} / {emp.jobOffersQuota}
                            </span>
                            <button
                              onClick={() => {
                                setEditingQuotaId(emp._id);
                                setQuotaInputValue(String(emp.jobOffersQuota));
                              }}
                              style={{ cursor: "pointer" }}
                              className="text-[10px] font-black text-[var(--primary-500)] hover:underline bg-transparent border-none"
                            >
                              Adjust
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Verification Status */}
                      <td>
                        {emp.isConfirmed ? (
                          <span className="status-badge approved">
                            <Check className="h-3 w-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="status-badge unverified">
                            <AlertCircle className="h-3 w-3" /> Unverified
                          </span>
                        )}
                      </td>

                      {/* Account Status Badge */}
                      <td>
                        {isPending ? (
                          <span className="status-badge pending">Pending Approval</span>
                        ) : isBlocked ? (
                          <span className="status-badge blocked">Blocked</span>
                        ) : (
                          <span className="status-badge approved">Active</span>
                        )}
                      </td>

                      {/* Status Modifiers Actions */}
                      <td style={{ textAlign: "right" }}>
                        {isPending ? (
                          <button
                            onClick={() => handleUpdateStatus(emp._id, "pending")}
                            style={{ cursor: "pointer" }}
                            className="btn py-1 px-3.5 rounded-lg text-[10px] font-bold"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(emp._id, emp.status)}
                            style={{ cursor: "pointer" }}
                            className={`btn py-1 px-3.5 rounded-lg text-[10px] font-bold ${
                              isBlocked ? "" : "danger-btn"
                            }`}
                          >
                            {isBlocked ? "Unblock" : "Block"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruitersTab;
