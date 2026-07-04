import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Search, Filter, Mail, MapPin, Check, AlertCircle } from "lucide-react";

const SeekersTab = () => {
  const data = useLoaderData();

  // Search & Filter States
  const [seekerSearch, setSeekerSearch] = useState("");
  const [seekerSpecFilter, setSeekerSpecFilter] = useState("all");

  // Get unique list of seeker specializations for filter dropdown
  const uniqueSeekerSpecs = [...new Set(data.seekers.map((s) => s.specialization).filter(Boolean))];

  // Filtering Seekers
  const filteredSeekers = data.seekers.filter((seek) => {
    const matchesSearch =
      seek.name.toLowerCase().includes(seekerSearch.toLowerCase()) ||
      seek.lastName.toLowerCase().includes(seekerSearch.toLowerCase()) ||
      seek.email.toLowerCase().includes(seekerSearch.toLowerCase()) ||
      (seek.location && seek.location.toLowerCase().includes(seekerSearch.toLowerCase()));

    const matchesSpec = seekerSpecFilter === "all" ? true : seek.specialization === seekerSpecFilter;

    return matchesSearch && matchesSpec;
  });

  return (
    <div className="admin-tab-container space-y-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-[var(--text-color)]">
        Medical Professionals Registry
      </h2>

      {/* Filter Panel */}
      <div className="filter-panel">
        <div className="search-wrapper">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search Healthcare Professionals by name, email or city..."
            value={seekerSearch}
            onChange={(e) => setSeekerSearch(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <span>Filters:</span>
          <select
            value={seekerSpecFilter}
            onChange={(e) => setSeekerSpecFilter(e.target.value)}
          >
            <option value="all">All Specialties</option>
            {uniqueSeekerSpecs.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Seekers List Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Medical Professional</th>
                <th>Specialization</th>
                <th>Location</th>
                <th>Verification</th>
                <th>Premium Membership</th>
                <th>Account Creation</th>
              </tr>
            </thead>
            <tbody>
              {filteredSeekers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                    No medical professionals found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredSeekers.map((seek) => (
                  <tr key={seek._id}>
                    {/* Name / Email */}
                    <td>
                      <div className="font-bold text-sm text-[var(--text-color)]">
                        {seek.name} {seek.lastName}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--text-secondary-color)]">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        {seek.email}
                      </div>
                    </td>

                    {/* Specialization */}
                    <td>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border"
                        style={{
                          background: "var(--primary-50)",
                          color: "var(--primary-700)",
                          borderColor: "var(--primary-100)",
                        }}
                      >
                        {seek.specialization || "Not Set"}
                      </span>
                    </td>

                    {/* City/Location */}
                    <td>
                      <div className="flex items-center gap-1 text-xs text-[var(--text-color)]">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--primary-500)]" />
                        {seek.location || "Unknown"}
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td>
                      {seek.isConfirmed ? (
                        <span className="status-badge approved">
                          <Check className="h-3 w-3" /> Confirmed
                        </span>
                      ) : (
                        <span className="status-badge unverified">
                          <AlertCircle className="h-3 w-3" /> Unconfirmed
                        </span>
                      )}
                    </td>

                    {/* Premium Status */}
                    <td>
                      {seek.isPremium ? (
                        <span className="status-badge premium uppercase tracking-wider animate-pulse">
                          Premium Gold
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-[var(--text-secondary-color)]">
                          Standard Free
                        </span>
                      )}
                    </td>

                    {/* Date Created */}
                    <td className="font-medium text-[var(--text-secondary-color)]">
                      {new Date(seek.createdAt).toLocaleDateString("fr-DZ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SeekersTab;
