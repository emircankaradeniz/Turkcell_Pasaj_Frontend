import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const { kayitOl } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (sifre.length < 6) {
    alert("Şifre en az 6 karakter olmalı!");
    return;
  }

  try {
    await kayitOl(email, sifre);
    navigate("/hesap");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};



  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <br/>
      <br/>
      <br/>
      <br/>
      <h1 className="text-xl font-bold mb-4">Kayıt Ol</h1>
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
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Kaydol
        </button>
      </form>
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
