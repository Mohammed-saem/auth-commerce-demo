import { useState } from "react";
import { Link } from "react-router-dom";

const Card = ({ card, removetocard }) => {
  const total = card.reduce((sum, item) => sum + item.price, 0);
  const [model, setmodel] = useState(false);
  const [loading, setloading] = useState(false);

  const handlecheakout = () => {
    if (card.length === 0) {
      alert("⚠️ Your cart is empty. Add items first!");
    } else {
      setloading(true);
      setTimeout(() => {
        setloading(false);
        setmodel(`your order of $${total.toFixed(2)}`);
      }, 2000);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e8f0e9 100%)", fontFamily: "'Segoe UI', sans-serif", padding: "24px 40px" }}>

      {model && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px", textAlign: "center", maxWidth: "400px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <p style={{ fontSize: "60px", margin: 0 }}>✅</p>
            <h2 style={{ color: "#1a1a2e", margin: "16px 0 8px" }}>Order Placed!</h2>
            <p style={{ color: "#888", fontSize: "15px" }}>Successfully placed {model}</p>
            <button onClick={() => setmodel(false)} style={{ marginTop: "20px", padding: "12px 30px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>
              Close
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(22px, 5vw, 32px)", fontWeight: "800", color: "#1a1a2e", letterSpacing: "-1px" }}>🛒 Your Cart</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
            {card.length === 0 ? "Your cart is empty" : `${card.length} item${card.length > 1 ? "s" : ""} added`}
          </p>
        </div>
        <div style={{ backgroundColor: card.length > 0 ? "#2ecc71" : "#ccc", color: "white", borderRadius: "20px", padding: "8px 18px", fontWeight: "bold", fontSize: "14px" }}>
          🛍️ {card.length} items
        </div>
      </div>

      <Link to={"/Get"} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#1a1a2e", color: "white", textDecoration: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", marginBottom: "20px" }}>
        ← Continue Shopping
      </Link>

      {card.length === 0 ? (
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "40px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "60px", margin: 0 }}>🛒</p>
          <h3 style={{ color: "#1a1a2e", marginTop: "16px" }}>Cart is empty!</h3>
          <p style={{ color: "#aaa", fontSize: "14px" }}>Go add some products first</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
            {card.map((item) => (
              <div key={item.id} style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                <div style={{ backgroundColor: "#f8f8f8", display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", height: "140px" }}>
                  <img src={item.thumbnail} alt={item.title} style={{ height: "110px", width: "110px", objectFit: "contain" }} />
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
            ))}
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
               .. {loading ? "⏳ Processing." : "✅ Checkout Now"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;