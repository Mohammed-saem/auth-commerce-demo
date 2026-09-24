import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Productlist = ({ data, card, addtocard, removetocard, requireAuth }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ALL");
  const [view, setView] = useState("grid");
  const [selectproduct, setselectproduct] = useState(null);

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id) => wishlist.some((w) => w.id === id);

  const toggleWishlist = (item, e) => {
    if (e) e.stopPropagation(); // card click trigger na ho
    if (requireAuth) {
      requireAuth(() => {
        setWishlist((prev) =>
          prev.some((w) => w.id === item.id)
            ? prev.filter((w) => w.id !== item.id)
            : [...prev, item]
        );
      }, 'signup');
    } else {
      setWishlist((prev) =>
        prev.some((w) => w.id === item.id)
          ? prev.filter((w) => w.id !== item.id)
          : [...prev, item]
      );
    }
  };

  const searchdata = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortdata = [...searchdata];
  if (sort === "high-low") sortdata.sort((a, b) => b.price - a.price);
  else if (sort === "low-high") sortdata.sort((a, b) => a.price - b.price);

  const inCart = (id) => card.some((c) => c.id === id);

  return (
    <div className="page-container">
      {selectproduct && (
        <div
          onClick={() => setselectproduct(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "24px 20px",
              width: "90%",
              maxWidth: "420px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={() => setselectproduct(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f0f0f0",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>


            <button
              onClick={(e) => toggleWishlist(selectproduct, e)}
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "#f0f0f0",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isInWishlist(selectproduct.id) ? "❤️" : "🤍"}
            </button>

            <div
              style={{
                backgroundColor: "#bfbeb4",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                marginBottom: "20px",
              }}
            >
              <img
                src={selectproduct.thumbnail}
                alt={selectproduct.title}
                style={{
                  height: "160px",
                  width: "160px",
                  objectFit: "contain",
                }}
              />
            </div>

            <p
              style={{
                margin: "0 0 6px",
                fontWeight: "700",
                fontSize: "16px",
                color: "#1a1a2e",
              }}
            >
              {selectproduct.title}
            </p>

            <p
              style={{
                margin: "0 0 10px",
                fontSize: "13px",
                color: "#888",
              }}
            >
              {selectproduct.category} &nbsp;•&nbsp; ⭐ {selectproduct.rating}{" "}
              &nbsp;•&nbsp; Stock: {selectproduct.stock}
            </p>

            <p
              style={{
                margin: "0 0 10px",
                fontSize: "24px",
                fontWeight: "800",
                color: "#2ecc71",
              }}
            >
              ${selectproduct.price}
            </p>

            <p
              style={{
                margin: "0 0 20px",
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.6",
              }}
            >
              {selectproduct.description}
            </p>

            <button
              onClick={() => {
                if (inCart(selectproduct.id)) {
                  removetocard(selectproduct.id);
                } else {
                  if (requireAuth) {
                    requireAuth(() => addtocard(selectproduct), 'login');
                  } else {
                    addtocard(selectproduct);
                  }
                }
              }}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: inCart(selectproduct.id) ? "#e74c3c" : "#1a1a2e",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              {inCart(selectproduct.id) ? "🗑️ Remove from Cart" : "🛒 Add to Cart"}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(22px, 5vw, 32px)",
              fontWeight: "800",
              color: "#1a1a2e",
              letterSpacing: "-1px",
            }}
          >
            🛍️ ShopZone
          </h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
            Discover amazing products By Saem
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Wishlist counter link */}
          <div
            style={{
              backgroundColor: "#e74c3c",
              color: "white",
              borderRadius: "20px",
              padding: "8px 18px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            ❤️ {wishlist.length} wishlist
          </div>
          <div
            style={{
              backgroundColor: "#2ecc71",
              color: "white",
              borderRadius: "20px",
              padding: "8px 18px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            <Link to="/Account" state={{ defaultTab: "cart" }} style={{ backgroundColor: "#2ecc71", textDecoration: "none", color: "white" }}>
              🛒 {card.length} items in cart
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ position: "relative", flex: "1", minWidth: "160px" }}>
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
              color: "#aaa",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 10px 10px 40px",
              borderRadius: "10px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              backgroundColor: "#fafafa",
            }}
          />
        </div>

        <span style={{ fontSize: "13px", color: "#888", fontWeight: "600" }}>
          Sort:
        </span>

        {["ALL", "low-high", "high-low"].map((option) => (
          <button
            key={option}
            onClick={() => setSort(option)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              backgroundColor: sort === option ? "#1a1a2e" : "#f0f0f0",
              color: sort === option ? "white" : "#555",
              transition: "all 0.2s",
            }}
          >
            {option === "high-low"
              ? "💰 High → Low"
              : option === "low-high"
                ? "💸 Low → High"
                : "✨ All"}
          </button>
        ))}

        <span style={{ fontSize: "13px", color: "#888", fontWeight: "600" }}>
          View:
        </span>
        <button
          onClick={() => setView("grid")}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px",
            backgroundColor: view === "grid" ? "#1a1a2e" : "#f0f0f0",
            color: view === "grid" ? "white" : "#555",
            transition: "all 0.2s",
          }}
        >
          ⊞ Grid
        </button>
        <button
          onClick={() => setView("table")}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px",
            backgroundColor: view === "table" ? "#1a1a2e" : "#f0f0f0",
            color: view === "table" ? "white" : "#555",
            transition: "all 0.2s",
          }}
        >
          ☰ Table
        </button>
      </div>

      <p
        style={{
          color: "#be9e9e",
          fontSize: "13px",
          marginBottom: "20px",
          marginTop: 0,
        }}
      >
        Showing{" "}
        <strong style={{ color: "#1a1a2e" }}>{sortdata.length} </strong>
        products
      </p>

      {view === "grid" && (
        <div className="product-grid">
          {sortdata.map((item) => {
            const isInCart = inCart(item.id);
            const wished = isInWishlist(item.id);
            return (
              <div
                key={item.id}
                onClick={() => setselectproduct(item)}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: isInCart
                    ? "0 0 0 2px #2ecc71, 0 8px 24px rgba(46,204,113,0.15)"
                    : "0 4px 20px rgba(0,0,0,0.07)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
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
                  {/* ❤️ Wishlist button - top left corner */}
                  <button
                    onClick={(e) => toggleWishlist(item, e)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
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
                      transition: "transform 0.15s",
                    }}
                  >
                    {wished ? "❤️" : "🤍"}
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
                    padding: "10px 12px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "700",
                      fontSize: "12px",
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
                      fontSize: "15px",
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
                        padding: "3px 8px",
                        borderRadius: "20px",
                        alignSelf: "flex-start",
                      }}
                    >
                      ✓ In Cart
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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
                      padding: "14px",
                      backgroundColor: isInCart ? "#e74c3c" : "#1a1a2e",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
                    }}
                  >
                    {isInCart ? "🗑️ Remove" : "🛒 Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "table" && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            overflowX: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "480px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#1a1a2e", color: "white" }}>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>Image</th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>Product</th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>Price</th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>Status</th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>Wishlist</th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortdata.map((item, index) => {
                const isInCart = inCart(item.id);
                const wished = isInWishlist(item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => setselectproduct(item)}
                    style={{
                      backgroundColor: isInCart
                        ? "#f0fdf4"
                        : index % 2 === 0
                          ? "#fafafa"
                          : "white",
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{
                          height: "50px",
                          width: "50px",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: "600",
                        fontSize: "13px",
                        color: "#1a1a2e",
                        maxWidth: "180px",
                      }}
                    >
                      {item.title}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: "800",
                        fontSize: "14px",
                        color: "#2ecc71",
                      }}
                    >
                      ${item.price}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {isInCart ? (
                        <span
                          style={{
                            backgroundColor: "#eafaf1",
                            color: "#2ecc71",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          ✓ In Cart
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: "#f0f0f0",
                            color: "#888",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Not Added
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={(e) => toggleWishlist(item, e)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        {wished ? "❤️" : "🤍"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
                          padding: "8px 14px",
                          backgroundColor: isInCart ? "#e74c3c" : "#1a1a2e",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isInCart ? "🗑️ Remove" : "🛒 Add"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Productlist;