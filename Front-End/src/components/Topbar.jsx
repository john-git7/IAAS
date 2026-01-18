import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { GraduationCap, Users, User, Search as SearchIcon, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/Input";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API from "../../Api";
import LOGO from "../assets/LOGO.png";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { user, logout } = useAuth();

  const runSearch = async (query) => {
    if (!query) {
      setQuizzes([]);
      setError("");
      setIsDropdownVisible(false);
      return;
    }
    setLoading(true);
    setError("");
    setQuizzes([]);
    setIsDropdownVisible(true);
    try {
      let foundQuizzes = [];
      if (query.toUpperCase().startsWith("QZ")) {
        const res = await API.get(`/api/quizzes/public/${query}`);
        if (res.data && res.data.quizId) foundQuizzes = [res.data];
      } else {
        const res = await API.get("/api/quizzes/public");
        const data = Array.isArray(res.data) ? res.data : [];
        foundQuizzes = data.filter((quiz) =>
          quiz.title?.toLowerCase().includes(query.toLowerCase())
        );
      }
      setQuizzes(foundQuizzes);
    } catch (err) {
      console.error("Error searching quizzes:", err);
      setError("No quizzes found or invalid code.");
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery) runSearch(debouncedSearchQuery);
    else {
      setQuizzes([]);
      setError("");
      setIsDropdownVisible(false);
    }
  }, [debouncedSearchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(searchQuery);
  };

  const handleQuizClick = (quizId) => {
    navigate(`/exam/${quizId}`);
    setSearchQuery("");
    setIsDropdownVisible(false);
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-black h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-8">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 shrink-0 group">
              <div className="bg-black p-2.5 rounded-none transition-transform group-hover:invert duration-500">
                <img src={LOGO} alt="ProctorX" className="h-6 w-6 invert brightness-0" />
              </div>
              <span className="text-xl font-bold tracking-tight text-black font-display uppercase">
                Proctor<span className="text-slate-400">X</span>
              </span>
            </Link>

            {/* Search Section */}
            <div className="hidden md:flex relative flex-1 max-w-lg">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="relative group">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-black" />
                  <input
                    type="text"
                    placeholder="ENTER ASSESSMENT CODE (QZ...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-black rounded-none text-black placeholder:text-slate-300 focus:bg-white transition-all text-[10px] font-bold uppercase tracking-widest outline-none"
                  />
                </div>
              </form>

              {isDropdownVisible && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-none border border-black shadow-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  {loading ? (
                    <div className="p-6 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-none border-2 border-black border-r-transparent" role="status"></div>
                    </div>
                  ) : quizzes.length > 0 ? (
                    <div className="divide-y divide-black">
                      {quizzes.map((quiz) => (
                        <div
                          key={quiz.quizId}
                          onClick={() => handleQuizClick(quiz.quizId)}
                          className="p-4 hover:bg-black hover:text-white cursor-pointer transition-all"
                        >
                          <h3 className="font-bold text-black group-hover:text-white text-xs uppercase tracking-tight">{quiz.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                {quiz.quizId}
                            </span>
                            {quiz.createdBy && (
                              <span className="text-[9px] text-slate-400 font-bold uppercase">
                                • {quiz.createdBy.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        {error || "PROTOCOL MISMATCH: RE-ENTER CODE"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Link to="/staff-login" className="hidden sm:block">
                    <button className="text-[10px] font-bold text-slate-400 hover:text-black uppercase tracking-[0.2em] transition-colors px-4 py-2">
                      Teach
                    </button>
                  </Link>
                  <Link to="/student-login">
                    <button className="btn-primary py-2.5 px-8 text-[10px] uppercase font-bold tracking-widest">
                      Login
                    </button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {user.role === "student" && (
                    <Link to="/student-profile">
                      <button className="btn-secondary flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2.5 px-6">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="hidden lg:inline">Dashboard</span>
                      </button>
                    </Link>
                  )}
                  {user.role === "teacher" && (
                    <Link to="/staff-dashboard">
                      <button className="btn-primary flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2.5 px-6 shadow-none">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="hidden lg:inline">Manage</span>
                      </button>
                    </Link>
                  )}
                  <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                  <button
                    className="p-2 text-slate-400 hover:text-black transition-all"
                    onClick={logout}
                    title="TERMINATE SESSION"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </div>
  );
}
