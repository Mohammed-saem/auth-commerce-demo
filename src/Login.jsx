import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const Login = () => {
  const navigate = useNavigate();
  const [show, setshow] = useState(true);
  const [showToggle, setshowToggle] = useState(false);
  const [form, setform] = useState({
    email: "",
    password: "",
  });
  const [error, seterror] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    seterror("");

    if (form.email.trim() === "" && form.password.trim() === "") {
      seterror("Email and password Required");
      return;
    }

    if (form.email.trim() === "") {
      seterror("Email is required");
      return;
    }

    if (form.password.trim() === "") {
      seterror("Password is required");
      return;
    }

    signInWithEmailAndPassword(auth, form.email, form.password).then(() => {
      alert("Login Successfully")
      navigate("/Get")
    }).catch((err) => {
      const message = {
        "auth/invalid-credential": "Invalid email or password",
      }
      seterror(message[err.code] || 'somthing went wrong, try again')
    })
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
        background: "var(--bg-outer)",
      padding: "25px",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: "min(90%, 450px)",
        boxSizing: "border-box",
        padding: "25px",
          background: "var(--bg-card)",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
        marginBottom: "30px",
      }}>
        <form onSubmit={handleSubmit}>
           <h2 style={{ cursor: "pointer", color: "var(--text-color)" }}>Login</h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", cursor: "pointer" }}>Email</label>
            <input
              type="email"
              placeholder='Enter your email'
              value={form.email}
              style={{ width: "100%", height: "36px", boxSizing: "border-box" ,  background: "var(--input-bg)",  color: "var(--text-color)",  }}

              onChange={(e) => setform({ ...form, email: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
             <label style={{ display: "block", marginBottom: "5px", cursor: "pointer", color: "var(--text-color)" }}>Password</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={show ? 'password' : 'text'}
                placeholder='Enter your password'
                style={{ width: "100%", height: "36px", paddingRight: "36px", boxSizing: "border-box" ,background: "var(--input-bg)",  color: "var(--text-color)",}}
                value={form.password}
                onChange={(e) => {
                  setform({ ...form, password: e.target.value });
                  setshowToggle(e.target.value.length > 0);
                }}
              />
              {showToggle && (
                <span
                  onClick={() => setshow(!show)}
                  style={{
                    position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                    cursor: "pointer", fontSize: "16px", userSelect: "none"
                  }}>
                  {show ? '🙈' : '👁️'}
                </span>
              )}
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type='submit' style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px",
          }}>Login</button>
        </form>

        <div style={{ marginTop: "15px",  color: "var(--text-color)"  }}>
          Having trouble signing in? <a href="/Forget" style={{ textDecoration: "none" }}>Reset your password.</a>
        </div>

        <button onClick={() => navigate('/Singup')} style={{
          width: "100%",
          padding: "10px",
          background: "#26231d",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "20px",
        }}>Singup</button>
      </div>
    </div>
  )
}

export default Login;