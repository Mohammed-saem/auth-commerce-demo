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
  const hidenavpath = ['/Login', '/Singup', '/Forget']
  const shouldhide = hidenavpath.includes(location.pathname);

  return (
    <>
      {!shouldhide && <Footer />}
      {!shouldhide && <Bottamnav />}
    </>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' or 'signup'
  const [onAuthSuccess, setOnAuthSuccess] = useState(null);

  // Monitor auth state changes globally
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const [card, setcard] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(card));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [card]);

  const addtocard = (data) => setcard([...card, data]);
  const removetocard = (id) => setcard(card.filter((item) => item.id !== id));

  // requireAuth wrapper
  const requireAuth = (callback, preferredTab = 'login') => {
    if (auth.currentUser || currentUser) {
      callback();
    } else {
      setOnAuthSuccess(() => callback);
      setAuthModalTab(preferredTab);
      setIsAuthModalOpen(true);
    }
  };

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
        {/* Website opens directly to the homepage (Get) instead of Login */}
        <Route path="/" element={<Get card={card} addtocard={addtocard} removetocard={removetocard} requireAuth={requireAuth} />} />
        <Route path="/Get" element={<Get card={card} addtocard={addtocard} removetocard={removetocard} requireAuth={requireAuth} />} />

        <Route path="/Card" element={<Card card={card} removetocard={removetocard} />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Singup" element={<Singup />} />
        <Route path="/Forget" element={<Forget />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Account" element={<Account card={card} addtocard={addtocard} removetocard={removetocard} requireAuth={requireAuth} />} />
      </Routes>
      <Hideauth />
      
      {/* Global premium Auth Modal */}
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