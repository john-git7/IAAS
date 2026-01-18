import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaImage, FaArrowLeft } from "react-icons/fa";
import API from "../../Api";
import LOGO from "../assets/LOGO.png";
import toast, { Toaster } from "react-hot-toast";

function StaffSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      const file = e.target.files[0];
      setFormData({ ...formData, profilePicture: file });
      if (file) setPreview(URL.createObjectURL(file));
      else setPreview(null);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.profilePicture)
      data.append("profilePicture", formData.profilePicture);

    try {
      const res = await API.post("/teachers/signup", data);
      if (res.status >= 200 && res.status < 300) {
        toast.success("Faculty account created!");
        setTimeout(() => navigate("/staff-login"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-12 relative overflow-hidden">
      <Toaster />
      <div className="w-full max-w-[500px] animate-fade-in">
        {/* Header */}
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
            Faculty Enrollment Protocol
          </h2>
          <h1 className="text-4xl font-black text-black font-display tracking-tight uppercase">
            New Registry
          </h1>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-none border border-black shadow-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Full Legal Name</label>
              <div className="relative group">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="DR. JANE SMITH"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold uppercase tracking-tight"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Institutional Credentials</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="STAFF@UNIVERSITY.EDU"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold uppercase tracking-tight"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Protocol Key</label>
              <div className="relative group">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
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

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Verification Identity (Photo)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative group">
                    <FaImage className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                    <input
                      type="file"
                      name="profilePicture"
                      className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black text-[10px] font-bold uppercase file:hidden"
                      onChange={handleChange}
                    />
                    <span className="absolute inset-0 pointer-events-none flex items-center pl-14 text-slate-300 text-[10px] font-bold uppercase truncate pr-4">
                        {formData.profilePicture ? formData.profilePicture.name : "Initialize Image Stream..."}
                    </span>
                </div>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-14 h-14 rounded-none object-cover border border-black grayscale"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-none mt-6 bg-black text-white hover:invert transition-all"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-none animate-spin mx-auto"></div>
              ) : "Initialize Registry Access"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Existing Faculty Portal?{" "}
                <Link to="/staff-login" className="font-black text-black hover:underline transition-colors uppercase">
                    Establish Entry
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

export default StaffSignup;
