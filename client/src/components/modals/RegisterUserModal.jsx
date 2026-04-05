import { useState, useEffect } from "react";
import { X } from "lucide-react"; 
import { useUser } from "../../context/UserContext.jsx";

export default function RegisterUserModal({ data, onClose, onSuccess }) {
  const { createUser } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Reset all fields when modal opens or closes
  useEffect(() => {
    if (data) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setRole("Admin");
      setError("");
      setLoading(false);
    }
  }, [data]);

  if (!data) return null;

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRole("Admin");
    setError("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    setError("");

    if (!username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await createUser({
        staffId: data.StaffID,
        username,
        password,
        role,
      });

      onSuccess(); // refresh staff
      handleClose(); // reset fields after success
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative shadow-lg">

        {/* Close */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={handleClose}
        >
          <X />
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-4">
          Register: {data.FirstName} {data.LastName}
        </h3>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Role */}
        <select
          className="w-full border p-2 mb-4 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
        </select>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading} // only disable during API call
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </div>
  );
}