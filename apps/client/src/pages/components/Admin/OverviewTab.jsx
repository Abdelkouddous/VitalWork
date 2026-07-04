import React from "react";
import { useLoaderData } from "react-router-dom";
import {
  Users,
  Briefcase,
  Calendar,
  Heart,
  TrendingUp,
  Award,
  DollarSign,
  Activity,
  AlertCircle,
  ArrowUpRight,
  Settings,
  UserCheck,
} from "lucide-react";
import { useAdminContext } from "../../AdminLayout";

const OverviewTab = () => {
  const data = useLoaderData();
  const { setActiveTab } = useAdminContext();

  const {
    kpis,
    growth,
    today,
    health,
  } = data;

  return (
    <div className="admin-tab-container space-y-8">
      {/* Quick Metrics Grid */}
      <div className="grid-4">
        {/* Metric 1 */}
        <div className="admin-card">
          <div className="card-header-flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary-color)]">
                Total Active Users
              </p>
              <h3 className="text-3xl font-extrabold mt-2 text-[var(--text-color)]">
                {kpis.totalUsers}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="flex items-center gap-0.5 font-bold text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  +{growth.recruiters.pct + growth.seekers.pct}%
                </span>
                <span className="text-[var(--text-secondary-color)]">MoM Growth</span>
              </div>
            </div>
            <div className="card-icon-bg">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="admin-card">
          <div className="card-header-flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary-color)]">
                Recruiter Accounts
              </p>
              <h3 className="text-3xl font-extrabold mt-2 text-[var(--text-color)]">
                {kpis.totalRecruiters}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span
                  className={`flex items-center gap-0.5 font-bold ${
                    growth.recruiters.pct >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {growth.recruiters.pct >= 0 ? "+" : ""}
                  {growth.recruiters.pct}%
                </span>
                <span className="text-[var(--text-secondary-color)]">
                  this month ({growth.recruiters.thisMonth})
                </span>
              </div>
            </div>
            <div className="card-icon-bg">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="admin-card">
          <div className="card-header-flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary-color)]">
                Medical Job Listings
              </p>
              <h3 className="text-3xl font-extrabold mt-2 text-[var(--text-color)]">
                {kpis.totalJobs}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="flex items-center gap-0.5 font-bold text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  +{growth.jobs.pct}%
                </span>
                <span className="text-[var(--text-secondary-color)]">
                  this month ({growth.jobs.thisMonth})
                </span>
              </div>
            </div>
            <div className="card-icon-bg">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="admin-card">
          <div className="card-header-flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary-color)]">
                Total Applications
              </p>
              <h3 className="text-3xl font-extrabold mt-2 text-[var(--text-color)]">
                {kpis.totalApplications}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="flex items-center gap-0.5 font-bold text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  +{growth.applications.pct}%
                </span>
                <span className="text-[var(--text-secondary-color)]">
                  this month ({growth.applications.thisMonth})
                </span>
              </div>
            </div>
            <div className="card-icon-bg">
              <Heart className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2-3">
        {/* Today's Pulse */}
        <div className="admin-card">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--text-color)]">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            Today's Platform Pulse
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                value: today.newRecruiters,
                label: "New Recruiters",
                borderColor: "var(--primary-400)",
                textColor: "var(--primary-500)",
              },
              {
                value: today.newJobSeekers,
                label: "New Professionals",
                borderColor: "var(--primary-300)",
                textColor: "var(--primary-500)",
              },
              {
                value: today.newJobs,
                label: "New Jobs Posted",
                borderColor: "var(--primary-400)",
                textColor: "var(--primary-600)",
              },
              {
                value: today.newApplications,
                label: "New Applications",
                borderColor: "var(--red-dark)",
                textColor: "var(--red-dark)",
              },
              {
                value: today.newMessages,
                label: "Chat Exchange",
                borderColor: "var(--primary-500)",
                textColor: "var(--primary-500)",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-l-4 flex flex-col justify-between"
                style={{
                  borderColor: `var(--border-color)`,
                  borderLeftColor: item.borderColor,
                  background: `var(--background-color)`,
                }}
              >
                <span
                  className="text-2xl font-black"
                  style={{ color: item.textColor }}
                >
                  {item.value}
                </span>
                <span className="text-xs font-semibold mt-2 block leading-snug text-[var(--text-secondary-color)]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Health Score Indicators */}
          <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
            <h3 className="text-sm font-bold mb-4 text-[var(--text-color)]">
              Core Ecosystem Health Indexes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-[var(--text-color)]">
                  <span>Recruiter-to-Seeker Ratio</span>
                  <span>
                    1 : {(kpis.totalJobSeekers / (kpis.totalRecruiters || 1)).toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-[var(--background-color)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
                  <div
                    className="bg-[var(--primary-500)] h-full"
                    style={{
                      width: `${Math.min(
                        (kpis.totalJobSeekers / (kpis.totalRecruiters || 1)) * 10,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-[var(--text-color)]">
                  <span>Confirm Activation Rate</span>
                  <span>{health.activationRate}%</span>
                </div>
                <div className="w-full bg-[var(--background-color)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${health.activationRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-[var(--text-color)]">
                  <span>Premium Talent Penetration</span>
                  <span>{health.seekerPremiumRate}%</span>
                </div>
                <div className="w-full bg-[var(--background-color)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: `${health.seekerPremiumRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Settings Quick Access */}
        <div className="admin-card flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-[var(--text-color)]">
              <Settings className="h-5 w-5" />
              Management Shortcuts
            </h2>
            <p className="text-xs mb-6 text-[var(--text-secondary-color)]">
              Instantly navigate to manage critical assets.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab("recruiters")}
                className="w-full flex items-center justify-between p-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] hover:border-[var(--primary-500)] text-left text-sm font-semibold transition-all group text-[var(--text-color)]"
                style={{ cursor: "pointer", outline: "none" }}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--primary-500)]" />
                  Manage Hospital Accounts
                </span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab("seekers")}
                className="w-full flex items-center justify-between p-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] hover:border-[var(--primary-500)] text-left text-sm font-semibold transition-all group text-[var(--text-color)]"
                style={{ cursor: "pointer", outline: "none" }}
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[var(--primary-500)]" />
                  Browse Medical CVs
                </span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab("financials")}
                className="w-full flex items-center justify-between p-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] hover:border-[var(--primary-500)] text-left text-sm font-semibold transition-all group text-[var(--text-color)]"
                style={{ cursor: "pointer", outline: "none" }}
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[var(--primary-500)]" />
                  Review Financial Model
                </span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Status Alert panel */}
          <div
            className="mt-6 p-4 rounded-xl border flex items-start gap-3"
            style={{
              borderColor: "rgba(245, 158, 11, 0.3)",
              background: "rgba(245, 158, 11, 0.08)",
            }}
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <h4 className="text-xs font-bold text-[var(--text-color)]">
                Review Pending Approvals
              </h4>
              <p className="text-[11px] mt-1 leading-snug text-[var(--text-secondary-color)]">
                {kpis.pendingRecruiters} recruiter signups are currently awaiting
                administrative credentials check.
              </p>
              {kpis.pendingRecruiters > 0 && (
                <button
                  onClick={() => {
                    // Set active tab to recruiters
                    setActiveTab("recruiters");
                  }}
                  className="mt-2 text-xs font-black underline hover:no-underline text-[var(--primary-500)] bg-transparent border-none cursor-pointer"
                  style={{ outline: "none" }}
                >
                  Process Pending Registrations &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
