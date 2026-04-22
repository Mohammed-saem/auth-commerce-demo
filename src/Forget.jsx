import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

// import emailjs from '@emailjs/browser'

const Forget = () => {
  const [email, setemail] = useState("");
  const [message, setmessage] = useState("");
  const navigate = useNavigate();

  const handlereset = () => {
    if (email.trim() === "") {
      setmessage("Email Required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setmessage("Invalid email format");
      return;
    }

    sendPasswordResetEmail(auth, email)
     
       .then(() => {
          setmessage("Reset link sent Successfully");
          setTimeout(() => navigate("/Login"), 2000);
        })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          setmessage("Email is not Registered");
        } else {
          setmessage("Something went wrong " + error.code);
        }
      });
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        width: "350px",
        padding: "5px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        marginBottom: "30px",
        minHeight: "335px"
      }}>
        <p style={{ margin: "0 0 10px 0", textAlign: "left", cursor: 'pointer', padding: "10px" }}
          onClick={() => navigate(-1)}>⏮</p>

        <h2>Forgot Password</h2>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", cursor: "pointer" }}>Enter your Email</label>
          <input type="email"
            placeholder='Enter your email'
            value={email}
            style={{ width: "250px", height: "28px" }}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>

        <button onClick={handlereset}
          style={{
            width: "250px",
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px"
          }}>Reset Password</button>

        {message && (
          <p style={{ color: message.includes("Reset") ? "green" : "red" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default Forget