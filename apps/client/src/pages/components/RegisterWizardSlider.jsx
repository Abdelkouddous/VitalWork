import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiLock,
  FiMapPin,
  FiPhone,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiPlusCircle,
  FiShield,
  FiZap,
} from "react-icons/fi";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";
import customFetch from "../../utils/customFetch";
import { ALGERIAN_WILAYAS } from "../../utils/algeriaWilayas";

const MEDICAL_SPECIALIZATIONS = [
  "General Practitioner", "Cardiologist", "Dermatologist",
  "Gastroenterologist", "Neurologist", "Oncologist", "Psychiatrist",
  "Rheumatologist", "Urologist", "Endocrinologist", "Ophthalmologist",
  "Orthopedic Specialist", "Pediatrician", "Pulmonologist",
  "Surgery Specialist", "Vascular Specialist", "Nurse", "Biologist",
  "Dentist", "Pharmacist", "Pathologist", "Radiologist", "Emergency Specialist"
];

const PRESET_TEMPLATES = {
  clinic: {
    name: "Dr. Mustapha",
    lastName: "Bensalah",
    email: `clinic_test_${Date.now().toString().slice(-4)}@vitalwork.dz`,
    phoneNumber: "555123456",
    location: "Algiers",
    specialization: "Cardiologist",
    hospitalName: "Clinique El Azhar",
    password: "Password123!",
    confirmPassword: "Password123!",
  },
  jobseeker: {
    name: "Dr. Amina",
    lastName: "Bouzid",
    email: `doctor_test_${Date.now().toString().slice(-4)}@vitalwork.dz`,
    phoneNumber: "661987654",
    location: "Oran",
    specialization: "Pediatrician",
    password: "Password123!",
    confirmPassword: "Password123!",
  },
};

