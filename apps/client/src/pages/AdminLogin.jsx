import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please provide all values");
      return;
    }

    try {
      setLoading(true);
      const res = await customFetch.post("/admin/login", form);
      if (res.status === 200) {
        toast.success("Admin login successful!");
        navigate("/dashboard/admin");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Invalid admin credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="form max-w-md w-full mx-auto px-8 py-10 rounded-xl">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white shadow-lg">
            <FiShield size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">CEO Portal</h1>
        <p className="text-center text-sm mb-8 text-gray-500">Secure access for platform administrators</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="admin@vitalwork.dz"
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary-500"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary-500 pr-12"
                value={form.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg mt-6"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login to CEO Dashboard"}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default AdminLogin;
