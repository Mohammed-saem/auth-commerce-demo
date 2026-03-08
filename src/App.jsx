// App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./product.jsx";
import Header from "./Header";
import Get from "./Get.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Get />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
