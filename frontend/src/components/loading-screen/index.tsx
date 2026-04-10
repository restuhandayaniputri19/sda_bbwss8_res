import logo from "../../assets/logo.png";

const LoadingScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#1a3a6b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div style={{ position: "relative", width: 90, height: 90 }}>
        <img
          src={logo}
          alt="logo"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 45,
            height: 45,
            objectFit: "contain",
          }}
        />

        <svg
          style={{ animation: "spin 1s linear infinite" }}
          width="90"
          height="90"
          viewBox="0 0 90 90"
        >
          <circle
            cx="45"
            cy="45"
            r="38"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="90 150"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;