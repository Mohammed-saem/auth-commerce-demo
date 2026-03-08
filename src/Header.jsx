import React from "react";
import { Link } from "react-router-dom";
// import DarkMode from "./hooks/useDarkMode";
import useDarkMode from "./hooks/useDarkMode";

const Header = () => {
  const { toggle } = useDarkMode();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
        backgroundColor: "#111",
        borderBottom: "1px solid #ccc",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", gap: "12px" }}>
        {/* <Link to="/">get </Link> */}
      </div>

      <img
        src="/dark-mode.png"
        alt="dark"
        onClick={toggle}
        style={{ width: "40px", height: "40px", cursor: "pointer" }}
      />
    </div>
  );
};

export default Header;
