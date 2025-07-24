import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UrunDetay from "./pages/UrunDetay";
import Sepet from "./pages/Sepet";
import Kategori from "./pages/Kategori";
import AdminPanel from "./pages/AdminPanel";
import Giris from "./pages/Giris";
import PrivateRoute from "./routes/PrivateRoute";
import Favoriler from "./pages/Favoriler";

import { SepetProvider } from "./context/SepetContext";
import { FavoriProvider } from "./context/FavoriContext";

function App() {
  return (
    <FavoriProvider>
      <SepetProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/urun/:id" element={<UrunDetay />} />
            <Route path="/sepet" element={<Sepet />} />
            <Route path="/kategori/:isim" element={<Kategori />} />
            <Route path="/giris" element={<Giris />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route path="/favoriler" element={<Favoriler />} />
          </Routes>
        </BrowserRouter>
      </SepetProvider>
    </FavoriProvider>
  );
}

export default App;
