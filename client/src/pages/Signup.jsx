// src/pages/Signup.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { AuthContext } from "../context/Authcontext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const initialRole =
    searchParams.get("role") === "instructor" ? "instructor" : "student";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, role: initialRole }));
  }, [initialRole]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleRole = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", form);
      login(res.data.token, res.data.user);

      toast.success("✅ Account created successfully!");

      // Redirect by role
      if (form.role === "instructor") {
        navigate("/create-course");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Signup failed";
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
          Learning Management System
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Create your account to get started.
        </p>

        {/* Role selection */}
        <div className="mt-5 text-center">
          <p className="mb-2 text-sm text-gray-600">
            Signing up as:{" "}
            <strong className="text-indigo-700 capitalize">{form.role}</strong>
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => toggleRole("student")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                form.role === "student"
                  ? "bg-indigo-600 text-white"
                  : "border border-indigo-300 text-gray-700 hover:bg-indigo-100"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => toggleRole("instructor")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                form.role === "instructor"
                  ? "bg-green-600 text-white"
                  : "border border-green-300 text-gray-700 hover:bg-green-100"
              }`}
            >
              Instructor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
                className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Error */}
          {formError && (
            <p className="text-sm text-center text-red-500">{formError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-black transition-transform transform bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-white hover:text-indigo-600 hover:scale-105 disabled:opacity-60"
          >
            <ArrowRight size={18} />
            {loading
              ? "Creating..."
              : `Create ${form.role.charAt(0).toUpperCase() + form.role.slice(1)} Account`}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>

        <p className="mt-4 text-xs text-center text-gray-400">
          <UserCheck size={14} className="inline-block mr-1" />
          Instructor accounts may require verification.
        </p>
      </div>
    </div>
  );
}
