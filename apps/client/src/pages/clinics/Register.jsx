import { redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import RegisterWizardSlider from "../components/RegisterWizardSlider";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const { data: res } = await customFetch.post("/auth/register", data);
    const userId = res?.user?.userId;
    const devOtp = res?.devOtp;
    const query = new URLSearchParams({ token: userId || "" });
    if (devOtp) query.set("otp", devOtp);
    return redirect(`/confirm-account?${query.toString()}`);
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Registration failed");
    return error;
  }
};

const Register = () => {
  return <RegisterWizardSlider initialRole="clinic" />;
};

export default Register;
