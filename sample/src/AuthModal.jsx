import React, { useState, useEffect, useRef } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from "./firebase";
import "./AuthModal.css";

// SVG Icons for buttons and inputs
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AuthModal = ({ isOpen, onClose, initialTab = "login", onSuccess }) => {
  // ==========================================
  // State
  // ==========================================
  // Active tab selection ("login" or "signup")
  const [activeTab, setActiveTab] = useState(initialTab);

  // Login form inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign up form inputs
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Feedback & Loading states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Input refs for automatic focus
  const loginEmailRef = useRef(null);
  const signupNameRef = useRef(null);

  // Reset tab and messages whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError("");
      setSuccess("");

      // Close modal on Escape key press
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, initialTab, onClose]);

  // Focus the first input field smoothly when tab switches
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (activeTab === "login" && loginEmailRef.current) {
          loginEmailRef.current.focus();
        } else if (activeTab === "signup" && signupNameRef.current) {
          signupNameRef.current.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isOpen]);

  // ==========================================
  // Handlers
  // ==========================================
  // Switch between Login and Signup tabs
  const handleTabSwitch = (tab) => {
    if (loading) return;
    setActiveTab(tab);
    setError("");
    setSuccess("");
  };

  // Clear all form inputs and feedback
  const clearForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setError("");
    setSuccess("");
  };

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setSuccess("Logged in successfully! Redirecting...");
      setLoading(false);

      // Brief delay to allow the user to see the success state
      setTimeout(() => {
        if (onSuccess) onSuccess();
        clearForm();
      }, 1000);
    } catch (err) {
      setLoading(false);
      const messages = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-not-found": "Email address not found.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-email": "Invalid email format."
      };
      setError(messages[err.code] || "Login failed. Please check your credentials.");
    }
  };

  // Handle Signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!signupName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!signupEmail.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!signupPassword || !signupConfirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      setSuccess("Account created successfully! Welcome.");
      setLoading(false);

      setTimeout(() => {
        if (onSuccess) onSuccess();
        clearForm();
      }, 1000);
    } catch (err) {
      setLoading(false);
      const messages = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Invalid email format.",
        "auth/weak-password": "Password is too weak."
      };
      setError(messages[err.code] || "Registration failed. Try again.");
    }
  };

  // Handle Forgot Password reset email
  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!loginEmail.trim()) {
      setError("Please enter your email in the Login field first.");
      if (loginEmailRef.current) loginEmailRef.current.focus();
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      setSuccess("Password reset link sent to your email!");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Could not send reset email. Verify your email address.");
    }
  };

  // Simulated Social Login
  const handleSocialLogin = (platform) => {
    if (loading) return;
    setError("");
    setSuccess("");
    setLoading(true);

    setTimeout(() => {
      setSuccess(`Signed in with ${platform}!`);
      setLoading(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        clearForm();
      }, 1000);
    }, 1200);
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className={`auth-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Floating Close Button */}
        <button 
          className="auth-close-btn" 
          onClick={onClose} 
          aria-label="Close modal"
          type="button"
        >
          <CloseIcon />
        </button>

        {/* LEFT / TOP SIDEBAR (Theme Banner & Tabs) */}
        <div className="auth-sidebar">
          <div className="auth-brand-badge">
            <span>🛍️</span>
            <span>ShopZone</span>
          </div>

          <div className="auth-sidebar-info">
            <h3>{activeTab === "login" ? "Welcome Back!" : "Join ShopZone"}</h3>
            <p>
              {activeTab === "login" 
                ? "Sign in to manage your orders, track wishlist items, and checkout faster." 
                : "Create an account to unlock exclusive member discounts and quick checkout."}
            </p>
          </div>

          {/* Simple Segmented Tabs Controller */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => handleTabSwitch("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => handleTabSwitch("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* RIGHT / MAIN CONTENT AREA */}
        <div className="auth-content">
          <div className="auth-header">
            <h2 className="auth-title">
              {activeTab === "login" ? "Sign In to Your Account" : "Create a New Account"}
            </h2>
            <p className="auth-subtitle">
              {activeTab === "login" 
                ? "Enter your email and password below" 
                : "Fill in the details below to register"}
            </p>
          </div>

          {/* Alert messages */}
          {error && <div className="auth-alert auth-alert-error">{error}</div>}
          {success && <div className="auth-alert auth-alert-success">{success}</div>}

          {/* LOGIN FORM */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              {/* Email Input */}
              <div className="auth-input-group">
                <span className="auth-input-icon">
                  <MailIcon />
                </span>
                <input
                  ref={loginEmailRef}
                  type="email"
                  placeholder="Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="auth-input"
                  disabled={loading}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="auth-input-group">
                <span className="auth-input-icon">
                  <LockIcon />
                </span>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="auth-input"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="auth-input-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>

              {/* Actions: Forgot Password & Submit Button */}
              <div className="auth-action-row">
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot Password?
                </button>
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>
            </form>
          )}

          
          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="auth-form">
        
              <div className="auth-input-group">
                <span className="auth-input-icon">
                  <UserIcon />
                </span>
                <input
                  ref={signupNameRef}
                  type="text"
                  placeholder="Full Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="auth-input"
                  disabled={loading}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="auth-input-group">
                <span className="auth-input-icon">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="auth-input"
                  disabled={loading}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="auth-input-group">
                <span className="auth-input-icon">
                  <LockIcon />
                </span>
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password (min 6 chars)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="auth-input"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="auth-input-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showSignupPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="auth-input-group">
                <span className="auth-input-icon">
                  <LockIcon />
                </span>
                <input
                  type={showSignupConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="auth-input"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                  className="auth-input-toggle"
                  aria-label="Toggle confirm password visibility"
                >
                  {showSignupConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>

              {/* Submit Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                <button
                  type="submit"
                  className="auth-submit-btn"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

          {/* Social Logins Divider & Buttons */}
          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social-buttons">
            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialLogin("Google")}
              disabled={loading}
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialLogin("Facebook")}
              disabled={loading}
            >
              <FacebookIcon />
              <span>Facebook</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthModal;

/**
 * Advanced pattern note:
 * Conditional standard-flow rendering was used instead of absolute CSS slide-transforms
 * because flex-basis collapses and coordinate offsets break on mobile viewports.
 * This guarantees reliable auto-sizing, natural touch scrolling, and zero overflow bugs.
 */
