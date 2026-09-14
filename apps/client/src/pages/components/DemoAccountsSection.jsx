import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiPlusCircle, FiUserCheck, FiArrowRight, FiCheck, FiCopy, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

const DEMO_ACCOUNTS = [
  {
    roleId: "admin",
    roleName: "CEO / Platform Admin",
    badge: "Full System Authority",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    icon: <FiShield className="text-2xl text-purple-600 dark:text-purple-400" />,
    description: "Access high-level clinical metrics, user administration, financial telemetry, and security moderation.",
    email: "abdelkouddoushamel@vitalwork.dz",
    fallbackEmail: "admin@vitalwork.dz",
    password: "password123",
    loginEndpoint: "/admin/login",
    destinationPath: "/dashboard/admin",
    wizardLoginPath: "/admin/login",
    features: ["Real-time KPI Engine", "Recruiter Verification", "Financial MRR Projections", "System Audit Logs"],
  },
  {
    roleId: "clinic",
    roleName: "Medical Clinic / Hospital",
    badge: "Verified Healthcare Employer",
    badgeColor: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
    icon: <FiPlusCircle className="text-2xl text-teal-600 dark:text-teal-400" />,
    description: "Post specialized vacancies (Cardiology, ICU, Surgery), evaluate candidate resumes, and schedule clinical interviews.",
    email: "clinic@vitalwork.dz",
    fallbackEmail: "employer1@vitalwork.dz",
    password: "password123",
    loginEndpoint: "/auth/login",
    destinationPath: "/dashboard",
    wizardLoginPath: "/login",
    features: ["Post Medical Vacancies", "Clinical Resume Pipeline", "Interview Scheduling", "Clinic Profile Management"],
  },
  {
    roleId: "jobseeker",
    roleName: "Healthcare Professional",
    badge: "Licensed Medical Practitioner",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    icon: <FiUserCheck className="text-2xl text-blue-600 dark:text-blue-400" />,
    description: "Browse verified hospital positions across all 58 Wilayas, track applications, and manage medical CV credentials.",
    email: "doctor@vitalwork.dz",
    fallbackEmail: "seeker1@vitalwork.dz",
    password: "password123",
    loginEndpoint: "/healthcare-professionals/login",
    destinationPath: "/healthcare-professionals/dashboard",
    wizardLoginPath: "/healthcare-professionals/login",
    features: ["58 Wilayas Job Search", "Application Tracker", "Medical CV Builder", "Direct Messaging with Clinics"],
  },
];

const DemoAccountsSection = () => {
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldKey) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    toast.info(`Copied ${text} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInstantLogin = async (account) => {
    setLoadingRole(account.roleId);
    try {
      // Try primary email first
      let res;
      try {
        res = await customFetch.post(account.loginEndpoint, {
          email: account.email,
          password: account.password,
        });
      } catch (primaryErr) {
        // If primary fails with 401/404, retry with fallback test email
        if (account.fallbackEmail) {
          res = await customFetch.post(account.loginEndpoint, {
            email: account.fallbackEmail,
            password: account.password,
          });
        } else {
          throw primaryErr;
        }
      }

      if (res && (res.status === 200 || res.status === 201)) {
        toast.success(`Welcome to the ${account.roleName} demonstration!`);
        navigate(account.destinationPath);
      }
    } catch (err) {
      console.warn("Direct API demo login error, redirecting with prefilled params:", err);
      // Seamless fallback: navigate to the wizard login page with query params
      navigate(`${account.wizardLoginPath}?email=${encodeURIComponent(account.email)}&autofill=1`);
    } finally {
      setLoadingRole(null);
    }
  };

  const handleOpenInWizard = (account) => {
    navigate(`${account.wizardLoginPath}?email=${encodeURIComponent(account.email)}&autofill=1`);
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: "var(--background-secondary-color)" }}>
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border border-teal-500/30 bg-teal-500/10 text-[var(--primary-500)]">
            <FiZap className="text-sm" />
            Evaluation Sandbox
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--text-color)" }}>
            Test Drive VitalWork with Demo Accounts
          </h2>
          <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: "var(--text-secondary-color)" }}>
            Explore every dimension of our specialized healthcare recruitment platform. Select an account template below to auto-fill credentials and test role-specific features immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_ACCOUNTS.map((account) => {
            const isLoading = loadingRole === account.roleId;

            return (
              <div
                key={account.roleId}
                className="flex flex-col rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
                style={{
                  background: "var(--surface-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {/* Role Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
                    {account.icon}
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${account.badgeColor}`}>
                    {account.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
                  {account.roleName}
                </h3>
                <p className="text-xs leading-relaxed mb-5" style={{ color: "var(--text-secondary-color)" }}>
                  {account.description}
                </p>

                {/* Credentials Box */}
                <div
                  className="rounded-xl p-3.5 mb-5 space-y-2 border text-xs"
                  style={{
                    background: "var(--background-secondary-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary-color)] font-medium">Email:</span>
                    <div className="flex items-center gap-1.5 font-mono text-[var(--text-color)] font-semibold truncate max-w-[180px]">
                      <span className="truncate" title={account.email}>{account.email}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(account.email, `${account.roleId}-email`)}
                        className="text-gray-400 hover:text-[var(--primary-500)] p-1 rounded"
                        title="Copy email"
                      >
                        {copiedField === `${account.roleId}-email` ? <FiCheck className="text-green-500" /> : <FiCopy />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: "var(--border-color)" }}>
                    <span className="text-[var(--text-secondary-color)] font-medium">Password:</span>
                    <div className="flex items-center gap-1.5 font-mono text-[var(--text-color)] font-semibold">
                      <span>{account.password}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(account.password, `${account.roleId}-pwd`)}
                        className="text-gray-400 hover:text-[var(--primary-500)] p-1 rounded"
                        title="Copy password"
                      >
                        {copiedField === `${account.roleId}-pwd` ? <FiCheck className="text-green-500" /> : <FiCopy />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="mb-6 flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary-color)" }}>
                    Key Capabilities:
                  </span>
                  <ul className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary-color)" }}>
                    {account.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-500)]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
                  <button
                    type="button"
                    onClick={() => handleInstantLogin(account)}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                    style={{ background: "var(--primary-500)" }}
                  >
                    {isLoading ? (
                      <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <FiZap className="text-sm" />
                        Auto-Fill & Sign In
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInWizard(account)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{ color: "var(--text-secondary-color)" }}
                  >
                    <span>Inspect in Login Wizard</span>
                    <FiArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DemoAccountsSection;
