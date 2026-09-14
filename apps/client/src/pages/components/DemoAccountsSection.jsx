import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiPlusCircle, FiUserCheck, FiArrowRight, FiCheck, FiCopy, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import Wrapper from "../../assets/wrappers/DemoAccountsWrapper";

const DEMO_ACCOUNTS = [
  {
    roleId: "admin",
    roleName: "CEO / Platform Admin",
    badge: "Full System Authority",
    roleClass: "admin",
    icon: <FiShield />,
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
    roleClass: "clinic",
    icon: <FiPlusCircle />,
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
    roleClass: "jobseeker",
    icon: <FiUserCheck />,
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
    <Wrapper>
      <div className="inner-container">
        <div className="section-header">
          <div className="sandbox-badge">
            <FiZap />
            Evaluation Sandbox
          </div>
          <h2 className="section-title">
            Test Drive VitalWork with Demo Accounts
          </h2>
          <p className="section-desc">
            Explore every dimension of our specialized healthcare recruitment platform. Select an account template below to auto-fill credentials and test role-specific features immediately.
          </p>
        </div>

        <div className="cards-grid">
          {DEMO_ACCOUNTS.map((account) => {
            const isLoading = loadingRole === account.roleId;

            return (
              <div key={account.roleId} className="demo-card">
                {/* Role Header */}
                <div className="card-top">
                  <div className={`role-icon-box ${account.roleClass}`}>
                    {account.icon}
                  </div>
                  <span className={`role-badge ${account.roleClass}`}>
                    {account.badge}
                  </span>
                </div>

                <h3 className="role-title">
                  {account.roleName}
                </h3>
                <p className="role-desc">
                  {account.description}
                </p>

                {/* Credentials Box */}
                <div className="credentials-box">
                  <div className="cred-row">
                    <span className="cred-label">Email:</span>
                    <div className="cred-value-wrap">
                      <span title={account.email}>{account.email}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(account.email, `${account.roleId}-email`)}
                        className="copy-btn"
                        title="Copy email"
                      >
                        {copiedField === `${account.roleId}-email` ? <FiCheck /> : <FiCopy />}
                      </button>
                    </div>
                  </div>

                  <div className="cred-row divider">
                    <span className="cred-label">Password:</span>
                    <div className="cred-value-wrap">
                      <span>{account.password}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(account.password, `${account.roleId}-pwd`)}
                        className="copy-btn"
                        title="Copy password"
                      >
                        {copiedField === `${account.roleId}-pwd` ? <FiCheck /> : <FiCopy />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="features-wrap">
                  <span className="features-heading">
                    Key Capabilities:
                  </span>
                  <ul className="features-list">
                    {account.features.map((feat) => (
                      <li key={feat} className="feature-item">
                        <span className="dot" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="actions-box">
                  <button
                    type="button"
                    onClick={() => handleInstantLogin(account)}
                    disabled={isLoading}
                    className="btn-autologin"
                  >
                    {isLoading ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <FiZap />
                        Auto-Fill & Sign In
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInWizard(account)}
                    className="btn-wizard"
                  >
                    <span>Inspect in Login Wizard</span>
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};

export default DemoAccountsSection;
