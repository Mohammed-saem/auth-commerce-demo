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


function Hideauth() {
  const location = useLocation();
  const hidenavpath = ['/', '/Login', '/Singup', '/Forget']
  const shouldhide = hidenavpath.includes(location.pathname);

  return (
    <>
      {!shouldhide && <Footer />}
      {!shouldhide && <Bottamnav />}
    </>
  )
}


function App() {
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

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/Get" element={<Get card={card} addtocard={addtocard} removetocard={removetocard} />} />

        <Route path="/Card" element={<Card card={card} removetocard={removetocard} />} />
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Singup" element={<Singup />} />
        <Route path="/Forget" element={<Forget />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Account" element={<Account card={card} addtocard={addtocard} removetocard={removetocard} />} />

      </Routes>
      <Hideauth />

    </BrowserRouter>
  );
}

export default App;