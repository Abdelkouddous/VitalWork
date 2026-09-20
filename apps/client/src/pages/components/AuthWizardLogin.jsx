import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiShield, FiPlusCircle, FiUserCheck, FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiArrowLeft, FiZap } from "react-icons/fi";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";
import customFetch from "../../utils/customFetch";
import DemoAccountsSection from "./DemoAccountsSection";

const ROLE_CONFIGS = {
  clinic: {
    title: "Clinic & Hospital Portal",
    subtitle: "Sign in to manage clinical vacancies and recruit medical talent",
    icon: <FiPlusCircle className="text-xl" />,
    themeColor: "var(--primary-500)",
    endpoint: "/auth/login",
    destination: "/dashboard",
    confirmPath: "/confirm-account",
    demoEmail: "clinic@vitalwork.dz",
    fallbackEmail: "employer1@vitalwork.dz",
    demoPassword: "password123",
    registerLink: "/register?role=employer",
    forgotPasswordLink: "/forgot-password",
  },
  jobseeker: {
    title: "Healthcare Professional",
    subtitle: "Sign in to access verified hospital positions across Algeria",
    icon: <FiUserCheck className="text-xl" />,
    themeColor: "#3B82F6",
    endpoint: "/healthcare-professionals/login",
    destination: "/healthcare-professionals/dashboard",
    confirmPath: "/healthcare-professionals/confirm-account",
    demoEmail: "doctor@vitalwork.dz",
    fallbackEmail: "seeker1@vitalwork.dz",
    demoPassword: "password123",
    registerLink: "/healthcare-professionals/register",
    forgotPasswordLink: "/healthcare-professionals/forgot-password",
  },
  admin: {
    title: "CEO & Platform Command",
    subtitle: "High-security administrative access to system analytics and moderation",
    icon: <FiShield className="text-xl" />,
    themeColor: "#8B5CF6",
    endpoint: "/admin/login",
    destination: "/dashboard/admin",
    confirmPath: "/confirm-account",
    demoEmail: "abdelkouddoushamel@vitalwork.dz",
    fallbackEmail: "admin@vitalwork.dz",
    demoPassword: "password123",
    registerLink: null,
    forgotPasswordLink: "/forgot-password",
  },
};

