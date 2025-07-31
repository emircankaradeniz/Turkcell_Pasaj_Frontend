import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Giris() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const { girisYap, kullanici } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await girisYap(email, sifre);

      // 🔹 Giriş yaptıktan sonra güncel kullanıcıyı kontrol et
      if (kullanici?.rol === "admin") {
        navigate("/admin-panel");
      } else {
        navigate("/hesap");
      }
    } catch (err) {
      alert("Hatalı giriş bilgileri.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <br/>
      <br/>
      <br/>
      <br/>
      <h1 className="text-xl font-bold mb-4">Giriş Yap</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSifre(e.target.value)}
          className="border p-2 rounded"
        />
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Giriş Yap
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Hesabınız yok mu?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Kaydol
        </Link>
      </p>
      <br/>
      <br/>
      <br/>
      <br/><br/>
      <br/>
      <br/>
      <br/>
    </div>
  );
}
