import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/symptoms", label: "Symptom Checker", icon: "🤒" },
  { path: "/medications", label: "Medications", icon: "💊" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{
      width: "240px", minHeight: "100vh",
      background: "linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)",
      borderRight: "1px solid #e9d5ff",
      display: "flex", flexDirection: "column",
      padding: "24px 16px",
      boxShadow: "2px 0 12px rgba(139,92,246,0.06)",
      position: "fixed", top: 0, left: 0,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", paddingLeft: "8px" }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "12px",
          background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", boxShadow: "0 4px 14px rgba(139,92,246,0.35)"
        }}>⚕️</div>
        <span style={{ fontSize: "18px", fontWeight: "800", color: "#1e1b4b", letterSpacing: "-0.5px" }}>
          Medi<span style={{ color: "#8b5cf6" }}>Care</span>
        </span>
      </div>

      {/* User Info */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.06))",
        border: "1px solid rgba(139,92,246,0.15)",
        borderRadius: "14px", padding: "14px", marginBottom: "28px",
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", fontWeight: "700", color: "#fff", flexShrink: 0
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ overflow: "hidden" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#1e1b4b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</p>
          <p style={{ margin: 0, fontSize: "11px", color: "#8b5cf6", textTransform: "capitalize" }}>{user?.role}</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        <p style={{ fontSize: "10px", fontWeight: "700", color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 8px" }}>Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 14px", borderRadius: "12px",
              textDecoration: "none", fontSize: "14px", fontWeight: "600",
              transition: "all 0.2s",
              background: isActive ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "transparent",
              color: isActive ? "#fff" : "#6b7280",
              boxShadow: isActive ? "0 4px 14px rgba(139,92,246,0.3)" : "none",
            })}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "11px 14px", borderRadius: "12px",
          border: "1px solid #fecdd3", background: "#fff5f5",
          color: "#f43f5e", fontSize: "14px", fontWeight: "600",
          cursor: "pointer", width: "100%", marginTop: "12px",
          transition: "all 0.2s",
        }}
      >
        <span style={{ fontSize: "18px" }}>🚪</span>
        Logout
      </button>
    </div>
  );
}