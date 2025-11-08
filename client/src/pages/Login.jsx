// src/pages/Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { AuthContext } from "../context/Authcontext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);

      toast.success("✅ Logged in successfully!");

      // redirect based on role
      if (res.data.user.role === "instructor") {
        navigate("/create-course");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Login failed";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen p-4 bg-linear-to-br from-indigo-200 via-white to-blue-200">
      <div
        className="w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-lg 
                    rounded-2xl shadow-xl p-6 sm:p-8 
                    transform transition-all duration-300 
                    hover:scale-[1.02] hover:shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Log in to continue to your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Error message */}
          {formError && (
            <p className="text-sm text-center text-red-500">{formError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-black transition-transform transform bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-white hover:text-indigo-600 hover:scale-105 disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to Signup */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
