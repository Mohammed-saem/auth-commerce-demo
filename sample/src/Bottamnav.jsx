import React from 'react'
import { Link } from 'react-router-dom'

// Premium Custom SVG Icons
const HomeIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const OrderIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const ProfileIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Bottamnav = () => {
  return (
    <div style={{
      position: "fixed",
      bottom: "0",
      left: "0",
      right: "0",
      boxSizing: "border-box",
      background: "rgba(26, 26, 46, 0.98)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      padding: "12px 0 16px", // Generous tap space
      zIndex: "1000",
      boxShadow: "0 -3px 15px rgba(0,0,0,0.18)",
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        padding: "0 24px",
        boxSizing: "border-box"
      }}>
        <Link to="/Get" style={{ color: "white", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", transition: "opacity 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
          <HomeIcon />
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2px", opacity: 0.9 }}>Home</span>
        </Link>

        <Link to="/Account" style={{ color: "white", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", transition: "opacity 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
          <OrderIcon />
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2px", opacity: 0.9 }}>Order</span>
        </Link>

        <Link to="/Profile" style={{ color: "white", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", transition: "opacity 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
          <ProfileIcon />
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2px", opacity: 0.9 }}>Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default Bottamnav