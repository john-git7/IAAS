import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Loader2, AlertCircle, BookOpen, Star, Award, ArrowRight, ShieldCheck, LayoutDashboard, LogOut, Home, GraduationCap } from 'lucide-react';
import API from "../../Api";
import LOGO from "../assets/LOGO.png";

const Loader = ({ message = "LOADING ACADEMIC PROFILE..." }) => (
  <div className="flex flex-col items-center justify-center gap-6 py-24">
    <Loader2 className="w-12 h-12 animate-spin text-black" />
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{message}</p>
  </div>
);

const Card = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white border border-black p-8 ${className}`}
    {...props}
  >
    {children}
  </div>
));

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white p-8 rounded-none border border-black flex items-center justify-between group hover:bg-black hover:text-white transition-all duration-300">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-slate-400">{title}</p>
      <p className="text-4xl font-bold font-display">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">{subtitle}</p>}
    </div>
    <div className={`p-4 rounded-none bg-slate-50 border border-black text-black group-hover:bg-white`}>{icon}</div>
  </div>
);

const CustomCalendar = ({ highlightedDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const changeMonth = (offset) => setCurrentDate(new Date(year, month + offset, 1));

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = new Date(year, month, day).toDateString();
    const todayStr = new Date().toDateString();
    const isHighlighted = highlightedDates.includes(dateStr);
    const isToday = dateStr === todayStr;
    calendarDays.push(
      <div key={day} className={`flex items-center justify-center h-8 w-8 rounded-none text-xs transition-colors ${isHighlighted ? 'bg-black text-white font-bold border border-black' : isToday ? 'bg-slate-100 text-black font-bold border border-black' : 'text-slate-400 hover:bg-slate-50'}`}>{day}</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => changeMonth(-1)} className="text-slate-400 hover:text-black p-1 transition-colors">&lt;</button>
        <h3 className="font-bold text-black text-xs uppercase tracking-widest">{currentDate.toLocaleString('default', { month: 'long' })} {year}</h3>
        <button onClick={() => changeMonth(1)} className="text-slate-400 hover:text-black p-1 transition-colors">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-display">
        {daysOfWeek.map(day => <div key={day} className="font-bold text-[9px] text-slate-300 uppercase tracking-widest pb-3">{day}</div>)}
        {calendarDays}
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllResults, setShowAllResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization required.");
      setLoading(false);
      navigate("/student-login");
      return;
    }

    const fetchProfileAndResults = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, resultsRes] = await Promise.all([
          API.get("/students/me", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/api/results/my-results", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProfile(profileRes.data);
        setQuizzes(Array.isArray(resultsRes.data) ? resultsRes.data : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndResults();
  }, [navigate]);

  const summaryStats = useMemo(() => {
    if (!Array.isArray(quizzes) || quizzes.length === 0) return { totalQuizzes: 0, averageScore: "0.0", bestScore: "0.0" };
    const validQuizzes = quizzes.filter(q => typeof q.accuracy === 'number');
    if (validQuizzes.length === 0) return { totalQuizzes: quizzes.length, averageScore: "0.0", bestScore: "0.0" };

    const totalQuizzes = quizzes.length;
    const averageScore = (validQuizzes.reduce((acc, q) => acc + q.accuracy, 0) / validQuizzes.length).toFixed(1);
    const bestScore = Math.max(...validQuizzes.map(q => q.accuracy)).toFixed(1);
    return { totalQuizzes, averageScore, bestScore };
  }, [quizzes]);

  const chartData = useMemo(() =>
    Array.isArray(quizzes) ? quizzes
      .filter(q => q.completedAt)
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
      .slice(-10)
      .map(q => ({
        date: new Date(q.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        Score: q.accuracy ?? 0,
      })) : [],
    [quizzes]
  );

  const quizDates = useMemo(() => Array.isArray(quizzes) ? quizzes.map(q => new Date(q.completedAt).toDateString()) : [], [quizzes]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]"><Loader /></div>;

  if (error && !profile)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfd] p-8 text-center animate-fade-in">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Session Error</h2>
        <p className="text-slate-500 mb-8 max-w-sm">{error}</p>
        <button onClick={() => navigate('/student-login')} className="btn-primary">Return to Login</button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] text-slate-900">
      {/* Premium Header */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-black h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-black p-2 rounded-none transition-transform group-hover:invert duration-500">
               <img src={LOGO} alt="ProctorX" className="h-6 w-6 invert brightness-0" />
            </div>
            <span className="text-xl font-bold tracking-tight text-black font-display uppercase">
                Proctor<span className="text-slate-400">X</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-black transition-all font-bold text-[10px] uppercase tracking-widest">
              <Home size={16} />
              <span className="hidden sm:inline">Portal</span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-black transition-all font-bold text-[10px] uppercase tracking-widest">
              <LogOut size={16} />
              <span className="hidden sm:inline">TERMINATION</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-10 pt-32 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="inline-block px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] mb-4">STUDENT ACCESS</div>
            <h1 className="text-4xl font-bold text-slate-900 font-display uppercase tracking-tight">Welcome, <span className="text-slate-400">{profile?.name?.split(' ')[0] || 'Scholar'}</span></h1>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-[0.1em] leading-loose">Academic assessments • Performance analytics • Real-time Compliance establishes.</p>
          </div>
          {profile && (
            <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-none border border-black">
                <img 
                    src={profile.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=000&color=fff&bold=true`} 
                    alt="Current Profile" 
                    className="w-12 h-12 rounded-none object-cover border border-black grayscale" 
                />
                <div>
                    <h3 className="font-bold text-slate-900 leading-none uppercase text-xs">{profile.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">{profile.email}</p>
                </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <StatCard icon={<BookOpen className="w-6 h-6" />} title="Total Assessments" value={summaryStats.totalQuizzes} />
          <StatCard icon={<Star className="w-6 h-6" />} title="Average Performance" value={`${summaryStats.averageScore}%`} />
          <StatCard icon={<Award className="w-6 h-6" />} title="Highest Attainment" value={`${summaryStats.bestScore}%`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <Card className="lg:col-span-2 shadow-none">
            <h2 className="text-xl font-bold text-slate-800 mb-8 font-display flex items-center gap-2 uppercase tracking-tight">
                <TrendingUpIcon size={20} className="text-black" />
                Performance Evolution
            </h2>
            {chartData.length > 1 ? (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        fontWeight={600}
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                    />
                    <YAxis 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        fontWeight={600}
                        unit="%" 
                        domain={[0, 100]} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#000000",
                        borderRadius: '0',
                        padding: '12px 16px',
                        boxShadow: 'none',
                        border: '1px solid #000000'
                      }}
                      itemStyle={{ color: '#000000', fontWeight: 'bold' }}
                      formatter={(value) => [`${value.toFixed(1)}% Accuracy`]}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="Score" 
                        stroke="#000000" 
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                        strokeWidth={4} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[320px] flex flex-col items-center justify-center text-slate-300 gap-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <div className="p-3 bg-white rounded-full shadow-sm">
                    <LayoutDashboard size={32} className="text-slate-200" />
                </div>
                <p className="text-sm font-medium">Insufficient data for trend analysis</p>
              </div>
            )}
          </Card>
          
          <Card className="shadow-none">
            <h3 className="text-xl font-bold text-slate-800 mb-8 font-display flex items-center gap-2 uppercase tracking-tight">
                <CalendarIcon size={20} className="text-black" />
                Activity Log
            </h3>
            <CustomCalendar highlightedDates={quizDates} />
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display flex items-center justify-between uppercase tracking-tight">
                <span>Academic Record</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{quizzes.length} Entries</span>
            </h2>
            {quizzes.length === 0 ? (
              <Card className="text-center py-20 text-slate-400 bg-white border-dashed">
                  No assessment history found.
              </Card>
            ) : (
              <div className="space-y-4">
                {(showAllResults ? quizzes : quizzes.slice(0, 5)).map((quizResult) => {
                  const accuracy = quizResult.accuracy ?? 0;
                  const getStatusColors = (acc) => {
                    if (acc >= 80) return { bg: 'bg-black', text: 'text-white', border: 'border-black' };
                    return { bg: 'bg-white', text: 'text-black', border: 'border-black' };
                  };
                  const colors = getStatusColors(accuracy);
                  
                  return (
                    <div 
                        key={quizResult._id} 
                        className="bg-white p-2 rounded-none border border-black hover:bg-slate-50 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                        onClick={() => navigate(`/results/${quizResult._id}`)}
                    >
                      <div className="flex items-center gap-5 p-4">
                        <div className={`p-4 rounded-none ${colors.bg} ${colors.text} flex-shrink-0 border border-black`}>
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-black transition-colors font-display line-clamp-1 uppercase tracking-tight">{quizResult.quiz?.title || "Standard Assessment"}</h3>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              <span className="flex items-center gap-1"><BookOpen size={12} /> {quizResult.quiz?.category || 'General'}</span>
                              <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                              <span>{new Date(quizResult.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 px-6 py-4 bg-slate-50/50 md:bg-transparent rounded-none md:min-w-[280px] justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                          <p className={`text-lg font-bold font-display text-black`}>
                            {quizResult.score || 0} <span className="text-slate-300 font-normal">pts</span>
                          </p>
                        </div>
                        <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                          <div className={`px-2.5 py-1 rounded-none border font-bold text-sm ${colors.bg === 'bg-black' ? 'bg-black text-white' : 'bg-white text-black'} border-black`}>
                            {accuracy.toFixed(1)}%
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-black transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
                
                {quizzes.length > 5 && (
                  <button 
                    onClick={() => setShowAllResults(!showAllResults)} 
                    className="w-full py-4 text-[10px] font-bold text-black border border-black rounded-none hover:bg-black hover:text-white transition-all focus:outline-none uppercase tracking-widest"
                  >
                    {showAllResults ? "Collapse Record" : `View Full Record (${quizzes.length})`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="mt-20 py-10 text-center border-t border-slate-50 opacity-40 grayscale">
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <GraduationCap size={16} />
            <span className="text-xs font-bold uppercase tracking-[0.2em] font-display">Academic Authentication Platform</span>
          </div>
      </footer>
    </div>
  );
};

// SVG Helpers
const TrendingUpIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

const CalendarIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

export default StudentDashboard;