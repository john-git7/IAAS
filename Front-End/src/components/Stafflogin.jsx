import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import API from "../../Api";
import LOGO from "../assets/LOGO.png";

function StaffLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/teachers/login", formData);
      const result = res.data;

      if (result.token) {
        localStorage.clear();
        sessionStorage.clear();
        login(result.token);
        localStorage.setItem("token", result.token);
        navigate("/staff-dashboard");
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      alert("Error logging in staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[440px] animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="bg-black p-2.5 rounded-none transition-transform group-hover:invert duration-500">
               <img src={LOGO} alt="ProctorX" className="h-6 w-6 invert brightness-0" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-display uppercase">
                Proctor<span className="text-slate-400">X</span>
            </span>
          </Link>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 font-display">
            Faculty Access Protocol
          </h2>
          <h1 className="text-4xl font-black text-black font-display tracking-tight uppercase">
            Command Login
          </h1>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-none border border-black shadow-none">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Institutional Credentials</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-black" />
                <input
                  type="email"
                  name="email"
                  placeholder="STAFF@UNIVERSITY.EDU"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold tracking-tight"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">SafeKey Protocol</label>
                <a href="#" className="text-[10px] font-bold text-slate-300 hover:text-black transition-colors uppercase tracking-widest">Recovery?</a>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-black" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-none mt-6 group bg-black text-white hover:invert transition-all"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-none animate-spin"></div>
              ) : (
                <span className="flex items-center justify-center gap-2 font-bold tracking-widest">
                    Authorized Entry
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                New to the platform?{" "}
                <Link to="/staff-signup" className="font-black text-black hover:underline transition-colors uppercase">
                    Request Instructor Access
                </Link>
            </p>
          </div>
        </div>

        <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full mt-10 flex items-center justify-center gap-2 text-slate-300 hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest"
        >
            <FaArrowLeft size={10} />
            Back to institutional home
        </button>
      </div>
    </div>
  );
}

export default StaffLogin;
