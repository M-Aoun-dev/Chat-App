import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;
      const { data } = await axios.post(endpoint, payload);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon"></div>
          <h1>ChatSphere</h1>
          <p>{isLogin ? "Welcome back!" : "Create your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" placeholder="Choose a username"
                value={form.username} onChange={handleChange} required />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password"
              value={form.password} onChange={handleChange} required />
          </div>

          {error && <div className="error-msg"> {error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;