import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Get from "./Get.jsx";
import Forget from "./Forget.jsx";
import Singup from "./Singup.jsx";
import Login from "./Login.jsx";
import Card from "./Card.jsx";
import Footer from "./Footer.jsx";
import Bottamnav from "./Bottamnav.jsx";
import Profile from "./Profile.jsx";



 function Hideauth(){
   const location = useLocation();
   const hidenavpath=['/','/Login','/Singup','/Forget']
   const shouldhide = hidenavpath.includes(location.pathname);

  return(
    <>
      {!shouldhide && <Footer/>}
      {!shouldhide && <Bottamnav/>}
     </>
  )
 }


function App() {
  const [card, setcard] = useState([]);
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

      </Routes>
      <Hideauth/>
   
    </BrowserRouter>
  );
}

export default App;