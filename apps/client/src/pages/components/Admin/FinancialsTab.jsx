import React from "react";
import { useLoaderData } from "react-router-dom";
import { DollarSign, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const PLAN_COLORS = {
  trial: "#94a3b8",      // slate-400
  basic: "#0ea5e9",      // sky-500
  pro: "#6366f1",        // indigo-500
  enterprise: "#a855f7"  // purple-500
};

const FinancialsTab = () => {
  const data = useLoaderData();
  const { financials, kpis } = data;

  const formatDinar = (val) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="admin-tab-container space-y-8 animate-fadeIn">
      <h2 className="text-xl font-bold text-[var(--text-color)]">
        Financial Engine KPI Summary
      </h2>

      {/* Revenue KPI Cards */}
      <div className="grid-3">
        {/* MRR Card */}
        <div className="admin-card gradient-primary relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-6">
            <DollarSign className="h-40 w-40" />
          </div>
          <p className="text-xs font-semibold opacity-85 uppercase tracking-wider">
            Current Monthly Recurring Revenue (MRR)
          </p>
          <h3 className="text-4xl font-black mt-3">
            {formatDinar(financials.currentMRR)}
          </h3>
          <div className="flex items-center gap-1.5 mt-4 text-xs bg-white/15 w-fit px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>
              Annualized run-rate: {formatDinar(financials.currentMRR * 12)}
            </span>
          </div>
        </div>

        {/* Paid Subscriber Penetration */}
        <div className="admin-card flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary-color)]">
              Subscriber Penetration
            </p>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-extrabold text-[var(--text-color)]">
                {financials.paidUsers}
              </span>
              <span className="text-xs text-[var(--text-secondary-color)]">
                paid out of {kpis.totalRecruiters} recruiters
              </span>
            </div>
            <div className="w-full bg-[var(--background-color)] h-2 rounded-full overflow-hidden mt-3 border border-[var(--border-color)]">
              <div
                className="bg-[var(--primary-500)] h-full"
                style={{ width: `${financials.conversionRate}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mt-4 text-[var(--text-secondary-color)]">
            <span>Free Trial accounts: {financials.trialUsers}</span>
            <span className="font-bold text-[var(--primary-500)]">
              {financials.conversionRate}% Conv. Rate
            </span>
          </div>
        </div>

        {/* LTV economics */}
        <div className="admin-card flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary-color)]">
              Estimated Unit Economics (LTV)
            </p>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-extrabold text-[var(--text-color)]">
                {formatDinar(financials.estimatedLTV)}
              </span>
              <span className="text-xs text-[var(--text-secondary-color)]">
                12-Month LTV
              </span>
            </div>
            <p className="text-xs mt-2 leading-relaxed text-[var(--text-secondary-color)]">
              Based on Average Revenue Per User (ARPU) of{" "}
              {formatDinar(financials.estimatedARPU)} / month.
            </p>
          </div>
          <div className="text-xs flex justify-between mt-4 text-[var(--text-secondary-color)]">
            <span>Monthly ARPU: {formatDinar(financials.estimatedARPU)}</span>
            <span className="font-semibold text-[var(--primary-500)]">DZD Metric</span>
          </div>
        </div>
      </div>

      {/* Revenue Projection Area Chart */}
      <div className="grid-2-3">
        <div className="admin-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-color)]">
                6-Month MRR Projections
              </h2>
              <p className="text-xs text-[var(--text-secondary-color)] mt-1">
                Simulating 30% cumulative conversion of {financials.trialUsers}{" "}
                active trial accounts.
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex gap-4 text-xs font-semibold text-[var(--text-color)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--primary-500)]" />
                Projected MRR
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={financials.projectedMRR6Months}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="financialProj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(tick) => `${tick / 1000}k`}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatDinar(value), "Projected MRR"]}
                  contentStyle={{
                    backgroundColor: "var(--background-secondary-color)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-color)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="var(--primary-500)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#financialProj)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plans Distribution Panel */}
        <div className="admin-card flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-color)] mb-2">
              Subscription Share
            </h2>
            <p className="text-xs text-[var(--text-secondary-color)] mb-6">
              Distribution of recruiter billing plans.
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financials.revenueByPlan}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {financials.revenueByPlan.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PLAN_COLORS[entry.plan] || "var(--primary-500)"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} active`,
                      props.payload.plan.toUpperCase(),
                    ]}
                    contentStyle={{
                      backgroundColor: "var(--background-secondary-color)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              {financials.revenueByPlan.map((planData, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs border-b border-[var(--border-color)] pb-1.5"
                >
                  <div className="flex items-center gap-2 font-medium text-[var(--text-color)]">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: PLAN_COLORS[planData.plan] }}
                    />
                    <span className="capitalize">{planData.plan}</span>
                  </div>
                  <span className="font-semibold text-[var(--text-secondary-color)]">
                    {planData.count} accounts
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] text-xs text-center font-medium text-[var(--text-secondary-color)]">
            Standard pricing range: 0 to 50k DZD / month.
          </div>
        </div>
      </div>

      {/* Detailed Revenue Table */}
      <div className="table-container p-6">
        <h2 className="text-lg font-bold text-[var(--text-color)] mb-6">
          Plan-by-Plan Revenue Breakdown
        </h2>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subscription Tier</th>
                <th>Unit Price (Monthly)</th>
                <th>Active Subscribers</th>
                <th>Current MRR</th>
                <th>Projected Annual Revenue</th>
              </tr>
            </thead>
            <tbody>
              {financials.revenueByPlan.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-bold text-[var(--text-color)] capitalize">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: PLAN_COLORS[row.plan] }}
                      />
                      {row.plan}
                    </div>
                  </td>
                  <td className="font-medium text-[var(--text-secondary-color)]">
                    {formatDinar(financials.pricingDZA[row.plan])}
                  </td>
                  <td className="font-semibold text-[var(--text-color)]">
                    {row.count}
                  </td>
                  <td className="font-bold text-[var(--primary-500)]">
                    {formatDinar(row.monthlyRevenue)}
                  </td>
                  <td className="font-bold text-[var(--text-color)]">
                    {formatDinar(row.annualRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTab;
