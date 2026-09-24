import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase"; // Firebase Auth import required

const Card = ({ card, removetocard, hideContainer = false }) => {
  const total = card.reduce((sum, item) => sum + item.price, 0);
  const [model, setmodel] = useState(false);
  const [loading, setloading] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id) => wishlist.some((w) => w.id === id);

  const toggleWishlist = (item, e) => {
    if (e) e.stopPropagation();
    setWishlist((prev) =>
      prev.some((w) => w.id === item.id)
        ? prev.filter((w) => w.id !== item.id)
        : [...prev, item]
    );
  };

  const handlecheakout = async () => {
    if (card.length === 0) {
      alert("⚠️ Your cart is empty. Add items first!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ Please login first to proceed with checkout.");
      return;
    }

    setloading(true);

    try {
      // 1. Load Razorpay Script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = await user.getIdToken();

      // 2. Order Creation Request to Backend
      const res = await fetch(`${backendUrl}/api/checkout/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        alert("❌ Could not initialize payment. Please check server logs.");
        setloading(false);
        return;
      }

      // 3. Razorpay Options Setup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "ShopZone",
        description: `Purchase of ${card.length} item(s)`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Send verification request with Firebase Bearer Token
            const verifyRes = await fetch(`${backendUrl}/api/checkout/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                products: card,
                totalAmount: total,
              }),
            });

            const verifyResult = await verifyRes.json();

            if (verifyResult.success) {
              setmodel(`order of $${total.toFixed(2)}`);
            } else {
              alert("❌ Payment verification failed. " + verifyResult.message);
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Network error during payment verification.");
          } finally {
            setloading(false);
          }
        },
        prefill: {
          name: user.displayName || "Customer",
          email: user.email || "customer@example.com",
        },
        theme: {
          color: "#1a1a2e",
        },
        modal: {
          ondismiss: function () {
            setloading(false);
          },
        },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (error) {
      console.error("Checkout Handler Error:", error);
      alert("Failed to connect to server. Check if backend is running.");
      setloading(false);
    }
  };

  const cartContent = (
    <>
      {model && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", textAlign: "center", maxWidth: "260px", width: "75%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <p style={{ fontSize: "40px", margin: 0 }}>✅</p>
            <h2 style={{ color: "#1a1a2e", margin: "10px 0 6px", fontSize: "clamp(14px, 4vw, 20px)" }}>Order Placed!</h2>
            <p style={{ color: "#888", fontSize: "clamp(11px, 3vw, 14px)", margin: 0 }}>Successfully placed {model}</p>
            <button onClick={() => setmodel(false)} style={{ marginTop: "16px", padding: "10px 24px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
              Close
            </button>
          </div>
        </div>
      )}

      {!hideContainer && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "clamp(22px, 5vw, 32px)", fontWeight: "800", color: "#1a1a2e", letterSpacing: "-1px" }}>🛒 Your Cart</h1>
              <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
                {card.length === 0 ? "Your cart is empty" : `${card.length} item${card.length > 1 ? "s" : ""} added`}
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ backgroundColor: card.length > 0 ? "#2ecc71" : "#ccc", color: "white", borderRadius: "20px", padding: "8px 18px", fontWeight: "bold", fontSize: "14px" }}>
                🛍️ {card.length} items
              </div>
            </div>
          </div>

          <Link to={"/Get"} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#1a1a2e", color: "white", textDecoration: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", marginBottom: "20px" }}>
            ← Continue Shopping
          </Link>
        </>
      )}

      {card.length === 0 ? (
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "40px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "60px", margin: 0 }}>🛒</p>
          <h3 style={{ color: "#1a1a2e", marginTop: "16px" }}>Cart is empty!</h3>
          <p style={{ color: "#aaa", fontSize: "14px" }}>Go add some products first</p>
        </div>
      ) : (
        <>
          <div className="product-grid" style={{ marginBottom: "32px" }}>
            {card.map((item) => {
              const wished = isInWishlist(item.id);
              return (
                <div key={item.id} style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", backgroundColor: "#f8f8f8", display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", height: "140px" }}>
                    <button
                      onClick={(e) => toggleWishlist(item, e)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(255,255,255,0.9)",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        fontSize: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        zIndex: 2,
                      }}
                    >
                      {wished ? "❤️" : "🤍"}
                    </button>
                    <img src={item.thumbnail} alt={item.title} style={{ maxHeight: "110px", maxWidth: "90%", objectFit: "contain" }} />
                  </div>
                  <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p style={{ margin: 0, fontWeight: "700", fontSize: "13px", color: "#1a1a2e", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.title}
                    </p>
                    <p style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#2ecc71" }}>${item.price}</p>
                    <button onClick={() => removetocard(item.id)} style={{ marginTop: "auto", width: "100%", padding: "10px", backgroundColor: "#e6381d", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}>
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", width: "100%", maxWidth: "360px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <h3 style={{ margin: 0, color: "#1a1a2e", fontSize: "16px", fontWeight: "800" }}>Order Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "14px" }}>
                <span>Items ({card.length})</span>
                <span style={{ fontWeight: "600", color: "#1a1a2e" }}>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "14px" }}>
                <span>Shipping</span>
                <span style={{ fontWeight: "600", color: "#2ecc71" }}>FREE</span>
              </div>
              <div style={{ borderTop: "1.5px dashed #e0e0e0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "800", fontSize: "16px", color: "#1a1a2e" }}>Total</span>
                <span style={{ fontWeight: "800", fontSize: "22px", color: "#2ecc71" }}>${total.toFixed(2)}</span>
              </div>
              <button onClick={handlecheakout} disabled={loading} style={{ width: "100%", padding: "12px", backgroundColor: loading ? "#888" : "#1a1a2e", color: "white", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "700", fontSize: "14px", marginTop: "4px", letterSpacing: "0.5px" }}>
                {loading ? "⏳ Processing..." : "✅ Checkout Now"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );

  if (hideContainer) {
    return cartContent;
  }

  return (
    <div className="page-container">
      {cartContent}
    </div>
  );
};

export default Card;