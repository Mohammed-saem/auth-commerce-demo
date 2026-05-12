import React from 'react'
import { Link } from 'react-router-dom'

const Bottamnav = () => {
  return (
    <div style={{
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      boxSizing: "border-box",
      background: "linear-gradient(135deg, #5f7dac 0%, #e8f0e9 100%)",
      padding: "15px 0",
      zIndex: "999",
      display: "flex",
      justifyContent: "space-around",
    }}>
      <Link to="/Get" style={{color: "white", textDecoration: "none"}}>🏠 Home</Link>
      <Link to="/Card" style={{color: "white", textDecoration: "none"}}>🛒 Cart</Link>
      <Link to="/Profile" style={{color: "white", textDecoration: "none"}}>👤 Profile</Link>
    </div>
  )
}

export default Bottamnav