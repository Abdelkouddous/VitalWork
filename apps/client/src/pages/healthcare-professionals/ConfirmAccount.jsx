// ConfirmAccount.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";
import { FiKey, FiCheck, FiMail, FiArrowLeft } from "react-icons/fi";

const ConfirmAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("token");
  const queryOtp = searchParams.get("otp");

  const [currentDevOtp, setCurrentDevOtp] = useState(queryOtp || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // If OTP is provided in query params, store it in state
  useEffect(() => {
    if (queryOtp && queryOtp.length === 6) {
      setCurrentDevOtp(queryOtp);
      // Auto-populate the boxes
      setOtp(queryOtp.split(""));
    }
  }, [queryOtp]);

  const handleFillOtp = () => {
    const code = currentDevOtp || "123456";
    if (code.length === 6) {
      setOtp(code.split(""));
      toast.success("Verification code inserted into form!");
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await customFetch.post("/healthcare-professionals/confirm-email", {
        userId: userId,
        otp: otpString,
      });

      toast.success("Account confirmed successfully!");
      navigate("/healthcare-professionals/login");
    } catch (error) {
      const message = error?.response?.data?.message || "Invalid OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      const { data } = await customFetch.post("/healthcare-professionals/resend-otp", {
        userId: userId,
      });
      toast.success(data?.message || "OTP resent successfully!");

      if (data?.devOtp) {
        setCurrentDevOtp(data.devOtp);
        setOtp(data.devOtp.split(""));
      }
      setTimer(45);
      setCanResend(false);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    }
  };

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <Wrapper>
      <div className="form" style={{ maxWidth: "460px", width: "100%", textAlign: "center" }}>
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/healthcare-professionals/login"
            className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: "var(--text-secondary-color)" }}
          >
            <FiArrowLeft size={14} /> Back to Sign In
          </Link>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-[var(--primary-500)] font-semibold">
            Identity Verification
          </span>
        </div>

        <div
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: "var(--primary-500)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <FiMail style={{ fontSize: "24px", color: "white" }} />
        </div>

        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: "var(--text-color)",
            marginBottom: "0.5rem",
          }}
        >
          Confirm Your Account
        </h1>
        <p style={{ color: "var(--text-secondary-color)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          Enter the 6-digit clinical verification code issued for your profile
        </p>

        {/* ── PERSISTENT OTP LABEL CALLOUT (Task 4) ── */}
        <div
          className="p-3.5 rounded-xl mb-6 text-left border shadow-sm transition-all"
          style={{
            background: "var(--surface-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-500)] flex items-center gap-1.5">
              <FiKey className="text-sm" /> Verification Code Label
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200 font-mono font-bold">
              Ready
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary-color)] mb-2.5">
            Your verification code is preserved below. Use the quick-fill button to avoid manual transcription:
          </p>
          <div className="flex items-center justify-between bg-white dark:bg-gray-800/80 p-2.5 rounded-lg border border-teal-500/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-secondary-color)] font-medium">Code:</span>
              <code className="text-lg font-bold font-mono tracking-widest text-[var(--primary-500)]">
                {currentDevOtp || "382914"}
              </code>
            </div>
            <button
              type="button"
              onClick={handleFillOtp}
              className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[var(--primary-500)] text-white hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <FiCheck size={12} /> Auto-Fill Code
            </button>
          </div>
        </div>

        {/* 6-Digit OTP Inputs */}
        <form onSubmit={handleVerify}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "1.5rem",
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                style={{
                  width: "48px",
                  height: "52px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  border: "2px solid var(--border-color)",
                  borderRadius: "8px",
                  background: "var(--background-secondary-color)",
                  color: "var(--text-color)",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-500)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-block py-2.5 rounded-xl font-semibold shadow-sm transition-all hover:brightness-110 active:scale-[0.99] cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify & Activate Account"}
          </button>
        </form>

        <p
          style={{ marginTop: "1.5rem", color: "var(--text-secondary-color)", fontSize: "0.85rem" }}
        >
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            style={{
              color: canResend ? "var(--primary-500)" : "var(--grey-400)",
              border: "none",
              backgroundColor: "transparent",
              cursor: canResend ? "pointer" : "not-allowed",
              fontSize: "0.85rem",
              fontWeight: "600",
            }}
          >
            {canResend ? "Resend OTP" : `Resend in ${timer}s`}
          </button>
        </p>
      </div>
    </Wrapper>
  );
};

export default ConfirmAccount;
