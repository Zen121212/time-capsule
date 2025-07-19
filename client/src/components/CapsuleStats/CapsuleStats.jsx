function CapsuleStats({ capsules }) {
  const total = capsules.length;
  const revealed = capsules.filter((c) => c.revealDate <= 0).length;
  const waiting = capsules.filter((c) => c.revealDate > 0).length;
  const publicCount = capsules.filter((c) => c.privacy === "public").length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "1rem",
        marginTop: "2rem",
      }}
    >
      <StatBox label="Total" count={total} color="#007bff" />
      <StatBox label="Revealed" count={revealed} color="#28a745" />
      <StatBox label="Waiting" count={waiting} color="#ffc107" />
      <StatBox label="Public" count={publicCount} color="#17a2b8" />
    </div>
  );
}

function StatBox({ label, count, color }) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{count}</div>
      <div style={{ fontSize: "0.9rem" }}>{label}</div>
    </div>
  );
}

export default CapsuleStats;
