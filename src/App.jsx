import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./product.jsx";
import Header from "./Header";
import Get from "./Get.jsx";
import Forget from "./Forget.jsx";
import Singup from "./Singup.jsx";
import Login from "./Login.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />
        <Route path="/Singup" element={<Singup />} />
        <Route path="/forget" element={<Forget />} />
          <Route path="/Get" element={<Get />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
