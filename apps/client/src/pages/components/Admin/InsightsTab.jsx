import React from "react";
import { useLoaderData } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const InsightsTab = () => {
  const data = useLoaderData();
  const {
    monthlyGrowth,
    applicationFunnel,
    topSpecializations,
    kpis,
    health,
  } = data;

  return (
    <div className="admin-tab-container space-y-8 animate-fadeIn">
      {/* Registration Growth Chart */}
      <div className="admin-card">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-color)]">
            Platform Registrations Growth (6-Month Trend)
          </h2>
          <p className="text-xs text-[var(--text-secondary-color)] mt-1">
            Growth progression of recruiters and Healthcare Professionals monthly.
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyGrowth}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border-color)"
              />
              <XAxis
                dataKey="label"
                stroke="var(--text-secondary-color)"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="var(--text-secondary-color)"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background-secondary-color)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-color)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
              <Bar dataKey="seekers" name="Healthcare Professionals" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recruiters" name="Recruiters" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="applications" name="Applications" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2-3">
        {/* Application Funnel Chart */}
        <div className="admin-card flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-color)] mb-2">
              Application Pipeline Funnel
            </h2>
            <p className="text-xs text-[var(--text-secondary-color)] mb-6">
              Aggregate ratios of placements and conversions.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Applied", count: applicationFunnel.applied, fill: "#6366f1" },
                    { name: "Viewed", count: applicationFunnel.viewed, fill: "#0ea5e9" },
                    { name: "Accepted", count: applicationFunnel.accepted, fill: "#10b981" },
                    { name: "Rejected", count: applicationFunnel.rejected, fill: "#f43f5e" },
                  ]}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="var(--border-color)"
                  />
                  <XAxis
                    type="number"
                    stroke="var(--text-secondary-color)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--text-secondary-color)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background-secondary-color)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {[
                      { fill: "#6366f1" },
                      { fill: "#0ea5e9" },
                      { fill: "#10b981" },
                      { fill: "#f43f5e" },
                    ].map((cell, idx) => (
                      <Cell key={`cell-${idx}`} fill={cell.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex justify-between text-xs font-medium text-[var(--text-secondary-color)]">
            <span>Total Applications: {kpis.totalApplications}</span>
            <span className="font-bold text-emerald-500">
              Funnel Placement Rate: {health.acceptanceRate}%
            </span>
          </div>
        </div>

        {/* Top Job Specializations */}
        <div className="admin-card">
          <h2 className="text-lg font-bold text-[var(--text-color)] mb-2">
            Demand by Specializations
          </h2>
          <p className="text-xs text-[var(--text-secondary-color)] mb-6">
            Top hospital requirements in Algeria.
          </p>

          <div className="space-y-4">
            {topSpecializations.slice(0, 5).map((spec, index) => {
              const percentage = Math.round((spec.count / (kpis.totalJobs || 1)) * 100);
              return (
                <div key={index}>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-[var(--text-color)]">
                    <span>{spec._id}</span>
                    <span>
                      {spec.count} postings ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[var(--background-color)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
                    <div
                      className="bg-sky-500 h-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
            <h4 className="text-xs font-bold mb-2 text-[var(--text-color)]">
              Platform Health Checkups
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div
                className="p-3 rounded-lg border"
                style={{
                  background: "var(--background-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <span className="block mb-1 text-[var(--text-secondary-color)]">
                  Avg Candidates / Job
                </span>
                <span className="text-lg font-black text-[var(--text-color)]">
                  {health.avgAppsPerJob}
                </span>
              </div>
              <div
                className="p-3 rounded-lg border"
                style={{
                  background: "var(--background-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <span className="block mb-1 text-[var(--text-secondary-color)]">
                  Apply Conversion Rate
                </span>
                <span className="text-lg font-black text-[var(--primary-500)]">
                  {health.viewToApplyRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsTab;
