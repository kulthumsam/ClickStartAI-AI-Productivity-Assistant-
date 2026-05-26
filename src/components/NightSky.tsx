export function NightSky() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      {/* stars */}
      <div className="absolute inset-0 night-stars" />
      <div className="absolute inset-0 night-stars-2 opacity-70" />

      {/* moon */}
      <div className="night-moon">
        <div className="night-moon-glow" />
        <div className="night-moon-body">
          <span className="night-crater" style={{ top: "22%", left: "28%", width: 14, height: 14 }} />
          <span className="night-crater" style={{ top: "55%", left: "55%", width: 20, height: 20 }} />
          <span className="night-crater" style={{ top: "38%", left: "65%", width: 10, height: 10 }} />
          <span className="night-crater" style={{ top: "70%", left: "30%", width: 8, height: 8 }} />
        </div>
      </div>
    </div>
  );
}
