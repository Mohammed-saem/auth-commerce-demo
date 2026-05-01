import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const Singup = () => {
  const navigate = useNavigate()
  const [show, setshow] = useState(true);
  const [showToggle, setshowToggle] = useState(false);
  const [form, setform] = useState({
    Name: "",
    email: "",
    password: "",
  });
  const [error, seterror] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    seterror({});
    const newerror = {};
    if (!form.Name) newerror.Name = "name is required"
    if (!form.email) newerror.email = "email is required";
    else if (!form.email.includes("@")) newerror.email = "email must include @";
    if (!form.password) newerror.password = "password is required"
    else if (form.password.length < 6) newerror.password = "your password must be greater then 6 characters"
    if (Object.keys(newerror).length > 0) {
      seterror(newerror);
      return;
    }
    createUserWithEmailAndPassword(auth, form.email, form.password).then(() => {
      alert('Singup Successfully')
      navigate("/Get")
    }).catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        alert('email is Already register please login')
        setform({ Name: "", email: "", password: "" });
        navigate("/Login")
      } else {
        alert('somthing went wrong')
      }
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
        width: "360px",
        padding: "25px",
        background: "var(--bg-card)", 
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
        marginBottom: "30px",
        boxSizing: "border-box",
      }}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", cursor: "pointer", color: "var(--text-color)" }}>
            Singup Page
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", cursor: "pointer", color: "var(--text-color)" }}>Name</label>
            <input
              type="text"
              placeholder='Enter your name'
              value={form.Name}
              style={{ width: "100%", height: "36px", boxSizing: "border-box", border: "1.7px solid #070707", background: "var(--input-bg)", color: "var(--text-color)" }}
              onChange={(e) => setform({ ...form, Name: e.target.value })}
            />
            {error.Name && <p style={{ color: "red" }}>{error.Name}</p>}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", cursor: "pointer", color: "var(--text-color)" }}>Email</label>
            <input
              type="email"
              placeholder='Enter your email'
              value={form.email}
              style={{ width: "100%", height: "36px", boxSizing: "border-box",  border: "1.7px solid #070707", background: "var(--input-bg)", color: "var(--text-color)" }}
              onChange={(e) => setform({ ...form, email: e.target.value })}
            />
            {error.email && <p style={{ color: "red" }}>{error.email}</p>}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", cursor: "pointer", color: "var(--text-color)" }}>Password</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={show ? 'password' : 'text'}
                placeholder='Enter your password'
                style={{ width: "100%", height: "36px", paddingRight: "36px", boxSizing: "border-box",  border: "1.7px solid #070707", background: "var(--input-bg)", color: "var(--text-color)" }}
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
                    cursor: "pointer", fontSize: "16px",
                  }}>
                  {show ? '🙈' : '👁️'}
                </span>
              )}
            </div>
            {error.password && <p style={{ color: "red" }}>{error.password}</p>}
          </div>

          <button
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "15px",
            }}
            type='submit'>Singup</button>

          <p style={{ cursor: "pointer", color: "var(--text-color)" }}>
            Already have an account?{" "}
            <span onClick={() => navigate('/Login')} style={{ cursor: "pointer", color: "rebeccapurple" }}>Login</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Singup;