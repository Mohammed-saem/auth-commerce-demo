import React from 'react'

const Footer = () => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#0f172a",
        padding: "35px 20px",
        boxSizing: "border-box",
        marginTop: "0px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
      
        <div
          style={{
         width: "40%",
            color: "white",
          }}
        >
          <h2
            style={{
              marginBottom: "12px",
              fontSize: "20px",
            }}
          >
            🛍️ ShopZone
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "13px",
              lineHeight: "1.7",
            }}
          >
            Discover quality products at affordable prices with
            fast delivery and trusted service.
          </p>
        </div>

    
        <div
          style={{
           width: "55%",
            color: "white",
          }}
        >
          <h3
            style={{
              marginBottom: "12px",
              fontSize: "18px",
            }}
          >
            Contact
          </h3>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "13px",
              lineHeight: "1.8",
              marginBottom: "10px",
            }}
          >
            📍 Fatehpur Shekhawati, Sikar  Rajasthan<br />
      
          </p>

          <a
            href="tel:+919461047417"
            style={{
              display: "block",
              color: "#e2e8f0",
              textDecoration: "none",
              marginBottom: "10px",
              fontSize: "13px",
            }}
          >
            📲 +91 9461047417
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=saembehlim@gmail.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: "13px",
              wordBreak: "break-word",
            }}
          >
            📩 saembehlim@gmail.com
          </a>  
        </div>
      </div>

 
      <div
        style={{
          marginTop: "25px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "15px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "12px",
          paddingBottom: "60px",
        }}
      >
        © 2026 ShopZone. All rights reserved.
      </div>
    </div>
  )
}

export default Footer