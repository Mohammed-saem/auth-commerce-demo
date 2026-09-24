import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Get from "./Get.jsx";
import Forget from "./Forget.jsx";
import Singup from "./Singup.jsx";
import Login from "./Login.jsx";
import Card from "./Card.jsx";
import Footer from "./Footer.jsx";
import Bottamnav from "./Bottamnav.jsx";
import Profile from "./Profile.jsx";
import Account from "./Account.jsx";
import AuthModal from "./AuthModal.jsx";
import { auth } from "./firebase";

function Hideauth() {
  const location = useLocation();

  const hidenavpath = ["/Login", "/Singup", "/Forget"];
  const shouldhide = hidenavpath.includes(location.pathname);

  return (
    <>
      {!shouldhide && <Footer />}
      {!shouldhide && <Bottamnav />}
    </>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const [onAuthSuccess, setOnAuthSuccess] = useState(null);

  // Firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);


  const [card, setcard] = useState([]);


  const addtocard = async (data) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Please log in first");
        return;
      }

      const token = await user.getIdToken();

      // Updated cart
      const updatedCart = [...card, data];

      // Fallback Backend URL (defaults to localhost if env variable is missing)
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      console.log("Backend URL:", backendUrl);
      console.log("Sending cart to backend...");
      const response = await fetch(`${backendUrl}/api/card`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: updatedCart.map((item) => ({
            productId: String(item.id),
            name: item.title,
            price: item.price,
            quantity: 1,
          })),
        }),
      });
      console.log("Backend response status:", response.status);

      const result = await response.json();

      console.log("Backend response:", result);

      if (!response.ok || !result.success) {
        console.error("Cart save error:", result);

        alert(
          result.message || "Failed to save cart to database"
        );

        return;
      }

      // Update React cart state after backend succeeds
      setcard(updatedCart);

      console.log("✅ Cart saved in database");
    } catch (error) {
      console.error("FULL ADD TO CART ERROR:", error);

      alert(
        `Failed to connect to the server: ${error.message}`
      );
    }
  };

  // Remove product from cart
  const removetocard = (id) => {
    setcard(card.filter((item) => item.id !== id));
  };

  // Require authentication
  const requireAuth = (callback, preferredTab = "login") => {
    if (auth.currentUser || currentUser) {
      callback();
    } else {
      setOnAuthSuccess(() => callback);
      setAuthModalTab(preferredTab);
      setIsAuthModalOpen(true);
    }
  };

  // Auth modal success
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);

    if (onAuthSuccess) {
      onAuthSuccess();
      setOnAuthSuccess(null);
    }
  };

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Get
              card={card}
              addtocard={addtocard}
              removetocard={removetocard}
              requireAuth={requireAuth}
            />
          }
        />

        {/* Get */}
        <Route
          path="/Get"
          element={
            <Get
              card={card}
              addtocard={addtocard}
              removetocard={removetocard}
              requireAuth={requireAuth}
            />
          }
        />

        {/* Cart */}
        <Route
          path="/Card"
          element={
            <Card
              card={card}
              removetocard={removetocard}
            />
          }
        />

        {/* Authentication */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Singup" element={<Singup />} />
        <Route path="/Forget" element={<Forget />} />

        {/* Profile */}
        <Route path="/Profile" element={<Profile />} />

        {/* Account */}
        <Route
          path="/Account"
          element={
            <Account
              card={card}
              addtocard={addtocard}
              removetocard={removetocard}
              requireAuth={requireAuth}
            />
          }
        />
      </Routes>

      {/* Footer + Bottom Navigation */}
      <Hideauth />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSuccess={handleAuthSuccess}
      />
    </BrowserRouter>
  );
}

export default App;