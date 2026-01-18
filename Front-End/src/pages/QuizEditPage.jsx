import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Loader2, BookOpen, Home, LogOut, AlertCircle, Code, FileText, CheckSquare, GraduationCap, ChevronRight, ChevronDown, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import API from '../../Api';
import LOGO from "../assets/LOGO.png";

const defaultCode = {
    javascript: `// Javascript Starter Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');

function solve() {
    // Write your code here
    
}
solve();`,

    python: `# Python Starter Code
import sys

def solve():
    # Read input
    data = sys.stdin.read().split()
    # Write logic here

if __name__ == "__main__":
    solve()`,

    java: `// Java Starter Code
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your code here
        
    }
}`,

    cpp: `// C++ Starter Code
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    // Enter your code below
    
    return 0;
}`
};

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`fixed top-24 right-8 px-6 py-3 rounded-2xl shadow-2xl text-xs font-bold uppercase tracking-widest transition-all z-[100] animate-slide-up ${type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
            {message}
        </div>
    );
}

export default function EditQuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    
    const languages = ["javascript", "python", "java", "cpp"];

    const showToast = (message, type = "success") => setToast({ message, type });
    const closeToast = () => setToast(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Session expired. Please re-authenticate.");
                const { data } = await API.get(`/api/quizzes/${quizId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const questions = Array.isArray(data.questions) ? data.questions : [];
                const normalized = {
                    ...data,
                    title: data.title || '',
                    status: data.status || 'inactive',
                    questions: questions.map(q => ({
                        _id: q._id,
                        questionType: q.questionType || 'mcq',
                        questionText: q.questionText || '',
                        marks: typeof q.marks === 'number' ? q.marks : (q.marks ? Number(q.marks) : 1),
                        options: Array.isArray(q.options) ? [...q.options].slice(0, 4).concat(Array(4 - Math.min(q.options.length,4)).fill('')).slice(0,4) : ['', '', '', ''],
                        correctAnswer: typeof q.correctAnswer !== 'undefined' && q.correctAnswer !== null && !isNaN(Number(q.correctAnswer)) ? Number(q.correctAnswer) : 0,
                        descriptiveAnswer: q.descriptiveAnswer || '',
                        starterCode: (q.starterCode && typeof q.starterCode === 'object') ? q.starterCode : { ...defaultCode },
                        activeTab: "javascript",
                        testcases: Array.isArray(q.testcases) ? (() => {
                            const t = q.testcases.slice(0, 8);
                            while (t.length < 8) t.push({ input: '', output: '' });
                            return t;
                        })() : Array.from({ length: 8 }, () => ({ input: '', output: '' })),
                    }))
                };
                setQuiz(normalized);
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message || "Registry entry not found.";
                setError(errorMsg);
                showToast(errorMsg, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleQuizTitleChange = (e) => setQuiz({ ...quiz, title: e.target.value });
    const handleQuizStatusChange = (e) => setQuiz({ ...quiz, status: e.target.value });

    const handleQuestionField = (index, field, value) => {
        const updated = [...quiz.questions];
        updated[index] = { ...updated[index], [field]: value };
        if (field === "questionType") {
            if (value === "coding") {
                if (!updated[index].starterCode || Object.keys(updated[index].starterCode).length === 0) {
                    updated[index].starterCode = { ...defaultCode };
                }
                if (!updated[index].activeTab) updated[index].activeTab = "javascript";
            }
        }
        setQuiz({ ...quiz, questions: updated });
    };

    const handleStarterCodeChange = (qIndex, lang, code) => {
        const updated = [...quiz.questions];
        updated[qIndex] = {
            ...updated[qIndex],
            starterCode: {
                ...updated[qIndex].starterCode,
                [lang]: code
            }
        };
        setQuiz({ ...quiz, questions: updated });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...quiz.questions];
        if (!Array.isArray(updated[qIndex].options)) updated[qIndex].options = ['', '', '', ''];
        updated[qIndex].options[oIndex] = value;
        setQuiz({ ...quiz, questions: updated });
    };

    const handleTestcaseChange = (qIndex, tcIndex, field, value) => {
        const updated = [...quiz.questions];
        if (!Array.isArray(updated[qIndex].testcases)) updated[qIndex].testcases = Array.from({ length: 8 }, () => ({ input: '', output: '' }));
        const tcs = [...updated[qIndex].testcases];
        tcs[tcIndex] = { ...tcs[tcIndex], [field]: value };
        updated[qIndex].testcases = tcs;
        setQuiz({ ...quiz, questions: updated });
    };

    const addQuestion = () => {
        const newQuestion = {
            questionType: 'mcq',
            questionText: '',
            marks: 1,
            options: ['', '', '', ''],
            correctAnswer: 0,
            descriptiveAnswer: '',
            starterCode: { ...defaultCode },
            activeTab: "javascript",
            testcases: Array.from({ length: 8 }, () => ({ input: '', output: '' }))
        };
        setQuiz({ ...quiz, questions: [...(quiz.questions || []), newQuestion] });
    };

    const removeQuestion = (index) => {
        if (quiz.questions.length <= 1) {
            showToast("Minimum 1 entry required for retention.", "error");
            return;
        }
        const updated = quiz.questions.filter((_, i) => i !== index);
        setQuiz({ ...quiz, questions: updated });
    };

    const handleSaveChanges = async () => {
        if (!quiz.title?.trim()) { showToast("Protocol title required", "error"); return; }
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                title: quiz.title,
                status: quiz.status,
                questions: quiz.questions.map(q => ({
                    _id: q._id,
                    questionType: q.questionType,
                    questionText: q.questionText,
                    marks: Number(q.marks),
                    options: q.questionType === 'mcq' ? q.options.slice(0, 4) : undefined,
                    correctAnswer: q.questionType === 'mcq' ? Number(q.correctAnswer) : undefined,
                    descriptiveAnswer: q.questionType === 'descriptive' ? q.descriptiveAnswer || '' : undefined,
                    starterCode: q.questionType === 'coding' ? q.starterCode : undefined,
                    testcases: q.questionType === 'coding' ? q.testcases.map(tc => ({ input: tc.input || '', output: tc.output || '' })) : undefined
                }))
            };
            await API.put(`/api/quizzes/${quizId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            showToast('Registry synchronized successfully');
            setTimeout(() => navigate('/staff-dashboard'), 1200);
        } catch (err) {
            showToast('Failed to commit modifications', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fcfcfd] text-slate-900">
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            <header className="fixed top-0 w-full z-50 glass h-20 border-b border-slate-100 flex items-center px-10 justify-between">
                <div className="flex items-center gap-12">
                   <Link to="/" className="flex items-center space-x-3 group">
                      <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100 transition-transform group-hover:scale-105">
                         <img src={LOGO} alt="ProctorX" className="h-6 w-6 invert brightness-0" />
                      </div>
                      <span className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                          Proctor<span className="text-indigo-600">X</span>
                      </span>
                   </Link>
                   <div className="hidden md:flex items-center gap-2 text-slate-300">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Edit Institutional Record</span>
                   </div>
                </div>
                <nav className="flex items-center gap-4">
                   <button onClick={() => navigate('/staff-dashboard')} className="h-12 px-6 rounded-2xl bg-white border border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:border-indigo-100 hover:text-indigo-600 shadow-sm transition-all active:scale-95">
                      <Home size={18} /> <span className="hidden sm:inline">Portal</span>
                   </button>
                   <button onClick={handleLogout} className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shadow-rose-100 shadow-sm hover:bg-rose-600 hover:text-white transition-all active:scale-95">
                      <LogOut size={20} />
                   </button>
                </nav>
            </header>

            <main className="flex-1 p-8 md:p-10 pt-28 max-w-6xl mx-auto w-full pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <div className="h-16 w-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Establishing Registry Link...</p>
                    </div>
                ) : error && !quiz ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center px-6 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                        <AlertCircle className="h-20 w-20 text-rose-500 mb-6" />
                        <h2 className="text-3xl font-black text-slate-900 font-display mb-2">Registry Access Refused</h2>
                        <p className="text-slate-400 font-medium max-w-sm mb-8">{error}</p>
                        <button onClick={() => navigate('/staff-dashboard')} className="btn-primary py-4 px-8 text-xs">Return to Secure Network</button>
                    </div>
                ) : quiz ? (
                    <div className="animate-fade-in">
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                            <div>
                                <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-100">Live Modification Mode</div>
                                <h1 className="text-5xl font-black text-slate-900 font-display tracking-tighter leading-none mb-1">{quiz.title}</h1>
                                <p className="text-slate-400 font-medium truncate max-w-md">Reference ID: {quiz.quizId}</p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button onClick={() => navigate('/staff-dashboard')} className="flex-1 sm:flex-none h-14 px-8 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all">Revoke</button>
                                <button onClick={handleSaveChanges} disabled={isSaving} className="flex-1 sm:flex-none h-14 px-8 rounded-[1.5rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                                    {isSaving ? 'Syncing...' : 'Commit Protocol'}
                                </button>
                            </div>
                        </header>

                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/30 mb-12">
                            <h2 className="text-lg font-bold text-slate-900 font-display mb-8 flex items-center gap-3">
                                <ShieldCheck size={20} className="text-indigo-600" /> Administrative Constraints
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-3">Institutional Title</label>
                                    <input value={quiz.title} onChange={handleQuizTitleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-display text-xl font-black focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-inner" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-3">Deployment Status</label>
                                    <div className="relative">
                                        <select value={quiz.status} onChange={handleQuizStatusChange} className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-display text-xl font-black focus:border-indigo-600 focus:bg-white outline-none transition-all">
                                            <option value="inactive">Internal (Offline)</option>
                                            <option value="active">Institutional (Live)</option>
                                        </select>
                                        <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="text-2xl font-black text-slate-900 font-display flex items-center justify-between">
                                Curriculum Schema
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{quiz.questions.length} Registry Items</span>
                            </h2>
                            <div className="space-y-8">
                                {quiz.questions.map((q, qIndex) => (
                                    <div key={q._id || qIndex} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/30 relative group hover:border-indigo-200 transition-all">
                                        <div className="absolute -top-4 -left-4 h-12 w-12 bg-slate-900 text-white flex items-center justify-center rounded-2xl font-black text-lg font-display shadow-lg shadow-slate-200 transition-transform group-hover:scale-110">{qIndex + 1}</div>
                                        
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 border-b border-slate-50 pb-8">
                                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                                <div className="relative w-56">
                                                    <select value={q.questionType} onChange={(e) => handleQuestionField(qIndex, 'questionType', e.target.value)} className="w-full appearance-none px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:border-indigo-600 transition-all">
                                                        <option value="mcq">Standard MCQ</option>
                                                        <option value="descriptive">Academic Descriptive</option>
                                                        <option value="coding">Algorithmic Coding</option>
                                                    </select>
                                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                                </div>
                                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Weight:</span>
                                                    <input type="number" min={1} value={q.marks} onChange={(e) => handleQuestionField(qIndex, 'marks', Number(e.target.value))} className="w-16 bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-100" />
                                                    <span className="text-[9px] font-black text-slate-300 uppercase mr-2 tracking-widest">Pts</span>
                                                </div>
                                            </div>
                                            <button onClick={() => removeQuestion(qIndex)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white transition-all active:scale-90">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2 px-1">Curricular Entry</label>
                                                <textarea value={q.questionText} onChange={(e) => handleQuestionField(qIndex, 'questionText', e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-medium text-lg leading-relaxed focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-inner" placeholder="Formulate the assessment enquiry..." />
                                            </div>

                                            {q.questionType === 'mcq' && (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {q.options.map((opt, oIndex) => (
                                                            <div key={oIndex} className="relative">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">{String.fromCharCode(65 + oIndex)}</span>
                                                                <input type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all" placeholder={`Alternative ${oIndex + 1}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100/50">
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">Validated Protocol Answer:</span>
                                                        <div className="flex gap-2">
                                                            {q.options.map((_, oIndex) => (
                                                                <button 
                                                                    key={oIndex}
                                                                    type="button"
                                                                    onClick={() => handleQuestionField(qIndex, 'correctAnswer', oIndex)}
                                                                    className={`h-11 w-11 rounded-xl font-black text-sm transition-all border ${q.correctAnswer === oIndex ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-100"}`}
                                                                >
                                                                    {String.fromCharCode(65 + oIndex)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {q.questionType === 'descriptive' && (
                                                <div className="relative bg-indigo-50/20 p-6 rounded-3xl border border-indigo-100/50">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Sparkles size={14} className="text-indigo-600" />
                                                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Ideal Reference Model</label>
                                                    </div>
                                                    <textarea value={q.descriptiveAnswer} onChange={(e) => handleQuestionField(qIndex, 'descriptiveAnswer', e.target.value)} rows={4} className="w-full bg-white/50 border border-indigo-100 rounded-2xl px-6 py-4 text-slate-700 text-sm font-medium leading-relaxed focus:border-indigo-600 focus:bg-white outline-none transition-all italic shadow-sm" placeholder="Define critical evaluation criteria..." />
                                                </div>
                                            )}

                                            {q.questionType === 'coding' && (
                                                <div className="space-y-8">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <Code size={18} className="text-indigo-600" />
                                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Algorithmic Base Registry</h4>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {languages.map(lang => (
                                                                <div key={lang} className="bg-slate-900 p-5 rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden">
                                                                    <div className="flex items-center justify-between mb-3 px-1">
                                                                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{lang} Environment</span>
                                                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                                                    </div>
                                                                    <textarea 
                                                                        value={q.starterCode[lang] || ""} 
                                                                        onChange={(e) => handleStarterCodeChange(qIndex, lang, e.target.value)} 
                                                                        rows={8} 
                                                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 font-mono text-xs text-indigo-200 outline-none focus:border-indigo-500/50 transition-colors" 
                                                                        placeholder={`// Protocol for ${lang}...`} 
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <ShieldCheck size={18} className="text-emerald-500" />
                                                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Validation Matrix (8)</h4>
                                                            </div>
                                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">Synchronized I/O</span>
                                                        </div>
                                                        <div className="overflow-hidden bg-slate-50 border border-slate-100 rounded-[2rem] shadow-inner">
                                                            <table className="w-full text-left">
                                                                <thead className="bg-white border-b border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                                                    <tr>
                                                                        <th className="px-6 py-4 w-12 text-center">No.</th>
                                                                        <th className="px-6 py-4">Entry Vector (stdin)</th>
                                                                        <th className="px-6 py-4">Required Return (stdout)</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-100">
                                                                    {Array.from({ length: 8 }).map((_, tcIndex) => {
                                                                        const tc = (q.testcases && q.testcases[tcIndex]) || { input: '', output: '' };
                                                                        return (
                                                                            <tr key={tcIndex} className="hover:bg-white transition-colors">
                                                                                <td className="px-6 py-4 text-xs font-black text-slate-300 text-center">{tcIndex + 1}</td>
                                                                                <td className="px-6 py-4">
                                                                                    <input value={tc.input} onChange={(e) => handleTestcaseChange(qIndex, tcIndex, 'input', e.target.value)} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:border-indigo-600 shadow-sm transition-all" placeholder="stdin stream" />
                                                                                </td>
                                                                                <td className="px-6 py-4">
                                                                                    <input value={tc.output} onChange={(e) => handleTestcaseChange(qIndex, tcIndex, 'output', e.target.value)} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-emerald-600 outline-none focus:border-emerald-500 shadow-sm transition-all" placeholder="expected stdout" />
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={addQuestion} className="w-full py-6 rounded-[2.5rem] bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-4 group shadow-lg shadow-slate-100/50">
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Plus size={20} strokeWidth={3} />
                                </div>
                                <span className="font-black uppercase tracking-[0.2em] text-xs">Append New Assessment Portfolio</span>
                            </button>
                        </div>
                    </div>
                ) : null}
            </main>
            
            <footer className="mt-20 py-20 text-center border-t border-slate-100 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <div className="flex items-center justify-center space-x-2 text-slate-400 mb-2">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] font-display">Institution Modification Authority</span>
                </div>
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center">Authenticated Session • Registry Access Level 4 • ProctorX Registry v4.2</p>
            </footer>
        </div>
    );
}