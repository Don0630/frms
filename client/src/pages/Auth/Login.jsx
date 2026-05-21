import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";
import bgImage from "../../assets/images/bg-login.jpeg";

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
    onSuccess: () => {
      setSuccessMessage("Login successful! Redirecting...");
      setForm({ identifier: "", password: "" });
      setTimeout(() => navigate("/dashboard"), 1000);
    },

    onError: (err) => {
      const message = err?.response?.data?.message || err.message || "Login failed.";
      setFormError(message);
    },
  });
};

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4
      bg-cover bg-center"
      style={{
        backgroundImage:
          `url(${bgImage})`,
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative w-full max-w-md bg-white shadow-xl p-6">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="App Logo" className="w-28 h-28 object-contain" />
        </div>

        {/* TITLE */}
        <h2 className="text-sm font-bold text-center mb-6 text-gray-800">
          LOGIN TO YOUR ACCOUNT
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* USERNAME / EMAIL */}
          <input
            disabled={loginMutation.isPending}
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder="Username or Email"
            className="w-full px-3 py-2 border rounded-lg
            bg-white text-gray-900
            border-gray-300
            focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          {/* PASSWORD */}
          <input
            disabled={loginMutation.isPending}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-lg
            bg-white text-gray-900
            border-gray-300
            focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`w-full py-2 rounded-lg text-white transition
              ${
                loginMutation.isPending
                  ? "bg-green-400"
                  : "bg-green-700 hover:bg-green-700"
              }`}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          {/* MESSAGES */}
        {/* MESSAGES - reserve fixed height so form doesn't resize */}
<div className="h-5 mt-1">
  {formError && (
    <p className="text-red-500 text-sm">{formError}</p>
  )}
  {successMessage && (
    <p className="text-green-500 text-sm">{successMessage}</p>
  )}
</div>


          {/* DIVIDER */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* LINK */}
          <div className="text-center">
            <a
              href="https://finder-rsbsa.da.gov.ph"
              className="text-sm text-green-600 hover:underline"
            >
              RSBSA Finder
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}