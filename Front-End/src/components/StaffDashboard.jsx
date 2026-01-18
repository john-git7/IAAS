import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from "../../Api";
import LOGO from "../assets/LOGO.png";
import { Plus, Users, BookOpen, BarChart3, LogOut, Clock, Target, TrendingUp, Home, ArrowLeft, AlertCircle, Check, X, Loader2, Save, Code, FileText, CheckSquare, GraduationCap, LayoutGrid, Calendar, Trash2, Copy, Edit3, Layers, Share2, Award, Search, Filter, Bell, Settings, ShieldCheck, ChevronRight } from "lucide-react";

// --- Internal Helper Components ---
function Toast({ message, type }) {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-none shadow-2xl text-[11px] font-bold z-[100] border uppercase tracking-widest ${type === "success" ? "bg-black border-black text-white" : "bg-white border-black text-black"}`}
        >
            <div className="flex items-center gap-3">
                {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                {message}
            </div>
        </motion.div>
    );
}

const CircularStat = ({ label, textValue, percentageValue, color }) => {
    return (
        <div className="flex flex-col items-center space-y-4 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 relative">
                <CircularProgressbar
                    value={percentageValue}
                    text={`${textValue}`}
                    styles={buildStyles({
                        textSize: '22px',
                        pathColor: color,
                        textColor: '#0f172a',
                        trailColor: '#f1f5f9',
                        strokeLinecap: 'round',
                        pathTransitionDuration: 1.5
                    })}
                />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center group-hover:text-black transition-colors">{label}</div>
        </div>
    );
};

const StatCard = ({ title, value, subtitle, icon, iconBgColor, trend }) => {
    return (
        <div className="bg-white p-8 rounded-none border border-black shadow-none relative overflow-hidden group hover:bg-black hover:text-white transition-all duration-300">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${iconBgColor} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                        {icon}
                    </div>
                    {trend && (
                        <div className={`px-2 py-1 rounded-none text-[9px] font-bold border flex items-center gap-1 ${trend.positive ? 'bg-black text-white border-black' : 'bg-white text-black border-black'}`}>
                            {trend.positive ? '+' : '-'}{trend.value}%
                        </div>
                    )}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold font-display tracking-tight">{value}</p>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">{subtitle}</p>
            </div>
            {/* Decorative background icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:rotate-12 transform">
                {React.cloneElement(icon, { size: 120 })}
            </div>
        </div>
    );
};

const QuestionDetailItem = ({ q, index }) => {
    const [activeLang, setActiveLang] = useState('javascript');
    const languages = ["javascript", "python", "java", "cpp"];

    return (
        <li className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-none bg-black text-white flex items-center justify-center font-bold text-xs">
                        {index + 1}
                    </span>
                    <p className="font-bold text-slate-900 font-display flex items-center gap-2">
                        {q.questionType === "mcq" && <CheckSquare className="h-4 w-4 text-emerald-500" />}
                        {q.questionType === "coding" && <Code className="h-4 w-4 text-indigo-500" />}
                        {q.questionType === "descriptive" && <FileText className="h-4 w-4 text-sky-500" />}
                        {q.questionText}
                    </p>
                </div>
                <span className="text-[10px] font-bold bg-white text-slate-400 px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest shadow-sm">
                    {q.questionType} • {q.marks} Marks
                </span>
            </div>

            {q.questionType === 'mcq' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {q.options?.map((opt, idx) => (
                        <div key={idx} className={`p-3 rounded-xl border text-sm flex justify-between items-center transition-all ${q.correctAnswer == idx ? "bg-emerald-50 border-emerald-100 text-emerald-700 font-bold" : "bg-white border-slate-100 text-slate-500"}`}>
                            <span>{opt}</span>
                            {q.correctAnswer == idx && <span className="text-[9px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-widest">Answer</span>}
                        </div>
                    ))}
                </div>
            )}

            {q.questionType === 'descriptive' && (
                <div className="mt-4 bg-white p-4 rounded-xl border border-slate-100">
                    <p className="text-[9px] text-slate-300 mb-2 uppercase font-bold tracking-[0.2em]">Ideal Solution Template</p>
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{q.descriptiveAnswer || "No template provided."}"</p>
                </div>
            )}

            {q.questionType === 'coding' && (
                <div className="mt-4">
                    <div className="flex gap-2 mb-3">
                        {languages.map(lang => (
                            <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-none border transition-all ${activeLang === lang ? "bg-black border-black text-white" : "bg-white border-slate-200 text-slate-400 hover:border-black hover:text-black"}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    <div className="bg-black p-4 rounded-none border border-black overflow-x-auto">
                        <p className="text-[9px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Boilerplate ({activeLang})</p>
                        <pre className="text-xs text-white font-mono leading-relaxed">
                            {q.starterCode && typeof q.starterCode === 'object'
                                ? q.starterCode[activeLang] || "// No starter code"
                                : q.starterCode || "// No starter code"}
                        </pre>
                    </div>
                </div>
            )}
        </li>
    );
};

const QuestionPalette = ({ responses }) => (
    <div className="w-full p-6 bg-white border border-slate-100 rounded-3xl mb-8 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Submission Map</h3>
        <div className="flex flex-wrap gap-2">
            {responses.map((res, index) => {
                let colorClass = 'bg-rose-100 text-rose-600 border-rose-200';
                if (res.questionType?.toLowerCase() === 'descriptive') {
                    colorClass = 'bg-sky-100 text-sky-600 border-sky-200';
                } else if (res.isCorrect) {
                   colorClass = 'bg-emerald-100 text-emerald-600 border-emerald-200';
                } else if (res.questionType?.toLowerCase() === 'coding') {
                    const passed = res.testcases?.filter(tc => tc.passed).length || 0;
                    if (passed > 0) colorClass = passed === res.testcases?.length ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-amber-100 text-amber-600 border-amber-200';
                }

                return (
                    <a
                        key={index}
                        href={`#q-${index + 1}`}
                        className={`flex items-center justify-center h-10 w-10 rounded-xl font-bold text-sm border transition-all hover:scale-110 active:scale-95 ${colorClass}`}
                    >
                        {index + 1}
                    </a>
                );
            })}
        </div>
    </div>
);

