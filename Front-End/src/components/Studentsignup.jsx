import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaImage, FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API from "../../Api";
import LOGO from "../assets/LOGO.png";

export default function StudentSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [squad, setSquad] = useState("");
  const [classOf, setClassOf] = useState("");
  const [department, setDepartment] = useState("");
  const [institution, setInstitution] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("squad", squad);
      formData.append("classOf", classOf);
      formData.append("department", department);
      formData.append("institution", institution);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const res = await API.post("/students/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("token", res.data.token);
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/student-login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreview(file ? URL.createObjectURL(file) : null);
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
            Student Enrollment Protocol
          </h2>
          <h1 className="text-4xl font-black text-black font-display tracking-tight uppercase">
            New Registry
          </h1>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-none border border-black shadow-none">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Full Legal Name</label>
              <div className="relative group">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  placeholder="E.G. ALEX RIVERA"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold uppercase tracking-tight"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Institutional Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                <input
                  type="email"
                  placeholder="ALEX@UNIVERSITY.EDU"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold uppercase tracking-tight"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Unit / Squad</label>
                <div className="relative group">
                  <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                  <input
                    type="text"
                    placeholder="E.G. SQUAD 81"
                    className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold uppercase tracking-tight"
                    value={squad}
                    onChange={(e) => setSquad(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Class Year</label>
                <div className="relative group">
                  <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                  <input
                    type="text"
                    placeholder="E.G. 2028"
                    className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold uppercase tracking-tight"
                    value={classOf}
                    onChange={(e) => setClassOf(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Department / Degree</label>
              <div className="relative group">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  placeholder="E.G. B.TECH COMPUTER SCIENCE"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold uppercase tracking-tight"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Institution</label>
              <div className="relative group">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  placeholder="E.G. KALASALINGAM ACADEMY"
                  className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold uppercase tracking-tight"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Protocol Key</label>
                <div className="relative group">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
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
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Verify Key</label>
                <div className="relative group">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black font-bold"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Identification Photo</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative group">
                    <FaImage className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" />
                    <input
                      type="file"
                      className="w-full pl-14 pr-6 py-4 rounded-none bg-slate-50 border border-black focus:bg-white outline-none transition-all text-black text-[10px] font-bold uppercase file:hidden"
                      onChange={handleProfileChange}
                    />
                    <span className="absolute inset-0 pointer-events-none flex items-center pl-14 text-slate-300 text-[10px] font-bold uppercase truncate pr-4">
                        {profilePicture ? profilePicture.name : "Initialize Image Stream..."}
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
                Existing Scholar Portal?{" "}
                <Link to="/student-login" className="font-black text-black hover:underline transition-colors uppercase">
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
            Cancel Registry
        </button>
      </div>
    </div>
  );
}
