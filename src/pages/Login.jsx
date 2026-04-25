import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf4ff 0%, #f0f9ff 50%, #fff7ed 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "18px",
            background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", margin: "0 auto 12px",
            boxShadow: "0 8px 24px rgba(139,92,246,0.35)"
          }}>⚕️</div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1e1b4b", margin: 0 }}>
            Medi<span style={{ color: "#8b5cf6" }}>Care</span> Pro
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>Your personal health companion</p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: "24px", padding: "32px",
          boxShadow: "0 8px 40px rgba(139,92,246,0.12)",
          border: "1px solid rgba(139,92,246,0.1)"
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e1b4b", margin: "0 0 6px" }}>Welcome back 👋</h2>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 24px" }}>Login to your account</p>

          {/* Demo credentials hint */}
          <div style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(6,182,212,0.04))",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "12px", padding: "12px 14px", marginBottom: "20px", fontSize: "12px", color: "#6b7280"
          }}>
            <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#8b5cf6" }}>🔐 Demo Credentials</p>
            <p style={{ margin: "2px 0" }}>📧 ayesha@gmail.com · 🔑 123456</p>
            <p style={{ margin: "2px 0" }}>📧 ali@gmail.com · 🔑 doctor123</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Email Address</label>
              <input
                type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "12px",
                  border: `1.5px solid ${error && !form.email ? "#f43f5e" : "#e5e7eb"}`,
                  fontSize: "14px", outline: "none", boxSizing: "border-box",
                  transition: "border 0.2s", background: "#fafafa", color: "#1e1b4b"
                }}
                onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "12px 44px 12px 14px", borderRadius: "12px",
                    border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none",
                    boxSizing: "border-box", background: "#fafafa", color: "#1e1b4b"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#fff1f2", border: "1px solid #fecdd3",
                borderRadius: "10px", padding: "10px 14px",
                color: "#f43f5e", fontSize: "13px", marginBottom: "16px",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#c4b5fd" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color: "#fff", border: "none", borderRadius: "12px",
                fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(139,92,246,0.35)",
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 50 50" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="80" strokeDashoffset="60" strokeLinecap="round" />
                  </svg>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Logging in...
                </>
              ) : "Login →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#9ca3af" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#8b5cf6", fontWeight: "700", textDecoration: "none" }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}