const QuestionCard = ({ response, index, onUpdateMarks }) => {
    const { questionText, options, studentAnswer, correctAnswer, isCorrect, questionType, marks, obtainedMarks } = response;
    const [manualMarks, setManualMarks] = useState(obtainedMarks || 0);

    useEffect(() => {
        setManualMarks(obtainedMarks || 0);
    }, [obtainedMarks]);

    return (
        <motion.div
            id={`q-${index + 1}`}
            className="p-8 bg-white border border-slate-100 rounded-[2.5rem] mb-8 shadow-xl shadow-slate-100/50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2 mb-3">
                         <span className="text-[10px] font-bold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 uppercase tracking-widest shadow-sm">
                            {questionType}
                        </span>
                        <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100 uppercase tracking-widest shadow-sm">
                           Max {response.marks || 0} pts
                        </span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 font-display leading-tight">
                        <span className="text-indigo-600/30 font-black mr-2">#{index + 1}</span> {questionText}
                    </p>
                </div>
                {questionType?.toLowerCase() === 'descriptive' ? (
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100"><AlertCircle size={28} /></div>
                ) : isCorrect ? (
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><Check size={28} /></div>
                ) : (
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100"><X size={28} /></div>
                )}
            </div>

            {questionType === 'mcq' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {options?.map((option, optIndex) => {
                        const isSelectedAnswer = option === studentAnswer;
                        const isCorrectAnswer = option === correctAnswer;

                        let stateClass = "border-slate-100 bg-slate-50 text-slate-400";
                        if (isCorrectAnswer) {
                            stateClass = "border-emerald-100 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-50 font-bold";
                        } else if (isSelectedAnswer && !isCorrectAnswer) {
                            stateClass = "border-rose-100 bg-rose-50 text-rose-700 font-bold";
                        }

                        return (
                            <div key={optIndex} className={`p-4 border rounded-2xl flex items-center justify-between transition-all duration-300 ${stateClass}`}>
                                <span>{option}</span>
                                {isSelectedAnswer && (
                                    <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-slate-900 text-white uppercase tracking-widest">
                                        Selected
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {(questionType?.toLowerCase() === 'coding' || response.testcases?.length > 0) && (
                <div className="space-y-4">
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-inner">
                        <p className="text-[10px] text-slate-500 mb-3 uppercase font-bold tracking-widest">Submission Artifact</p>
                        <pre className="text-sm font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed">{response.codeSubmitted || "// No code submitted"}</pre>
                    </div>
                    {response.testcases && response.testcases.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                            {response.testcases.map((tc, idx) => (
                                <div key={idx} className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${tc.passed ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-rose-100 bg-rose-50 text-rose-600'}`}>
                                    <span className="text-[9px] font-bold uppercase opacity-60">TEST {idx + 1}</span>
                                    {tc.passed ? <Check size={14} strokeWidth={4} /> : <X size={14} strokeWidth={4} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {questionType?.toLowerCase() === 'descriptive' && (
                <div className="mt-6 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest mb-4">Student Response</div>
                        <div className="text-base text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{studentAnswer || "No answer provided"}</div>
                    </div>

                    {response.isEvaluated && !response.isEditingManual ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-lg shadow-emerald-50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100">
                                    <Check size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest">Evaluation Verified</p>
                                    <p className="text-lg text-slate-900 font-display">Student awarded <span className="text-emerald-600">{obtainedMarks}</span> / {marks} marks.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdateMarks(index, manualMarks, true)}
                                className="px-4 py-2 border border-emerald-200 text-emerald-700 rounded-xl font-bold text-xs uppercase hover:bg-white transition-all active:scale-95"
                            >
                                Re-evaluate
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex-1">
                                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-3 tracking-widest">Award Marks</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        max={marks}
                                        min="0"
                                        value={manualMarks}
                                        onChange={(e) => setManualMarks(e.target.value)}
                                        className="bg-white border border-black rounded-none px-5 py-3 w-28 text-slate-900 font-display text-xl font-bold focus:border-black focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                                    />
                                    <span className="text-slate-400 text-lg font-bold">/ {marks} Points</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdateMarks(index, manualMarks, false)}
                                className="w-full sm:w-auto btn-primary py-4 px-8"
                            >
                                {response.isEditingManual ? 'FINALISE EVALUATION' : 'SUBMIT ASSESSMENT'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default function TeacherDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizLoading, setQuizLoading] = useState(false);
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [otpTimers, setOtpTimers] = useState({});
    const [toast, setToast] = useState(null);
    const [stats, setStats] = useState({ totalAttempts: '...' });
    const [viewingResultsOf, setViewingResultsOf] = useState(null);
    const [resultsData, setResultsData] = useState([]);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [selectedResultDetail, setSelectedResultDetail] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchQuizzes();
        fetchStats();
    }, []);

    useEffect(() => {
        if (user) fetchTeacherInfo();
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const updatedTimers = {};
            if (Array.isArray(quizzes)) {
                quizzes.forEach((quiz) => {
                    if (quiz && quiz.otpExpiresAt) {
                        const diff = new Date(quiz.otpExpiresAt).getTime() - now;
                        updatedTimers[quiz.quizId] = diff > 0 ? diff : 0;
                    }
                });
            }
            setOtpTimers(updatedTimers);
        }, 1000);
        return () => clearInterval(interval);
    }, [quizzes]);

    const showToast = (message, type = "success") => setToast({ message, type });
    const handleLogout = () => { localStorage.clear(); navigate("/"); };

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/api/quizzes", { headers: { Authorization: `Bearer ${token}` } });
            setQuizzes(Array.isArray(res.data) ? res.data : []);
        } catch {
            setQuizzes([]);
            showToast("Failed to fetch quizzes", "error");
        } finally { setLoading(false); }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/api/results/teacher-stats", { headers: { Authorization: `Bearer ${token}` } });
            setStats(res.data);
        } catch { setStats({ totalAttempts: 0, averageScore: '0%', successRate: '0%', quizStats: {} }); }
    }

    const fetchTeacherInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/teachers/details", { headers: { Authorization: `Bearer ${token}` } });
            setTeacherInfo(res.data[0]);
        } catch { setTeacherInfo(null); }
    };

    const handleQuizClick = async (quizId) => {
        setQuizLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await API.get(`/api/quizzes/${quizId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedQuiz(res.data);
        } catch { showToast("Failed to load quiz", "error"); } finally { setQuizLoading(false); }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm("Delete this assessment?")) return;
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/api/quizzes/${quizId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedQuiz(null);
            fetchQuizzes();
            showToast("Assessment removed");
        } catch { showToast("Delete failed", "error"); }
    };

    const handleDuplicate = async (quizId) => {
        try {
            const token = localStorage.getItem("token");
            await API.post(`/api/quizzes/${quizId}/duplicate`, {}, { headers: { Authorization: `Bearer ${token}` } });
            showToast("Assessment Duplicated");
            fetchQuizzes();
        } catch { showToast("Duplicate failed", "error"); }
    };

    const handleViewResults = async (quiz) => {
        setResultsLoading(true);
        setViewingResultsOf(quiz);
        setSelectedResultDetail(null);
        try {
            const token = localStorage.getItem("token");
            const res = await API.get(`/api/results/quiz/${quiz.quizId}`, { headers: { Authorization: `Bearer ${token}` } });
            setResultsData(Array.isArray(res.data) ? res.data : []);
        } catch { setResultsData([]); } finally { setResultsLoading(false); }
    };

    const handleGenerateOtp = async (quizId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.post(`/api/quizzes/${quizId}/generate-otp`, {}, { headers: { Authorization: `Bearer ${token}` } });
            showToast("New Security Key Issued");
            fetchQuizzes();
            if (selectedQuiz) handleQuizClick(quizId);
        } catch { showToast("Generation failed", "error"); }
    };

    const handleUpdateMarks = async (responseIndex, newMarks, isEditingToggle = false) => {
        if (!selectedResultDetail) return;
        if (isEditingToggle) {
            setSelectedResultDetail(prev => ({
                ...prev,
                responses: prev.responses.map((r, i) => i === responseIndex ? { ...r, isEditingManual: true } : r)
            }));
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await API.post(`/api/results/${selectedResultDetail._id}/update-marks`, {
                responseIndex, marks: Number(newMarks)
            }, { headers: { Authorization: `Bearer ${token}` } });
            showToast("Submission Re-graded Successfully");
            setSelectedResultDetail(res.data);
            handleViewResults(viewingResultsOf);
        } catch { showToast("Regrade failed", "error"); }
    };

    const filteredQuizzes = useMemo(() => {
        if (!Array.isArray(quizzes)) return [];
        return quizzes
            .filter(quiz => quiz && (statusFilter === 'all' || quiz.status === statusFilter))
            .filter(quiz => quiz && quiz.title && quiz.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [quizzes, searchTerm, statusFilter]);

    const formatTime = (ms) => {
        if (typeof ms !== 'number' || ms <= 0) return "EXPIRED";
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const renderQuizDetail = () => {
        if (!selectedQuiz) return null;
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedQuiz(null)} className="h-10 w-10 rounded-none bg-white border border-black shadow-none flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                 <GraduationCap size={12} className="text-black" />
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Management</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">{selectedQuiz.title}</h2>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                     <div className="xl:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="bg-white p-6 rounded-none border border-black">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Registry ID</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-lg font-bold text-slate-700">{selectedQuiz.quizId}</span>
                                    <button onClick={() => {navigator.clipboard.writeText(selectedQuiz.quizId); showToast("Copied ID")}} className="p-2 text-slate-300 hover:text-black transition-colors"><Copy size={16} /></button>
                                </div>
                             </div>
                             <div className="bg-white p-6 rounded-none border border-black">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</p>
                                <div className="flex items-center gap-3">
                                    <div className={`h-2.5 w-2.5 rounded-full ${selectedQuiz.status === 'active' ? 'bg-black shadow-[0_0_8px_rgba(0,0,0,0.3)]' : 'bg-slate-300'}`}></div>
                                    <span className="font-bold font-display text-lg uppercase tracking-tight text-slate-700">{selectedQuiz.status}</span>
                                </div>
                             </div>
                        </div>

                        <div className="bg-white p-8 rounded-none border border-black">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold font-display text-slate-900 uppercase tracking-tight">Curriculum / {selectedQuiz.questions?.length}</h3>
                                <button onClick={() => navigate(`/edit-quiz/${selectedQuiz.quizId}`)} className="flex items-center gap-2 px-4 py-2 border border-black bg-white text-black rounded-none font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-black hover:text-white">
                                    <Edit3 size={14} /> Structural Edit
                                </button>
                            </div>
                            <ul className="space-y-4">
                                {selectedQuiz.questions?.map((q, i) => <QuestionDetailItem key={i} q={q} index={i} />)}
                            </ul>
                        </div>
                     </div>

                     <div className="space-y-8">
                         <div className="bg-white p-8 rounded-none border border-black text-center">
                             <div className="p-4 bg-slate-50 rounded-none inline-block mb-4 border border-black">
                                <ShieldCheck size={32} className="text-black" />
                             </div>
                             <h4 className="font-bold text-slate-900 font-display mb-2 uppercase tracking-tight">Security Protocol</h4>
                             <p className="text-[11px] text-slate-400 mb-6 leading-relaxed font-bold">TEMPORARY AUTHORISATION KEY</p>
                             
                             {selectedQuiz.otp ? (
                                <div className="space-y-4">
                                    <div className="bg-black border border-black rounded-none py-6 relative overflow-hidden group">
                                         <div className="relative z-10 font-mono text-4xl font-bold text-white tracking-[0.2em]">{selectedQuiz.otp}</div>
                                         <div className="mt-2 text-[9px] font-bold text-slate-400 tracking-[0.3em] uppercase">{formatTime(otpTimers[selectedQuiz.quizId])} REMAINING</div>
                                    </div>
                                    <button onClick={() => handleGenerateOtp(selectedQuiz.quizId)} className="w-full h-12 rounded-none border border-black text-black text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Rotate Key</button>
                                </div>
                             ) : (
                                <button onClick={() => handleGenerateOtp(selectedQuiz.quizId)} className="btn-primary w-full h-14 rounded-none text-[10px] font-bold uppercase tracking-widest">Generate Access Key</button>
                             )}
                         </div>

                         <div className="bg-white p-8 rounded-none border border-black">
                             <h4 className="font-bold text-slate-900 font-display mb-6 uppercase tracking-tight">Governance</h4>
                             <div className="space-y-2">
                                <button onClick={() => handleDuplicate(selectedQuiz.quizId)} className="w-full flex items-center justify-between p-4 rounded-none bg-slate-50 border border-transparent hover:border-black transition-all group">
                                    <div className="flex items-center gap-3 text-slate-500 group-hover:text-black transition-colors font-bold text-[10px] uppercase tracking-widest"><Layers size={16} /> Clone Portfolio</div>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-black transition-all" />
                                </button>
                                <div className="h-px bg-slate-100 my-4"></div>
                                <button onClick={() => handleDeleteQuiz(selectedQuiz.quizId)} className="w-full flex items-center gap-3 p-4 rounded-none bg-white border border-black text-black font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                    <Trash2 size={16} /> Purge Record
                                </button>
                             </div>
                         </div>
                     </div>
                </div>
            </motion.div>
        );
    };

    const renderResultDetail = () => {
        if (!selectedResultDetail) return null;
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
                <div className="flex flex-col xl:flex-row gap-8">
                     <aside className="w-full xl:w-96 space-y-8">
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 h-fit">
                            <button onClick={() => setSelectedResultDetail(null)} className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
                                <ArrowLeft size={16} /> Summary Grid
                            </button>
                            
                            <div className="flex flex-col items-center text-center mb-10">
                                <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 shadow-inner">
                                    <GraduationCap size={32} className="text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 font-display leading-tight">{selectedResultDetail.user?.name || 'Academic Holder'}</h3>
                                <p className="text-[11px] text-slate-400 font-medium mt-1 truncate max-w-full">{selectedResultDetail.user?.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-4">
                                <CircularStat label="Net Score" textValue={selectedResultDetail.score} percentageValue={(selectedResultDetail.score/selectedResultDetail.totalQuestions)*100} color="#4f46e5" />
                                <CircularStat label="Accuracy" textValue={`${Math.round(selectedResultDetail.accuracy)}%`} percentageValue={selectedResultDetail.accuracy} color="#10b981" />
                            </div>
                            <div className="h-px bg-slate-50 my-8"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Items</p>
                                    <p className="text-xl font-black text-slate-900 font-display">{selectedResultDetail.responses?.length}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Rank</p>
                                    <p className="text-xl font-black text-amber-500 font-display">A+</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black border border-black rounded-none p-8 text-white relative group">
                             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 relative z-10">Verification Integrity</h4>
                             <div className="space-y-4 relative z-10">
                                 <div className="flex items-center justify-between">
                                     <span className="text-xs text-slate-400">Timestamp</span>
                                     <span className="text-xs font-bold font-mono">{new Date(selectedResultDetail.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <div className="flex items-center justify-between">
                                     <span className="text-xs text-slate-400">Status</span>
                                     <span className="text-xs font-bold text-white uppercase tracking-widest">Certified</span>
                                 </div>
                             </div>
                             <ShieldCheck className="absolute -right-6 -bottom-6 text-white/5 group-hover:rotate-12 transition-transform duration-700" size={140} />
                        </div>
                     </aside>

                     <div className="flex-1 min-w-0 space-y-8">
                         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-lg shadow-slate-100/50">
                             <div>
                                <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight leading-none">Diagnostic Audit</h1>
                                <p className="text-slate-400 font-medium mt-1.5">Granular response analysis for "{viewingResultsOf?.title}"</p>
                             </div>
                         </div>

                         <QuestionPalette responses={selectedResultDetail.responses || []} />
                         <div className="space-y-6">
                            {selectedResultDetail.responses?.map((res, i) => <QuestionCard key={i} response={res} index={i} onUpdateMarks={handleUpdateMarks} />)}
                         </div>
                     </div>
                </div>
            </motion.div>
        );
    };

    const renderQuizResults = () => {
        if (!viewingResultsOf) return null;
        return (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                 <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setViewingResultsOf(null)} className="h-10 w-10 rounded-none bg-white border border-black shadow-none flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                             <TrendingUp size={12} className="text-black" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cohort Analytics</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight uppercase">{viewingResultsOf.title}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Candidates</p>
                        <p className="text-4xl font-black font-display group-hover:scale-110 transition-transform origin-left">{resultsData.length}</p>
                        <Users size={60} className="absolute -right-4 -bottom-4 text-slate-50 opacity-10 group-hover:rotate-12 transition-transform" />
                     </div>
                     <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Avg. Performance</p>
                        <p className="text-4xl font-black font-display text-emerald-600 group-hover:scale-110 transition-transform origin-left">{resultsData.length > 0 ? (resultsData.reduce((acc, r) => acc + (r.accuracy ?? 0), 0) / resultsData.length).toFixed(1) : '0'}%</p>
                        <TrendingUp size={60} className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:rotate-12 transition-transform" />
                     </div>
                     <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Top Deviation</p>
                        <p className="text-4xl font-black font-display text-amber-500 group-hover:scale-110 transition-transform origin-left">{resultsData.length > 0 ? Math.max(...resultsData.map(r => r.accuracy ?? 0)).toFixed(1) : '0'}%</p>
                        <Award size={60} className="absolute -right-4 -bottom-4 text-amber-50 opacity-50 group-hover:rotate-12 transition-transform" />
                     </div>
                     <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Efficacy</p>
                        <p className="text-4xl font-black font-display text-indigo-600 group-hover:scale-110 transition-transform origin-left">99<span className="text-sm">%</span></p>
                        <ShieldCheck size={60} className="absolute -right-4 -bottom-4 text-indigo-50 opacity-50 group-hover:rotate-12 transition-transform" />
                     </div>
                </div>

                <div className="bg-white rounded-none border border-black shadow-none overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                         <h3 className="text-xl font-bold font-display text-slate-900 uppercase">Academic Cohort / {resultsData.length} Entries</h3>
                    </div>
                    {resultsData.length === 0 ? (
                         <div className="py-24 text-center">
                            <Users className="text-slate-100 mx-auto mb-4" size={48} />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pending cohort submissions</p>
                         </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {resultsData.map(result => (
                                        <tr key={result._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-none bg-black text-white flex items-center justify-center font-bold">{result.user?.name?.[0] || 'A'}</div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm tracking-tight">{result.user?.name || 'Academic Holder'}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">{result.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="px-4 py-2 rounded-none bg-black text-white font-mono text-[10px] inline-block font-bold tracking-widest">
                                                    {result.score ?? 0} PTS
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-display font-bold text-xl text-slate-900 uppercase">
                                                {(result.accuracy ?? 0).toFixed(1)}%
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button onClick={() => setSelectedResultDetail(result)} className="h-10 px-6 bg-white border border-black text-black font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Surgical Audit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderDashboardOverview = () => {
        return (
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Portfolios" value={quizzes.length} subtitle="Institutional Records" icon={<Layers size={24} className="text-indigo-600" />} iconBgColor="bg-indigo-50" trend={{ positive: true, value: 8 }} />
                    <StatCard title="Total Cohort" value={stats.totalAttempts} subtitle="+12% Since Last Cycle" icon={<Users size={24} className="text-sky-600" />} iconBgColor="bg-sky-50" trend={{ positive: true, value: 12 }} />
                    <StatCard title="Efficacy Avg." value={stats.averageScore || '0%'} subtitle="Protocol Standard" icon={<TrendingUp size={24} className="text-emerald-600" />} iconBgColor="bg-emerald-50" trend={{ positive: false, value: 3 }} />
                    <StatCard title="Compliance" value="99.9%" subtitle="Top decile academic" icon={<ShieldCheck size={24} className="text-rose-600" />} iconBgColor="bg-rose-50" trend={{ positive: true, value: 0.1 }} />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="w-full sm:w-auto flex bg-white p-1 rounded-none border border-black">
                         <button className="px-6 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest bg-black text-white transition-all">All Portfolios</button>
                    </div>
                    <button onClick={() => navigate("/create-quiz")} className="btn-primary w-full sm:w-auto h-14 px-8 flex items-center justify-center gap-3">
                         <Plus size={20} strokeWidth={4} />
                         <span className="font-bold uppercase tracking-widest text-[11px]">Deploy New Schema</span>
                    </button>
                </div>

                {filteredQuizzes.length === 0 ? (
                    <div className="py-40 text-center bg-white rounded-[4rem] border border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-100"><LayoutGrid size={48} /></div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No assessment portfolios detected on current interface.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredQuizzes.map((quiz) => quiz && (
                            <div key={quiz.quizId} className="bg-white p-1 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/20 hover:shadow-indigo-100/30 transition-all group overflow-hidden border-l-8 border-l-transparent hover:border-l-indigo-600">
                                <div className="p-10 flex flex-col xl:flex-row items-center justify-between gap-10">
                                    <div className="flex-1 min-w-0">
                                         <div className="flex flex-wrap items-center gap-3 mb-5">
                                             <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">{quiz.status}</div>
                                             <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">ID: {quiz.quizId}</div>
                                         </div>
                                         <h3 className="text-3xl font-black text-slate-900 font-display group-hover:text-indigo-600 transition-colors tracking-tighter leading-none">{quiz.title}</h3>
                                         <p className="text-slate-400 mt-3 font-medium line-clamp-1 max-w-xl text-lg">Sophisticated assessment architecture for high-stakes certification.</p>
                                    </div>

                                    <div className="flex items-center gap-10 px-10 border-x border-slate-50">
                                         <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Curriculum</p>
                                             <p className="text-2xl font-black text-slate-900 font-display">{quiz.questions?.length || 0}</p>
                                         </div>
                                         <div className="text-center">
                                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Compliance</p>
                                             <p className="text-2xl font-black text-slate-900 font-display">100<span className="text-sm font-sans">%</span></p>
                                         </div>
                                         <div className="text-center">
                                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Audits</p>
                                             <p className="text-2xl font-black text-indigo-600 font-display">{stats.quizStats?.[quiz._id]?.attempts || 0}</p>
                                         </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-end min-w-[300px]">
                                         <button onClick={() => navigate(`/edit-quiz/${quiz.quizId}`)} className="h-14 w-14 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center"><Edit3 size={20} /></button>
                                         <button onClick={() => handleViewResults(quiz)} className="h-14 px-8 bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 transition-all">Audit Logs</button>
                                         <button onClick={() => handleQuizClick(quiz.quizId)} className="h-14 px-10 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">Governance</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderView = () => {
        if (selectedQuiz) return renderQuizDetail();
        if (selectedResultDetail) return renderResultDetail();
        if (viewingResultsOf) return renderQuizResults();
        return renderDashboardOverview();
    };


    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, active: !selectedQuiz && !viewingResultsOf && !selectedResultDetail },
        { id: 'assessments', label: 'Assessments', icon: BookOpen, active: !!selectedQuiz },
    ];

    const handleSidebarClick = (id) => {
        if (id === 'dashboard' || id === 'assessments' || id === 'results') {
            setSelectedQuiz(null);
            setViewingResultsOf(null);
            setSelectedResultDetail(null);
        } else {
            showToast(`${id.charAt(0).toUpperCase() + id.slice(1)} Module Loaded`);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]"><Loader2 className="w-12 h-12 animate-spin text-indigo-600" /></div>;

    return (
        <div className="min-h-screen flex bg-[#fcfcfd] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* SaaS Sidebar */}
            <aside className="w-72 border-r border-black bg-white h-screen fixed left-0 top-0 hidden lg:flex flex-col p-8 items-stretch shrink-0 z-50">
                <Link to="/" className="flex items-center space-x-3 mb-12 group px-2">
                    <div className="bg-black p-2.5 rounded-none shadow-none transition-transform group-hover:invert duration-500">
                        <img src={LOGO} alt="ProctorX" className="h-6 w-6 invert brightness-0" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-black font-display uppercase">
                        Proctor<span className="text-slate-400">X</span>
                    </span>
                </Link>

                <div className="space-y-1 mb-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-4 border-b border-slate-100 pb-2">Institutional Console</p>
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleSidebarClick(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-none font-bold text-[11px] uppercase tracking-widest transition-all group ${item.active ? 'bg-black text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-black'}`}
                        >
                            <item.icon size={16} strokeWidth={item.active ? 3 : 2} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-8">
                     <div className="bg-white rounded-none p-6 border border-black relative overflow-hidden group">
                         <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-none bg-black text-white flex items-center justify-center mb-4 transition-transform duration-500">
                                <GraduationCap size={28} />
                            </div>
                            <h4 className="text-xs font-bold text-black uppercase tracking-tight mb-1">Knowledge Base</h4>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">SYSTEM DOCUMENTATION</p>
                         </div>
                     </div>
                </div>
            </aside>

            {/* Main Interface Content */}
            <div className="flex-1 min-w-0 flex flex-col lg:ml-72">
                <header className="h-24 sticky top-0 z-[40] bg-white border-b border-black px-8 md:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:hidden">
                         <Link to="/" className="flex items-center space-x-2">
                             <div className="bg-black p-2 rounded-none"><img src={LOGO} alt="ProctorX" className="h-4 w-4 invert brightness-0" /></div>
                             <span className="text-lg font-bold tracking-tighter text-black font-display uppercase">Proctor<span className="text-slate-400">X</span></span>
                         </Link>
                    </div>

                    <div className="flex-1 max-w-xl hidden md:flex relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-black transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="SEARCH ASSESSMENTS..." 
                            className="w-full h-12 bg-white border border-slate-200 rounded-none pl-12 pr-6 text-xs font-bold focus:outline-none focus:border-black transition-all placeholder:text-slate-300 uppercase tracking-widest"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                         <div className="hidden sm:flex items-center gap-2 mr-4">
                            {/* Icons removed as per request */}
                         </div>

                         <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>

                         <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{teacherInfo?.name || 'Academic Holder'}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{teacherInfo?.department || 'Faculty Authority'}</p>
                            </div>
                            <div className="relative group">
                                <div className="h-11 w-11 rounded-none bg-black text-white flex items-center justify-center font-bold transition-transform cursor-pointer">
                                    {teacherInfo?.name?.[0] || 'A'}
                                </div>
                                <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-black rounded-none shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 z-50">
                                    <div className="px-4 py-3 mb-2">
                                        <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{teacherInfo?.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{teacherInfo?.email}</p>
                                    </div>
                                    <div className="h-px bg-slate-50 my-2"></div>
                                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-black transition-all"><Home size={16} /> Dashboard Home</button>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-bold uppercase tracking-widest text-black hover:bg-slate-900 hover:text-white transition-all"><LogOut size={16} /> Termination</button>
                                </div>
                            </div>
                         </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-8 md:px-12 py-10">
                    <div className="max-w-[1400px] mx-auto">
                        {!selectedQuiz && !viewingResultsOf && !selectedResultDetail && (
                            <div className="mb-12">
                                <div className="inline-block px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] mb-4">ACCESS LEVEL 01</div>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tighter leading-none mb-4 uppercase">
                                    Welcome, <span className="text-slate-400">Prof. {teacherInfo?.name?.split(' ').pop() || 'Scholar'}</span>
                                </h1>
                                <p className="text-xs text-slate-400 font-bold max-w-2xl tracking-[0.1em] leading-loose uppercase">Institutional Arena Active • Real-time Compliance Verification • Secure Node establishes.</p>
                            </div>
                        )}
                        {renderView()}
                    </div>
                </main>

                <footer className="h-16 px-12 border-t border-black flex items-center justify-between text-slate-400 shrink-0">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-black" />
                        Secure Node / ProctorX Core
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        V4.2.1-CLASSIC
                    </div>
                </footer>
            </div>
        </div>
    );
}

// Internal Loader
const Loader = ({ message = "Establishing Secure Connection..." }) => (
  <div className="flex flex-col items-center justify-center gap-6">
    <div className="relative">
        <div className="h-20 w-20 rounded-[2rem] border-4 border-indigo-50 animate-pulse"></div>
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">{message}</p>
  </div>
);

// Lucide replacement for internal SVG if needed or just use lucide standard imports as I did above.
// The code above uses standard Lucide imports for all icons.