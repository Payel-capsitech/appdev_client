import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

// login validation schema
const loginSchema = z.object({
  email: z.string().min(1, "The Email field is required.").email("Invalid email format."),
  password: z.string().min(1, "The Password field is required."),
});

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data using zod
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setError(fieldErrors);
      return;
    }

    // If there is no errors then clear error state
    setError({});

    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || user.email !== email) {
      setError({ email: "User not found or invalid email." });
      return;
    }

    localStorage.setItem("authToken","abc");

    // Redirect based on role
    if (user.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user.role === "manager") {
      navigate("/manager-dashboard");
    } else if (user.role === "staff") {
      navigate("/staff-dashboard");
    } else {
      navigate("/user-dashboard");
    }

    // Optionally clear form fields
    setEmail("");
    setPassword("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <div className="text-center mb-3">
          <img src="/actingoffice-logo.jpg" alt="abc" height="50" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
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

          <button type="submit" className="btn btn-primary w-100">
            Log in
          </button>
        </form>

        <div className="mt-3 text-center">
          <span>Don't registered yet? <Link to="/register">Register here</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
