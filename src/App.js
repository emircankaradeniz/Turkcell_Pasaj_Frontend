import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UrunDetay from "./pages/UrunDetay";
import Sepet from "./pages/Sepet";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/urun/:id" element={<UrunDetay />} />
        <Route path="/sepet" element={<Sepet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
