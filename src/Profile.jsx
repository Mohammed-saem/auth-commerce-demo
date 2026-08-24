import React, { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useNavigate, Link } from 'react-router-dom'

// --- Reusable Modal Overlay Wrapper ---
const ModalOverlay = ({ children, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(10, 10, 25, 0.45)",
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "20px"
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "28px",
        width: "90%",
        maxWidth: "460px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
        border: "1px solid #f0f0f0",
        boxSizing: "border-box"
      }}
    >
      {children}
    </div>
  </div>
);

const Profile = () => {
  const navigate = useNavigate()

  // --- Reactive Auth State ---
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // --- Modal States ---
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // --- Profile Image State ---
  const [profileImage, setProfileImage] = useState(null);

  // --- Address State ---
  const [address, setAddress] = useState({
    street: "123 RCE Tech Park",
    city: "Fatehpur",
    state: "Uttar Pradesh",
    zip: "212601",
    liveLocation: "25.9264° N, 80.8097° E (Fatehpur, UP - Live Geolocation)"
  });
  const [tempAddress, setTempAddress] = useState({ ...address });
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // --- Personal Info State ---
  const [personalInfo, setPersonalInfo] = useState({
    name: currentUser?.email ? currentUser.email.split("@")[0] : "saembehlim",
    email: currentUser?.email || "saembehlim@gmail.com",
    phone: "+91234556920",
    defaultContact: "+91234556920",
    dob: "1998-05-15"
  });
  const [tempInfo, setTempInfo] = useState({ ...personalInfo });

  // --- Security Passwords State ---
  const [passwords, setPasswords] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: ""
  });

  // --- Auth State Change Listener & Image Sync ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        setPersonalInfo(prev => ({
          ...prev,
          name: user.displayName || user.email.split("@")[0],
          email: user.email
        }));
        // Fetch saved user-specific image
        const savedImage = localStorage.getItem("profile_image_" + user.email);
        setProfileImage(savedImage || null);
      } else {
        setProfileImage(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSingout = () => {
    signOut(auth).then(() => {
      alert('logout Successfully')
      navigate('/Login')
    })
  }

  // --- Profile Image Upload with Compression ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && currentUser?.email) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // Downscale & Compress using Canvas to fit securely inside LocalStorage
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxDim = 200; // Profile photo resolution limits
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.7); // 70% Quality compression

          setProfileImage(compressed);
          try {
            localStorage.setItem("profile_image_" + currentUser.email, compressed);
            alert("Profile image uploaded and saved successfully!");
          } catch (err) {
            console.error("Quota storage error:", err);
            alert("Image upload failed due to file size limits!");
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Profile Image Removal ---
  const handleImageRemove = () => {
    if (currentUser?.email) {
      setProfileImage(null);
      localStorage.removeItem("profile_image_" + currentUser.email);
      setShowDeleteConfirmModal(false);
      alert("Profile image removed successfully!");
    }
  };

  // --- Live Location Fetch Simulator (Fatehpur, UP) ---
  const handleFetchLiveLocation = () => {
    setFetchingLocation(true);
    setTimeout(() => {
      setTempAddress(prev => ({
        ...prev,
        liveLocation: "25.9264° N, 80.8097° E (Fatehpur, UP - Live Geolocation)"
      }));
      setFetchingLocation(false);
    }, 1000);
  };

  // --- Save Handlers ---
  const saveAddress = (e) => {
    e.preventDefault();
    setAddress({ ...tempAddress });
    setShowAddressModal(false);
    alert("Address saved successfully!");
  };

  const savePersonalInfo = (e) => {
    e.preventDefault();
    setPersonalInfo({ ...tempInfo });
    setShowPersonalInfoModal(false);
    alert("Personal Information updated successfully!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwords.oldPass || !passwords.newPass || !passwords.confirmPass) {
      alert("Please fill in all password fields!");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      alert("New Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
    setShowSecurityModal(false);
  };

  const handlePasswordReset = () => {
    alert(`Password reset link sent to: ${currentUser?.email || "your email"}`);
    setShowSecurityModal(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8f0e9 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "24px 20px 110px", // Bottom nav margin
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxSizing: "border-box",
    }}>
      <div className="dashboard-container">

        {/* 1. LEFT COLUMN: Menu Options (Styled with premium Dark Navy background) */}
        <div className="dashboard-left">
          <div style={{
            backgroundColor: "#1a1a2e",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid #2a2a40",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}>
            {[
              { text: "⚙️ Settings", path: "#", state: null },
              { text: "🎁 Earn & Refer", path: "#", state: null },
              { text: "📦 My Orders", path: "/Account", state: { defaultTab: "cart" } },
              { text: "❤️ Wishlist", path: "/Account", state: { defaultTab: "wishlist" } },
              { text: "❓ Help Center", path: "#", state: null },
              { text: "🕐 History", path: "#", state: null },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                state={item.state}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 20px",
                  fontSize: "14.5px",
                  color: "#ffffff",
                  textDecoration: "none",
                  backgroundColor: "#1a1a2e",
                  borderBottom: idx === 5 ? "none" : "1px solid #2a2a40",
                  transition: "all 0.2s",
                  fontWeight: "600",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#252542"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1a1a2e"}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>

        {/* 2. CENTER COLUMN: Main Profile Card (Remains pure white background) */}
        <div className="dashboard-center">
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #f0f0f0"
          }}>
            {/* Header Banner decoration */}
            <div style={{
              height: "120px",
              background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", right: "-10px", top: "-10px", opacity: 0.25 }}>
                <svg width="150" height="150" viewBox="0 0 24 24" fill="#d97706" stroke="none">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Profile Content */}
            <div style={{ padding: "0 24px 28px", marginTop: "-45px", display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* Profile Image & Upload Section */}
              <div style={{ position: "relative", marginBottom: "12px" }}>
                <div style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "#1a1a2e",
                  color: "white",
                  fontSize: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  border: "4px solid white",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    currentUser?.email ? currentUser.email[0].toUpperCase() : "?"
                  )}
                </div>

                {/* Upload Image overlay button (+) */}
                <label style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "-2px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  border: "2px solid white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "transform 0.15s"
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  title="Upload Profile Image"
                >
                  +
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>

                {/* Remove Image overlay button (🗑️) */}
                {profileImage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirmModal(true); }}
                    title="Remove Profile Image"
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "-2px",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#e74c3c",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      border: "1.5px solid #eee",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>

              <h3 style={{ margin: "0 0 24px", color: "#1a1a2e", fontWeight: "800", fontSize: "20px", letterSpacing: "-0.5px" }}>
                {currentUser?.email || "customer@example.com"}
              </h3>

              {/* Action Grid (2 Columns) */}
              <div style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                borderTop: "1px solid #f2f2f2",
                borderBottom: "1px solid #f2f2f2",
                padding: "24px 0",
                marginBottom: "24px",
                position: "relative"
              }}>
                {[
                  { title: "Payment Methods", desc: "Manage saved cards and UPI.", icon: "💳", action: () => alert("Payment methods coming soon!") },
                  { title: "Addresses", desc: "Edit delivery and billing addresses.", icon: "🏠", action: () => { setTempAddress({ ...address }); setShowAddressModal(true); } },
                  { title: "Notifications", desc: "Set alert preferences.", icon: "🔔", action: () => alert("Notification settings coming soon!") },
                  { title: "Reviews & Feedback", desc: "View my ratings and comments.", icon: "📝", action: () => setShowReviewsModal(true) },
                  { title: "Account Security", desc: "Change password and manage 2FA.", icon: "🛡️", action: () => setShowSecurityModal(true) },
                  { title: "Data & Privacy", desc: "Export or delete your personal data.", icon: "🌐", action: () => alert("Privacy dashboard coming soon!") },
                ].map((act, idx) => (
                  <div key={idx}
                    onClick={act.action}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "14px",
                      borderRadius: "14px",
                      border: "1px solid #f6f6f6",
                      backgroundColor: "#fcfcfc",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.borderColor = "#e0e0e0";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fcfcfc";
                      e.currentTarget.style.borderColor = "#f6f6f6";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}>
                    <span style={{ fontSize: "24px", marginTop: "2px" }}>{act.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <h4 style={{ margin: 0, color: "#1a1a2e", fontSize: "14px", fontWeight: "700" }}>{act.title}</h4>
                      <p style={{ margin: "3px 0 0", color: "#777", fontSize: "11.5px", lineHeight: "1.4" }}>{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Log Out */}
              <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <button
                  onClick={handleSingout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e74c3c",
                    fontWeight: "750",
                    fontSize: "14.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fdf2f2"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  🔴 Log Out
                </button>
              </div>

              {/* Save Changes */}
              <button
                onClick={() => alert("Profile updates saved successfully!")}
                style={{
                  width: "100%",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(231,76,60,0.15)",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: Personal Info & Activity Feed (Styled with premium Dark Navy background) */}
        <div className="dashboard-right">

          {/* Personal Information Card */}
          <div style={{
            backgroundColor: "#1a1a2e",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #2a2a40",
            textAlign: "left",
            position: "relative",
            color: "white"
          }}>
            <button style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              padding: 0,
              color: "white"
            }}
              onClick={() => { setTempInfo({ ...personalInfo }); setShowPersonalInfoModal(true); }}>
              ✏️
            </button>

            <h4 style={{ margin: "0 0 16px", color: "white", fontWeight: "800", fontSize: "15px", letterSpacing: "-0.3px" }}>
              Personal Information
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <p style={{ margin: "0 0 2px", color: "#8f94a5", fontSize: "11px", fontWeight: "700" }}>Name</p>
                <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: "700" }}>{personalInfo.name}</p>
              </div>

              <div>
                <p style={{ margin: "0 0 2px", color: "#8f94a5", fontSize: "11px", fontWeight: "700" }}>Email</p>
                <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: "700", wordBreak: "break-all" }}>{personalInfo.email}</p>
              </div>

              <div>
                <p style={{ margin: "0 0 2px", color: "#8f94a5", fontSize: "11px", fontWeight: "700" }}>Phone number</p>
                <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: "700" }}>{personalInfo.phone}</p>
              </div>

              <div>
                <p style={{ margin: "0 0 2px", color: "#8f94a5", fontSize: "11px", fontWeight: "700" }}>Default Contact</p>
                <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: "700" }}>{personalInfo.defaultContact}</p>
              </div>

              <div>
                <p style={{ margin: "0 0 2px", color: "#8f94a5", fontSize: "11px", fontWeight: "700" }}>Date of Birth (DOB)</p>
                <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: "700" }}>{personalInfo.dob}</p>
              </div>
            </div>

            <span style={{
              backgroundColor: "#fffbeb",
              color: "#d97706",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              border: "1px solid #fef3c7",
              marginTop: "16px"
            }}>
              ☀️ Active User Badge
            </span>
          </div>

          {/* Recent Activity Feed Card */}
          <div style={{
            backgroundColor: "#1a1a2e",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #2a2a40",
            textAlign: "left",
            color: "white"
          }}>
            <h4 style={{ margin: "0 0 20px", color: "white", fontWeight: "800", fontSize: "15px", letterSpacing: "-0.3px" }}>
              Recent Activity Feed
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
              <div style={{
                position: "absolute",
                left: "11px",
                top: "10px",
                bottom: "10px",
                width: "2px",
                backgroundColor: "#2a2a40",
                zIndex: 1
              }} />

              {[
                { text: "Recent Activity Feed on Items", time: "7 hours ago", icon: "💬" },
                { text: "Recent Activity handragnt billing addresses", time: "2 hours ago", icon: "🛒" },
                { text: "Recent Activity Feed 28 Items", time: "2 hours ago", icon: "🕐" },
              ].map((feed, idx) => (
                <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#252542",
                    border: "2px solid #1a1a2e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px"
                  }}>
                    {feed.icon}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "12.5px", fontWeight: "600", color: "#e2e8f0", lineHeight: "1.4" }}>
                      {feed.text}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#8f94a5" }}>
                      {feed.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promotional Banner Card */}
          <div style={{
            background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            color: "white",
            textAlign: "left",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.15 }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>

            <h4 style={{ margin: "0 0 6px", color: "white", fontWeight: "800", fontSize: "16px" }}>
              Sun and deals
            </h4>
            <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.9)", fontSize: "11.5px", lineHeight: "1.4" }}>
              Save our exclusive summer coupon tickets
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
              <span style={{
                backgroundColor: "white",
                color: "#ff6b81",
                padding: "5px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "900",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}>
                30% OFF
              </span>
              <button style={{
                padding: "6px 14px",
                backgroundColor: "white",
                color: "#ff7675",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "12px",
                cursor: "pointer"
              }}
                onClick={() => alert("30% Coupon Claimed!")}>
                Claim Now
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* --- MODAL POPUPS --- */}

      {/* 1. Address Modal */}
      {showAddressModal && (
        <ModalOverlay onClose={() => setShowAddressModal(false)}>
          <h3 style={{ margin: "0 0 16px", color: "#1a1a2e", fontWeight: "800", fontSize: "18px" }}>
            🏠 Edit Addresses
          </h3>
          <form onSubmit={saveAddress} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Live Location simulated field (Fatehpur, UP) */}
            <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "10px" }}>
              <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "#666" }}>Live Geolocation</p>
              <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>
                {tempAddress.liveLocation}
              </p>
              <button
                type="button"
                onClick={handleFetchLiveLocation}
                disabled={fetchingLocation}
                style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  backgroundColor: "#1a1a2e",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {fetchingLocation ? "⏳ Getting Location..." : "📍 Fetch Live Location"}
              </button>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>Street Address</label>
              <input
                type="text"
                required
                value={tempAddress.street}
                onChange={(e) => setTempAddress({ ...tempAddress, street: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>City</label>
                <input
                  type="text"
                  required
                  value={tempAddress.city}
                  onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
                />
              </div>

              {/* Responsive State Dropdown instead of input */}
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>State</label>
                <select
                  required
                  value={tempAddress.state}
                  onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                    height: "41.5px"
                  }}
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>ZIP Code</label>
              <input
                type="text"
                required
                value={tempAddress.zip}
                onChange={(e) => setTempAddress({ ...tempAddress, zip: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                style={{ flex: 1, padding: "12px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "white", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ flex: 1, padding: "12px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
              >
                Save
              </button>
            </div>

          </form>
        </ModalOverlay>
      )}

      {/* 2. Personal Information Modal (Expanded Fields) */}
      {showPersonalInfoModal && (
        <ModalOverlay onClose={() => setShowPersonalInfoModal(false)}>
          <h3 style={{ margin: "0 0 16px", color: "#1a1a2e", fontWeight: "800", fontSize: "18px" }}>
            ✏️ Edit Personal Information
          </h3>
          <form onSubmit={savePersonalInfo} style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "450px", overflowY: "auto", paddingRight: "4px" }}>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>Name</label>
              <input
                type="text"
                required
                value={tempInfo.name}
                onChange={(e) => setTempInfo({ ...tempInfo, name: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>Email Address</label>
              <input
                type="email"
                required
                value={tempInfo.email}
                onChange={(e) => setTempInfo({ ...tempInfo, email: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>Phone Number</label>
              <input
                type="text"
                required
                value={tempInfo.phone}
                onChange={(e) => setTempInfo({ ...tempInfo, phone: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>Default Contact Number</label>
              <input
                type="text"
                required
                value={tempInfo.defaultContact}
                onChange={(e) => setTempInfo({ ...tempInfo, defaultContact: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "700", color: "#444" }}>Date of Birth (DOB)</label>
              <input
                type="date"
                required
                value={tempInfo.dob}
                onChange={(e) => setTempInfo({ ...tempInfo, dob: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => setShowPersonalInfoModal(false)}
                style={{ flex: 1, padding: "12px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "white", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ flex: 1, padding: "12px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
              >
                Save
              </button>
            </div>

          </form>
        </ModalOverlay>
      )}

      {/* 3. Reviews & Feedback Modal */}
      {showReviewsModal && (
        <ModalOverlay onClose={() => setShowReviewsModal(false)}>
          <h3 style={{ margin: "0 0 16px", color: "#1a1a2e", fontWeight: "800", fontSize: "18px" }}>
            📝 My Reviews & Feedback
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
            {[
              { prod: "Essence Mascara Glow", rating: "⭐⭐⭐⭐⭐", text: "Amazing product! The volume it gives is brilliant for daily wear. Totally smudge-free." },
              { prod: "Chanel Coco Mademoiselle", rating: "⭐⭐⭐⭐⭐", text: "A timeless, beautiful scent. Stays on the skin for over 8 hours. Highly recommend!" }
            ].map((rev, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "750", color: "#1a1a2e" }}>{rev.prod}</span>
                  <span style={{ color: "#f1c40f", fontSize: "11px" }}>{rev.rating}</span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#555", fontStyle: "italic", lineHeight: "1.4" }}>
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowReviewsModal(false)}
            style={{ width: "100%", padding: "12px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px", marginTop: "16px" }}
          >
            Close
          </button>
        </ModalOverlay>
      )}

      {/* 4. Account Security Modal */}
      {showSecurityModal && (
        <ModalOverlay onClose={() => setShowSecurityModal(false)}>
          <h3 style={{ margin: "0 0 16px", color: "#1a1a2e", fontWeight: "800", fontSize: "18px" }}>
            🛡️ Account Security
          </h3>

          {/* Quick Password Reset option */}
          <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "12px", borderRadius: "10px", marginBottom: "16px", textAlign: "left" }}>
            <h4 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "700", color: "#d97706" }}>Reset Password Link</h4>
            <p style={{ margin: "0 0 10px", fontSize: "11.5px", color: "#b45309" }}>
              Send a secure reset link to your registered email to create a new password.
            </p>
            <button
              onClick={handlePasswordReset}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#d97706",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              ✉️ Send Reset Email
            </button>
          </div>

          <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ margin: "4px 0 8px", fontSize: "14px", fontWeight: "800", color: "#1a1a2e", textAlign: "left" }}>
              Change Password Manually
            </h4>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "11px", fontWeight: "700", color: "#444" }}>Current Password</label>
              <input
                type="password"
                required
                value={passwords.oldPass}
                onChange={(e) => setPasswords({ ...passwords, oldPass: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "11px", fontWeight: "700", color: "#444" }}>New Password</label>
              <input
                type="password"
                required
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "11px", fontWeight: "700", color: "#444" }}>Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13.5px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                style={{ flex: 1, padding: "12px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "white", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ flex: 1, padding: "12px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
              >
                Save
              </button>
            </div>

          </form>
        </ModalOverlay>
      )}

      {/* 5. Delete Profile Picture Confirmation Modal */}
      {showDeleteConfirmModal && (
        <ModalOverlay onClose={() => setShowDeleteConfirmModal(false)}>
          <h3 style={{ margin: "0 0 16px", color: "#1a1a2e", fontWeight: "800", fontSize: "18px", textAlign: "center" }}>
            🗑️ Delete Profile Picture?
          </h3>
          <p style={{ margin: "0 0 24px", color: "#666", fontSize: "14px", textAlign: "center", lineHeight: "1.5" }}>
            Are you sure you want to remove your profile picture? This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowDeleteConfirmModal(false)}
              style={{
                flex: 1,
                padding: "12px",
                border: "1.5px solid #ccc",
                borderRadius: "10px",
                backgroundColor: "white",
                color: "#333",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px"
              }}
            >
              No, Keep It
            </button>
            <button
              onClick={handleImageRemove}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px"
              }}
            >
              Yes, Delete
            </button>
          </div>
        </ModalOverlay>
      )}

    </div>
  )
}

export default Profile