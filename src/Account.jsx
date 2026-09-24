import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Card from "./Card";

// --- Premium Custom SVG Icons for Account Center ---
const HeartIcon = ({ size = 20, color = "currentColor", fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const CartIcon = ({ size = 20, color = "currentColor", fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

const CalendarIcon = ({ size = 28, color = "#1a1a2e" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
);

const LightningIcon = ({ size = 28, color = "#1a1a2e" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const CreditCardIcon = ({ size = 28, color = "#1a1a2e" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

const PackageIcon = ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

const StarIcon = ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ChatIcon = ({ size = 26, color = "#1a1a2e" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const BookIcon = ({ size = 26, color = "#1a1a2e" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

const TruckIcon = ({ size = 26, color = "#1a1a2e" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="13" x="2" y="4" rx="2" />
        <polygon points="18 8 22 12 22 17 18 17 18 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const RotateIcon = ({ size = 26, color = "#1a1a2e" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <polyline points="21 3 21 8 16 8" />
    </svg>
);

// --- Sub-component to prevent deep nesting indentation wrapping ---
const WishlistCard = ({ item, isInCart, addtocard, removetocard, removeFromWishlist, requireAuth }) => {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: isInCart
                    ? "0 0 0 2px #2ecc71, 0 8px 24px rgba(46,204,113,0.15)"
                    : "0 4px 20px rgba(0,0,0,0.07)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#bfbeb4",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "12px",
                    height: "160px",
                }}
            >
                {/* ❤️ Remove button */}
                <button
                    onClick={(e) => removeFromWishlist(item.id, e)}
                    title="Remove from wishlist"
                    style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        background: "rgba(255,255,255,0.95)",
                        border: "none",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        padding: "0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        zIndex: 2,
                    }}
                >
                    <HeartIcon size={16} fill="#e74c3c" color="#e74c3c" />
                </button>

                <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                        maxHeight: "130px",
                        maxWidth: "90%",
                        objectFit: "contain",
                    }}
                />
            </div>

            <div
                style={{
                    padding: "12px 14px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontWeight: "700",
                        fontSize: "13px",
                        color: "#1a1a2e",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {item.title}
                </p>
                <p
                    style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "#2ecc71",
                    }}
                >
                    ${item.price}
                </p>

                {isInCart && (
                    <span
                        style={{
                            fontSize: "11px",
                            color: "#2ecc71",
                            fontWeight: "700",
                            backgroundColor: "#eafaf1",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            alignSelf: "flex-start",
                        }}
                    >
                        ✓ In Cart
                    </span>
                )}

                <button
                    onClick={() => {
                        if (isInCart) {
                            removetocard(item.id);
                        } else {
                            if (requireAuth) {
                                requireAuth(() => addtocard(item), 'login');
                            } else {
                                addtocard(item);
                            }
                        }
                    }}
                    style={{
                        marginTop: "auto",
                        width: "100%",
                        padding: "12px",
                        backgroundColor: isInCart ? "#e74c3c" : "#1a1a2e",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "13px",
                    }}
                >
                    {isInCart ? "🗑️ Remove" : "🛒 Add to Cart"}
                </button>
            </div>
        </div>
    );
};

const Account = ({ card = [], addtocard, removetocard, requireAuth }) => {
    const location = useLocation();

    // Tab State: "wishlist" or "cart"
    const [activeTab, setActiveTab] = useState(() => {
        return location.state?.defaultTab || "wishlist";
    });

    useEffect(() => {
        if (location.state?.defaultTab) {
            setActiveTab(location.state.defaultTab);
        }
    }, [location.state]);

    // Wishlist state - uses same localStorage key as Productlist.jsx
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const removeFromWishlist = (id, e) => {
        if (e) e.stopPropagation();
        setWishlist((prev) => prev.filter((w) => w.id !== id));
    };

    const inCart = (id) => card?.some((c) => c.id === id) || false;

    // Dummy products for Recently Viewed Section (using valid DummyJSON CDN URLs)
    const recentlyViewedProducts = [
        {
            id: 201,
            title: "Essence Mascara Glow",
            price: 9.99,
            thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Glow/thumbnail.png"
        },
        {
            id: 202,
            title: "Chanel Coco Mademoiselle",
            price: 120.00,
            thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Mademoiselle%20Intense/thumbnail.png"
        },
        {
            id: 203,
            title: "Red Apple Groceries",
            price: 1.99,
            thumbnail: "https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png"
        },
        {
            id: 204,
            title: "Calvin Klein Defy Fragrance",
            price: 79.99,
            thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20Defy/thumbnail.png"
        },
        {
            id: 205,
            title: "Cucumber Fresh Groceries",
            price: 0.99,
            thumbnail: "https://cdn.dummyjson.com/products/images/groceries/Cucumber/thumbnail.png"
        }
    ];

    return (
        <div className="page-container" style={{ paddingBottom: "110px" }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "28px",
                    flexWrap: "wrap",
                    gap: "12px",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "clamp(24px, 5.5vw, 36px)",
                            fontWeight: "800",
                            color: "#1a1a2e",
                            letterSpacing: "-1px",
                        }}
                    >
                        👤 Account Center
                    </h1>
                    <p style={{ margin: "6px 0 0", color: "#666", fontSize: "15px" }}>
                        Manage your shopping activity, cart, and wishlist
                    </p>
                </div>

                <Link
                    to="/Get"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#1a1a2e",
                        color: "white",
                        textDecoration: "none",
                        padding: "12px 20px",
                        borderRadius: "12px",
                        fontWeight: "700",
                        fontSize: "14px",
                    }}
                >
                    ← Continue Shopping
                </Link>
            </div>

            {/* Tab Switcher Segmented Control */}
            <div style={{
                display: "flex",
                backgroundColor: "rgba(26, 26, 46, 0.06)",
                borderRadius: "16px",
                padding: "6px",
                marginBottom: "32px",
                width: "fit-content",
                margin: "0 auto 32px",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)"
            }}>
                <button
                    onClick={() => setActiveTab("wishlist")}
                    style={{
                        padding: "12px 28px",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "700",
                        fontSize: "15px",
                        cursor: "pointer",
                        backgroundColor: activeTab === "wishlist" ? "#1a1a2e" : "transparent",
                        color: activeTab === "wishlist" ? "white" : "#555",
                        transition: "all 0.25s",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <HeartIcon size={18} fill={activeTab === "wishlist" ? "#e74c3c" : "none"} color={activeTab === "wishlist" ? "#e74c3c" : "currentColor"} />
                    <span>Wishlist ({wishlist.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab("cart")}
                    style={{
                        padding: "12px 28px",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "700",
                        fontSize: "15px",
                        cursor: "pointer",
                        backgroundColor: activeTab === "cart" ? "#1a1a2e" : "transparent",
                        color: activeTab === "cart" ? "white" : "#555",
                        transition: "all 0.25s",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <CartIcon size={18} fill={activeTab === "cart" ? "white" : "none"} color="currentColor" />
                    <span>Cart ({card.length})</span>
                </button>
            </div>

            {/* Dynamic Tab Content Wrapper */}
            <div style={{ marginBottom: "54px" }}>
                {activeTab === "wishlist" ? (
                    // Wishlist Layout
                    wishlist.length === 0 ? (
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "16px",
                                padding: "50px 24px",
                                textAlign: "center",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                            }}
                        >
                            <HeartIcon size={56} color="#aaa" />
                            <h3 style={{ color: "#1a1a2e", marginTop: "18px", fontSize: "18px", fontWeight: "700" }}>
                                Wishlist is empty!
                            </h3>
                            <p style={{ color: "#aaa", fontSize: "14px", marginTop: "6px" }}>
                                Go add some products to your wishlist first
                            </p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {wishlist.map((item) => (
                                <WishlistCard
                                    key={item.id}
                                    item={item}
                                    isInCart={inCart(item.id)}
                                    addtocard={addtocard}
                                    removetocard={removetocard}
                                    removeFromWishlist={removeFromWishlist}
                                    requireAuth={requireAuth}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    // Cart Layout (Modular embedded Card page with hidden wrapper layout)
                    <Card card={card} removetocard={removetocard} hideContainer={true} />
                )}
            </div>

            {/* --- NAYE SECTIONS --- */}

            {/* 1. Finance Options Section */}
            <div style={{ marginBottom: "44px" }}>
                <h3 style={{ color: "#1a1a2e", fontWeight: "800", fontSize: "20px", marginBottom: "18px", letterSpacing: "-0.5px" }}>
                    💳 Finance & Payment Options
                </h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px"
                }}>
                    {[
                        { title: "EMI Options", desc: "No Cost EMI up to 12 months on credit cards", btnText: "Check Eligibility", icon: <CalendarIcon /> },
                        { title: "Pay Later", desc: "Buy now & pay next month with zero extra charges", btnText: "Activate Now", icon: <LightningIcon /> },
                        { title: "Apply For Card", desc: "Get flat 5% cashback on all RCE store purchases", btnText: "Apply Now", icon: <CreditCardIcon /> }
                    ].map((fin, idx) => (
                        <div key={idx} style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                            border: "1px solid #f0f0f0",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <span>{fin.icon}</span>
                            <h4 style={{ margin: 0, color: "#1a1a2e", fontSize: "16px", fontWeight: "750" }}>{fin.title}</h4>
                            <p style={{ margin: 0, color: "#666", fontSize: "13px", lineHeight: "1.5" }}>{fin.desc}</p>
                            <button style={{
                                marginTop: "auto",
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "#1a1a2e",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "700",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}>
                                {fin.btnText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Recently Viewed Section (Horizontal Scrollable Row) */}
            <div style={{ marginBottom: "44px" }}>
                <h3 style={{ color: "#1a1a2e", fontWeight: "800", fontSize: "20px", marginBottom: "18px", letterSpacing: "-0.5px" }}>
                    🕒 Recently Viewed Products
                </h3>
                <div style={{
                    display: "flex",
                    gap: "18px",
                    overflowX: "auto",
                    paddingBottom: "16px",
                    scrollbarWidth: "thin",
                    msOverflowStyle: "auto",
                    boxSizing: "border-box"
                }}>
                    {recentlyViewedProducts.map((prod) => (
                        <div key={prod.id} style={{
                            backgroundColor: "white",
                            borderRadius: "14px",
                            padding: "14px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                            border: "1px solid #f0f0f0",
                            width: "160px",
                            flexShrink: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px"
                        }}>
                            <div style={{
                                height: "110px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px"
                            }}>
                                <img src={prod.thumbnail} alt={prod.title} style={{
                                    maxHeight: "95px",
                                    maxWidth: "100%",
                                    objectFit: "contain"
                                }} />
                            </div>
                            <p style={{
                                margin: 0,
                                fontWeight: "700",
                                fontSize: "12px",
                                color: "#1a1a2e",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {prod.title}
                            </p>
                            <p style={{ margin: 0, fontWeight: "800", fontSize: "14px", color: "#2ecc71" }}>
                                ${prod.price}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. My Activity Section */}
            <div style={{ marginBottom: "44px" }}>
                <h3 style={{ color: "#1a1a2e", fontWeight: "800", fontSize: "20px", marginBottom: "18px", letterSpacing: "-0.5px" }}>
                    📊 My Activity Timeline
                </h3>
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                    border: "1px solid #f0f0f0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px"
                }}>
                    {[
                        { title: "Order Placed Successfully", desc: "Order ID: #RCE-98765 • Paid via UPI", time: "2 days ago", icon: <PackageIcon color="#1a1a2e" /> },
                        { title: "Wishlist Update", desc: "Added 'Calvin Klein Defy' to your saved wishlist", time: "Yesterday", icon: <HeartIcon size={18} fill="#e74c3c" color="#e74c3c" /> },
                        { title: "Review Published", desc: "Rated 5 stars for 'Essence Mascara Glow'", time: "4 days ago", icon: <StarIcon color="#f1c40f" /> }
                    ].map((act, idx) => (
                        <div key={idx} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            borderBottom: idx === 2 ? "none" : "1px solid #f5f5f5",
                            paddingBottom: idx === 2 ? 0 : "14px",
                            gap: "12px"
                        }}>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ marginTop: "2px" }}>{act.icon}</span>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: "14.5px", fontWeight: "700", color: "#1a1a2e" }}>{act.title}</h4>
                                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#666" }}>{act.desc}</p>
                                </div>
                            </div>
                            <span style={{ fontSize: "12px", color: "#999", whiteSpace: "nowrap" }}>{act.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Reviews Section */}
            <div style={{ marginBottom: "44px" }}>
                <h3 style={{ color: "#1a1a2e", fontWeight: "800", fontSize: "20px", marginBottom: "18px", letterSpacing: "-0.5px" }}>
                    ⭐ My Reviews & Ratings
                </h3>
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                    border: "1px solid #f0f0f0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px"
                }}>
                    {[
                        { prod: "Essence Mascara Glow", rating: "⭐⭐⭐⭐⭐", text: "Amazing product! The volume it gives is brilliant for daily wear. Totally smudge-free." },
                        { prod: "Chanel Coco Mademoiselle", rating: "⭐⭐⭐⭐⭐", text: "A timeless, beautiful scent. Stays on the skin for over 8 hours. Highly recommend!" }
                    ].map((rev, idx) => (
                        <div key={idx} style={{
                            borderBottom: idx === 1 ? "none" : "1px solid #f5f5f5",
                            paddingBottom: idx === 1 ? 0 : "14px",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                <span style={{ fontSize: "14px", fontWeight: "750", color: "#1a1a2e" }}>{rev.prod}</span>
                                <span style={{ color: "#f1c40f", fontSize: "13px" }}>{rev.rating}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: "13.5px", color: "#555", fontStyle: "italic", lineHeight: "1.6" }}>
                                "{rev.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Help & Support Section */}
            <div style={{ marginBottom: "44px" }}>
                <h3 style={{ color: "#1a1a2e", fontWeight: "800", fontSize: "20px", marginBottom: "18px", letterSpacing: "-0.5px" }}>
                    ❓ Need Help & Support?
                </h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "14px"
                }}>
                    {[
                        { title: "Contact Us", desc: "Speak with our 24/7 support agents", icon: <ChatIcon /> },
                        { title: "FAQs", desc: "Find instant answers to common questions", icon: <BookIcon /> },
                        { title: "Track Order", desc: "Check shipping status of your orders", icon: <TruckIcon /> },
                        { title: "Returns & Refunds", desc: "Easy, hassle-free 10 day returns", icon: <RotateIcon /> }
                    ].map((item, idx) => (
                        <div key={idx} style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                            border: "1px solid #f0f0f0",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            transition: "background-color 0.2s"
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                        >
                            <span>{item.icon}</span>
                            <div>
                                <h4 style={{ margin: 0, color: "#1a1a2e", fontSize: "14.5px", fontWeight: "700" }}>{item.title}</h4>
                                <p style={{ margin: "4px 0 0", color: "#888", fontSize: "12px" }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Account;