const RegisterWizardSlider = ({ initialRole = "clinic" }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(initialRole); // 'clinic' | 'jobseeker'
  const [step, setStep] = useState(1); // 1 = Identity, 2 = Professional & Location, 3 = Security & Finish
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "Algiers",
    specialization: "General Practitioner",
    hospitalName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    let sanitizedVal = value;
    if (field === "phoneNumber") {
      sanitizedVal = value.replace(/\D/g, "").slice(0, 9);
    }
    setForm((prev) => ({ ...prev, [field]: sanitizedVal }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleApplyPreset = (targetRole) => {
    const template = PRESET_TEMPLATES[targetRole];
    setRole(targetRole);
    setForm({
      ...template,
      email: `${targetRole}_${Math.floor(1000 + Math.random() * 9000)}@vitalwork.dz`,
    });
    setErrors({});
    toast.info(`Pre-filled sample profile for ${targetRole === "clinic" ? "Hospital/Clinic" : "Doctor"}`);
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (role === "jobseeker" && !form.phoneNumber) {
      errs.phoneNumber = "Phone number is required";
    } else if (form.phoneNumber && !/^[567]\d{8}$/.test(form.phoneNumber)) {
      errs.phoneNumber = "Phone must start with 5, 6, or 7 followed by 8 digits";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs = {};
    if (!form.location) errs.location = "Location is required";
    if (role === "clinic" && !form.hospitalName.trim()) {
      errs.hospitalName = "Clinic or Hospital Name is required";
    }
    if (role === "jobseeker" && !form.specialization) {
      errs.specialization = "Medical specialization is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs = {};
    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters long";
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (!termsAgreed) {
      errs.terms = "You must agree to the Terms & Privacy Policy";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    try {
      if (role === "clinic") {
        // Clinic registration endpoint
        const payload = {
          name: form.name,
          lastName: form.lastName,
          email: form.email,
          location: form.location,
          hospitalName: form.hospitalName || `${form.name}'s Medical Center`,
          password: form.password,
          confirmPassword: form.confirmPassword,
        };

        const { data } = await customFetch.post("/auth/register", payload);
        const userId = data?.user?.userId;
        const devOtp = data?.devOtp;

        const query = new URLSearchParams({ token: userId || "" });
        if (devOtp) query.set("otp", devOtp);

        toast.success("Clinic registration successful! Please verify your OTP.");
        navigate(`/confirm-account?${query.toString()}`);
      } else {
        // Healthcare Professional registration endpoint
        const payload = {
          name: form.name,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          location: form.location,
          specialization: form.specialization,
          password: form.password,
        };

        const { data } = await customFetch.post("/healthcare-professionals/register", payload);
        const userId = data?.userId || data?.user?._id;
        const devOtp = data?.devOtp;

        let url = `/healthcare-professionals/confirm-account?token=${userId}`;
        if (devOtp) url += `&otp=${devOtp}`;

        toast.success("Professional account registered! Please verify your OTP.");
        navigate(url);
      }
    } catch (error) {
      const msg = error?.response?.data?.msg || error?.response?.data?.message || "Registration failed. Please check your data.";
      setErrors({ server: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div
        className="form max-w-xl w-full mx-auto px-6 py-8 md:p-10 rounded-2xl shadow-xl transition-all duration-300"
        style={{
          background: "var(--surface-primary)",
          borderTop: `4px solid ${role === "clinic" ? "var(--primary-500)" : "#3B82F6"}`,
        }}
      >
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-[var(--primary-500)]"
            style={{ color: "var(--text-secondary-color)" }}
          >
            <FiArrowLeft size={14} /> Back to Home
          </Link>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full font-semibold border border-gray-200 dark:border-gray-700" style={{ color: "var(--text-secondary-color)" }}>
            Step {step} of 3
          </span>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full transition-all duration-400 ease-out rounded-full"
            style={{
              width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
              background: role === "clinic" ? "var(--primary-500)" : "#3B82F6",
            }}
          />
        </div>

        {/* Step Tabs Indicator */}
        <div className="flex items-center justify-between mb-6 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? "text-[var(--primary-500)]" : "text-gray-400"}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">1</span>
            <span>Identity</span>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-2" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? "text-[var(--primary-500)]" : "text-gray-400"}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">2</span>
            <span>Clinical Profile</span>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-2" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? "text-[var(--primary-500)]" : "text-gray-400"}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">3</span>
            <span>Security</span>
          </div>
        </div>

        {/* Role Selector Tabs */}
        {step === 1 && (
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary-color)" }}>
              Select Registration Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setRole("clinic")}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  role === "clinic"
                    ? "bg-white dark:bg-gray-700 text-[var(--text-color)] shadow-sm font-semibold"
                    : "text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
                }`}
              >
                <FiPlusCircle /> Medical Clinic / Hospital
              </button>
              <button
                type="button"
                onClick={() => setRole("jobseeker")}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  role === "jobseeker"
                    ? "bg-white dark:bg-gray-700 text-[var(--text-color)] shadow-sm font-semibold"
                    : "text-[var(--text-secondary-color)] hover:text-[var(--text-color)]"
                }`}
              >
                <FiUser /> Doctor / Healthcare Pro
              </button>
            </div>
          </div>
        )}

        {/* Demo Template Quick-Fill */}
        <div className="mb-6 p-3 rounded-xl border border-dashed border-teal-500/40 bg-teal-500/5 flex items-center justify-between">
          <div className="text-xs">
            <span className="font-semibold text-[var(--primary-500)] block flex items-center gap-1">
              <FiZap className="text-xs" /> Fast-Track Testing
            </span>
            <span className="text-[11px] text-[var(--text-secondary-color)]">Pre-fill realistic medical data</span>
          </div>
          <button
            type="button"
            onClick={() => handleApplyPreset(role)}
            className="text-xs px-3 py-1.5 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200 font-semibold hover:brightness-105"
          >
            ⚡ Auto-Fill Preset
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: "var(--text-color)" }}>
          {role === "clinic" ? "Register Medical Institution" : "Join as Healthcare Professional"}
        </h1>
        <p className="text-xs text-center mb-6" style={{ color: "var(--text-secondary-color)" }}>
          {step === 1 ? "Step 1: Enter personal details" : step === 2 ? "Step 2: Define clinical jurisdiction & role" : "Step 3: Secure your account"}
        </p>

        {errors.server && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2.5 rounded-xl mb-5 text-xs">
            {errors.server}
          </div>
        )}

        {/* WIZARD SLIDER STEPS */}
        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>First Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g. Amina"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.name ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="e.g. Benali"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.lastName ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  />
                  {errors.lastName && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>Professional Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="doctor@hospital.dz"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.email ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>
                  Mobile Phone {role === "clinic" ? "(Optional)" : "(Algerian Format)"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400">+213</span>
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="555123456"
                    className="w-full pl-16 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.phoneNumber ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  />
                </div>
                {errors.phoneNumber && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phoneNumber}</p>}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                  style={{ background: role === "clinic" ? "var(--primary-500)" : "#3B82F6" }}
                >
                  <span>Continue to Clinical Details</span>
                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL & LOCATION */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {role === "clinic" ? (
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>
                    Clinic / Hospital / Institution Name
                  </label>
                  <input
                    type="text"
                    value={form.hospitalName}
                    onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                    placeholder="e.g. Clinique Les Oliviers, CHU Mustapha"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.hospitalName ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  />
                  {errors.hospitalName && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.hospitalName}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>
                    Medical Specialization
                  </label>
                  <select
                    value={form.specialization}
                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.specialization ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  >
                    {MEDICAL_SPECIALIZATIONS.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  {errors.specialization && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.specialization}</p>}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>
                  Wilaya / Location (Algeria)
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <select
                    value={form.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.location ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                {errors.location && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.location}</p>}
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-color)" }}
                >
                  <FiArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                  style={{ background: role === "clinic" ? "var(--primary-500)" : "#3B82F6" }}
                >
                  <span>Continue to Security</span>
                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SECURITY & FINISH */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>
                  Create Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.password ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-color)" }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: errors.confirmPassword ? "var(--red-dark)" : "var(--border-color)", background: "var(--background-secondary-color)", color: "var(--text-color)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.confirmPassword}</p>}
              </div>

              {/* Review Summary Box */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs space-y-1.5">
                <span className="font-semibold block text-[11px] uppercase tracking-wider text-[var(--text-secondary-color)]">
                  Account Registration Summary:
                </span>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary-color)]">Name:</span>
                  <span className="font-semibold text-[var(--text-color)]">{form.name} {form.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary-color)]">Email:</span>
                  <span className="font-semibold text-[var(--text-color)] truncate max-w-[200px]">{form.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary-color)]">Role / Specialty:</span>
                  <span className="font-semibold text-[var(--text-color)]">
                    {role === "clinic" ? (form.hospitalName || "Clinic") : form.specialization}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary-color)]">Wilaya:</span>
                  <span className="font-semibold text-[var(--text-color)]">{form.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="rounded text-[var(--primary-500)]"
                />
                <label htmlFor="terms" className="text-xs" style={{ color: "var(--text-secondary-color)" }}>
                  I agree to the <Link to="/terms" className="text-[var(--primary-500)] hover:underline">Terms</Link> and <Link to="/privacy" className="text-[var(--primary-500)] hover:underline">Privacy Policy</Link>
                </label>
              </div>
              {errors.terms && <p className="text-[11px] text-red-500 font-medium">{errors.terms}</p>}

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-color)" }}
                >
                  <FiArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                  style={{ background: role === "clinic" ? "var(--primary-500)" : "#3B82F6" }}
                >
                  {loading ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <FiCheckCircle size={16} />
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="text-center mt-6 pt-5 border-t" style={{ borderColor: "var(--border-color)" }}>
          <p className="text-xs" style={{ color: "var(--text-secondary-color)" }}>
            Already registered on VitalWork?{" "}
            <Link to="/login" className="font-semibold hover:underline text-[var(--primary-500)]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default RegisterWizardSlider;
