export default function Loading({ fullScreen = false, size = 40, color = "#6366f1" }) {
  const spinner = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <svg
        width={size} height={size}
        viewBox="0 0 50 50"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <circle cx="25" cy="25" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="25" cy="25" r="20" fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray="80" strokeDashoffset="60"
          strokeLinecap="round"
        />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: "fixed", inset: 0,
        background: "linear-gradient(135deg, #fdf6ff, #f0f9ff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999,
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      {spinner}
    </div>
  );
}