import { useState } from "react";
import { X } from "lucide-react"; 
import { useUser } from "../../context/UserContext.jsx";

export default function RegisterUserModal({ data, onClose, onSuccess }) {
  const { createUser } = useUser(); // use context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);

  if (!data) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createUser({
        staffId: data.StaffID,
        username,
        password,
        role,
      });

      onSuccess(); // refresh staff
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-96 relative">

        <button className="absolute top-2 right-2" onClick={onClose}>
          <X />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          Register: {data.FirstName}
        </h3>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full border p-2 mb-4 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </div>
  );
}