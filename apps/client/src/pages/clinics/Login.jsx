import AuthWizardLogin from "../components/AuthWizardLogin";
import customFetch from "../../utils/customFetch";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (!data.email || !data.password) {
    toast.error("Please provide all values.");
    return { msg: "Please provide all values." };
  }
  if (data.password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return { msg: "Password must be at least 6 characters long" };
  }

  try {
    const response = await customFetch.post("/auth/login", data);
    if (response.status === 200) {
      toast.success("Successfully logged in!");
      return redirect("/dashboard");
    }
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.msg || "An error occurred during login.";
    const userId = error?.response?.data?.userId;
    if (status === 403 && userId) {
      toast.info("Please confirm your email to continue.");
      return redirect(`/confirm-account?token=${userId}`);
    }
    return { msg };
  }
};

const Login = () => {
  return <AuthWizardLogin defaultRole="clinic" />;
};

export default Login;
