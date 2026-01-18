import { useState, useContext } from "react";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../../Api";
import LOGO from "../assets/LOGO.png";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/students/login", { email, password });
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[440px] animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="bg-black p-2.5 rounded-none transition-transform group-hover:invert duration-500">
               <img src={LOGO} alt="ProctorX" className="h-6 w-6 invert brightness-0" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-black font-display uppercase">
                Proctor<span className="text-slate-400">X</span>
            </span>
          </Link>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 font-display">
            Student Access Protocol
          </h2>
          <h1 className="text-4xl font-black text-black font-display tracking-tight uppercase">
            Identification
          </h1>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-none border border-black shadow-none">
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Academic Registry Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-black" />
                <input
                  type="email"
                  placeholder="ID@INSTITUTION.EDU"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold tracking-tight"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Key</label>
                <a href="#" className="text-[10px] font-bold text-slate-300 hover:text-black transition-colors uppercase tracking-widest">Recovery?</a>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-black" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <span className="flex items-center justify-center gap-3">
                    Initialize Session
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={3} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                System Entry Requirement:{" "}
                <Link to="/student-signup" className="font-black text-black hover:underline transition-colors uppercase">
                    Register Scholar
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
            Cancel Registry
        </button>
      </div>
    </div>
  );
}

// Internal helper for ArrowRight since I didn't import it from lucide here
function ArrowRight({ size, className }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
    );
}
