export default function Custom500() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1>500 — Server Error</h1>
      <p>Something went wrong on our end. Please try again later.</p>
      <a href="/" style={{ marginTop: "1rem", color: "#2563eb" }}>Go home</a>
    </div>
  );
}
