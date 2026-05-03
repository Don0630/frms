import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate(form, {
      onSuccess: (data) => {
        setSuccessMessage("Login successful! Redirecting...");
        setForm({ identifier: "", password: "" });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      },

      onError: (err) => {
        setFormError(err.message || "Login failed");
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder="Username or Email"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`w-full py-2 rounded-lg text-white ${
              loginMutation.isPending
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

        </form>

        {formError && (
          <p className="text-red-600 text-sm mt-3">{formError}</p>
        )}

        {successMessage && (
          <p className="text-green-600 text-sm mt-3">{successMessage}</p>
        )}

      </div>
    </div>
  );
}