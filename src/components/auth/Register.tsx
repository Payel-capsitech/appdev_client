import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

// Zod validation schema with role
const registerSchema = z.object({
  email: z.string().min(1, "The Email field is required.").email("Invalid email format."),
  password: z.string().min(1, "The Password field is required."),
  role: z.enum(["admin", "manager", "staff", "user"]),
});

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<{ email?: string; password?: string; confirmPassword?: string; role?: string }>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using zod schema
    const result = registerSchema.safeParse({ email, password, role });

    const fieldErrors: { email?: string; password?: string; confirmPassword?: string; role?: string } = {};

    if (!result.success) {
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
      });
    }

    // Manual confirm password validation
    if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match.";
    }

    setError(fieldErrors);

    if (Object.keys(fieldErrors).length === 0) {
      console.log("Registration submitted", { email, password, role });

      // Save user data to localStorage (temporary storage)
      localStorage.setItem("user", JSON.stringify({ email, role }));

      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("");

      // Navigate to login page
      navigate("/login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <div className="text-center mb-3">
          <img src="/actingoffice-logo.jpg" alt="abc" height="50" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && <div className="text-danger">{error.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && <div className="text-danger">{error.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error.confirmPassword && <div className="text-danger">{error.confirmPassword}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="user">User</option>
            </select>
            {error.role && <div className="text-danger">{error.role}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <div className="mt-3 text-center">
          <span>Already have an account? <Link to="/login">Login here</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Register;