const AuthWizardLogin = ({ defaultRole = "clinic" }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine initial role from props or query param
  const paramRole = searchParams.get("role");
  const initialRole = (paramRole && ROLE_CONFIGS[paramRole]) ? paramRole : defaultRole;

  const [activeRole, setActiveRole] = useState(initialRole);
  const [step, setStep] = useState(1); // 1 = Role & Email, 2 = Password & Submit
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const currentRole = ROLE_CONFIGS[activeRole];

  // Auto-fill handling from URL parameters
  useEffect(() => {
    const urlEmail = searchParams.get("email");
    const shouldAutofill = searchParams.get("autofill") === "1" || searchParams.get("autofill") === "true";

    if (urlEmail) {
      setForm((prev) => ({
        ...prev,
        email: urlEmail,
        password: shouldAutofill ? currentRole.demoPassword : prev.password,
      }));
      if (shouldAutofill) {
        setStep(2);
      }
    }
  }, [searchParams, currentRole.demoPassword]);

  // When switching role tab
  const handleRoleChange = (roleKey) => {
    setActiveRole(roleKey);
    setErrors({});
  };

  const handleApplyTemplate = (roleKey) => {
    const roleCfg = ROLE_CONFIGS[roleKey];
    setActiveRole(roleKey);
    setForm({
      email: roleCfg.demoEmail,
      password: roleCfg.demoPassword,
    });
    setErrors({});
    setStep(2);
    toast.info(`Filled demo credentials for ${roleCfg.title}`);
  };

  const handleEmailNext = (e) => {
    e.preventDefault();
    if (!form.email || !form.email.trim()) {
      setErrors({ email: "Please enter your email address" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.password) {
      setErrors({ password: "Password is required" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let res;
      try {
        res = await customFetch.post(currentRole.endpoint, form);
      } catch (primaryErr) {
        // If demo user and primary failed, retry with fallback test email
        if (form.email === currentRole.demoEmail && currentRole.fallbackEmail) {
          res = await customFetch.post(currentRole.endpoint, {
            email: currentRole.fallbackEmail,
            password: form.password,
          });
        } else {
          throw primaryErr;
        }
      }

      if (res && (res.status === 200 || res.status === 201)) {
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
        }
        if (res.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        navigate(currentRole.destination);
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.msg || err?.response?.data?.message || "Authentication failed. Please verify your credentials.";
      const userId = err?.response?.data?.userId;

      // Handle unconfirmed email redirection
      if (status === 403 && userId) {
        navigate(`${currentRole.confirmPath}?token=${userId}`);
        return;
      }

      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="form max-w-lg w-full mx-auto px-6 py-8 md:p-10 rounded-2xl shadow-xl transition-all duration-300" style={{ background: "var(--surface-primary)", borderTop: `4px solid ${currentRole.themeColor}` }}>
        {/* Top Header & Home Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 hover:text-[var(--primary-500)]"
            style={{ color: "var(--text-secondary-color)" }}
          >
            <FiArrowLeft size={14} /> Back to Home
          </Link>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full font-semibold border border-gray-200 dark:border-gray-700" style={{ color: "var(--text-secondary-color)" }}>
            Step {step} of 2
          </span>
        </div>

        {/* Wizard Progress Slider Bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full transition-all duration-400 ease-out rounded-full"
            style={{
              width: step === 1 ? "50%" : "100%",
              background: currentRole.themeColor,
            }}
          />
        </div>

        {/* Role Slider Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary-color)" }}>
            Select Account Role
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
            {[
              { id: "clinic", label: "Clinic", icon: <FiPlusCircle /> },
              { id: "jobseeker", label: "Doctor/Seeker", icon: <FiUserCheck /> },
              { id: "admin", label: "CEO Admin", icon: <FiShield /> },
            ].map((tab) => {
              const isSelected = activeRole === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleRoleChange(tab.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-white dark:bg-gray-700 text-[var(--text-color)] shadow-sm font-semibold scale-[1.02]"
                      : "text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
                  }`}
                >
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Demo Template Fillers */}
        <div className="mb-6 p-3 rounded-xl border border-dashed border-teal-500/40 bg-teal-500/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 text-[var(--primary-500)]">
              <FiZap className="text-xs" /> Instant Demo Account Fill:
            </span>
            <span className="text-[10px] text-[var(--text-secondary-color)]">1-Click Test</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApplyTemplate("clinic")}
              className="text-xs px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200 font-medium hover:brightness-105 transition-all"
            >
              🏥 Demo Clinic
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate("jobseeker")}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 font-medium hover:brightness-105 transition-all"
            >
              🩺 Demo Doctor
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate("admin")}
              className="text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 font-medium hover:brightness-105 transition-all"
            >
              👑 Demo Admin
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 text-white shadow-sm"
            style={{ background: currentRole.themeColor }}
          >
            {currentRole.icon}
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-color)" }}>
            {currentRole.title}
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary-color)" }}>
            {currentRole.subtitle}
          </p>
        </div>

        {errors.server && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2.5 rounded-xl mb-5 text-xs">
            {errors.server}
          </div>
        )}

        {/* SLIDING WIZARD CONTAINER */}
        <div className="relative overflow-hidden">
          {/* STEP 1: Email & Identity */}
          {step === 1 && (
            <form onSubmit={handleEmailNext} className="space-y-4 animate-fadeIn">
              <div>
                <label htmlFor="wizard-email" className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>
                  Account Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    id="wizard-email"
                    type="email"
                    name="email"
                    placeholder={`e.g. ${currentRole.demoEmail}`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                    style={{
                      borderColor: errors.email ? "var(--red-dark)" : "var(--border-color)",
                      background: "var(--background-secondary-color)",
                      color: "var(--text-color)",
                    }}
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                style={{ background: currentRole.themeColor }}
              >
                <span>Continue to Password</span>
                <FiArrowRight size={16} />
              </button>
            </form>
          )}

          {/* STEP 2: Password & Credentials */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
              {/* Account Selected Chip */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs">
                <div className="truncate pr-2">
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Signing in as</span>
                  <span className="font-semibold text-[var(--text-color)] truncate">{form.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold hover:underline text-[var(--primary-500)] whitespace-nowrap"
                >
                  Change
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="wizard-password" className="block text-xs font-semibold" style={{ color: "var(--text-color)" }}>
                    Security Password
                  </label>
                  {currentRole.forgotPasswordLink && (
                    <Link
                      to={currentRole.forgotPasswordLink}
                      className="text-[11px] font-medium text-[var(--primary-500)] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    id="wizard-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter account password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                    style={{
                      borderColor: errors.password ? "var(--red-dark)" : "var(--border-color)",
                      background: "var(--background-secondary-color)",
                      color: "var(--text-color)",
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-color)" }}
                >
                  <FiArrowLeft size={16} /> Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                  style={{ background: currentRole.themeColor }}
                >
                  {loading ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Enter {currentRole.title.split(" ")[0]}</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer / Registration Link */}
        {currentRole.registerLink && (
          <div className="text-center mt-6 pt-5 border-t" style={{ borderColor: "var(--border-color)" }}>
            <p className="text-xs" style={{ color: "var(--text-secondary-color)" }}>
              Don&apos;t have an account yet?{" "}
              <Link to={currentRole.registerLink} className="font-semibold hover:underline" style={{ color: currentRole.themeColor }}>
                Register here
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Test Accounts Sandbox Selector */}
      <div className="w-full max-w-5xl mx-auto mt-10">
        <DemoAccountsSection
          onSelectAccount={(acc) => {
            setActiveRole(acc.roleId);
            setForm({
              email: acc.email,
              password: acc.password,
            });
            setStep(2);
            toast.info(`Loaded ${acc.roleName} test credentials`);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </Wrapper>
  );
};

export default AuthWizardLogin;
