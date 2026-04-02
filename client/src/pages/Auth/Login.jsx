// src/pages/Auth/Login.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { success, message } = await login(form);

    if (success) {
      setSuccessMessage("Login successful! Redirecting...");
      setForm({ identifier: "", password: "" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      navigate("/login"); // fallback
      setFormError(message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <input
              id="identifier"
              name="identifier"
              value={form.identifier}
              placeholder="Enter username or email"
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              placeholder="Enter password"
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {(formError || error) && (
          <p className="text-red-600 text-sm mt-3">{formError || error}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm mt-3">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
