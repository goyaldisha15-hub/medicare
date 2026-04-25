import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return setError("All fields are required");
    }
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setError("Passwords do not match");

    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "12px",
    border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none",
    boxSizing: "border-box", background: "#fafafa", color: "#1e1b4b",
    transition: "border 0.2s"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf4ff 0%, #f0f9ff 50%, #fff7ed 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px",
            background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px", margin: "0 auto 10px",
            boxShadow: "0 8px 24px rgba(139,92,246,0.3)"
          }}>⚕️</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e1b4b", margin: 0 }}>
            Medi<span style={{ color: "#8b5cf6" }}>Care</span> Pro
          </h1>
        </div>

        <div style={{
          background: "#fff", borderRadius: "24px", padding: "32px",
          boxShadow: "0 8px 40px rgba(139,92,246,0.12)",
          border: "1px solid rgba(139,92,246,0.1)"
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e1b4b", margin: "0 0 6px" }}>Create Account 🎉</h2>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 24px" }}>Join MediCare Pro today</p>

          <form onSubmit={handleSubmit}>
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "Ayesha Khan" },
              { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Min. 6 characters" },
              { label: "Confirm Password", name: "confirm", type: "password", placeholder: "Repeat password" },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  {field.label}
                </label>
                <input
                  type={field.type} name={field.name}
                  value={form[field.name]} onChange={handleChange}
                  placeholder={field.placeholder}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            ))}

            {error && (
              <div style={{
                background: "#fff1f2", border: "1px solid #fecdd3",
                borderRadius: "10px", padding: "10px 14px",
                color: "#f43f5e", fontSize: "13px", marginBottom: "16px",
                display: "flex", alignItems: "center", gap: "8px"
              }}>⚠️ {error}</div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#c4b5fd" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color: "#fff", border: "none", borderRadius: "12px",
                fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(139,92,246,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 50 50" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="80" strokeDashoffset="60" strokeLinecap="round" />
                  </svg>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Creating account...
                </>
              ) : "Register →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#9ca3af" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#8b5cf6", fontWeight: "700", textDecoration: "none" }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}