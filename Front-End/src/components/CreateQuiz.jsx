import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Home,
  LogOut,
  Upload,
  Download,
  HelpCircle,
  Loader2,
  CheckCircle,
  ArrowLeft,
  GraduationCap,
  Code,
  FileText,
  CheckSquare,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import API from "../../Api";
import Logo from "../assets/LOGO.png";

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

const helpPromptText = `CSV rules:
Headers must be exactly:
questionType,questionText,option1,option2,option3,option4,correctAnswerIndex,marks
questionType = mcq | descriptive | coding
For descriptive rows leave option1..option4 and correctAnswerIndex empty
For coding rows leave option1..option4 and correctAnswerIndex empty; coding testcases must be added in UI after import
Every row must have 8 columns
All text in double quotes if it contains commas
Marks must be a positive number`;

function HelpModal({ onClose, content }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-none shadow-none max-w-2xl w-full overflow-hidden border border-black">
        <div className="p-8 border-b border-black flex justify-between items-center bg-white">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <ShieldCheck size={14} className="text-black" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Support</span>
              </div>
              <h3 className="text-2xl font-black text-black font-display uppercase tracking-tight">CSV Schema Guidelines</h3>
           </div>
           <button onClick={onClose} className="h-10 w-10 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-all text-black">&times;</button>
        </div>
        <div className="p-8">
           <div className="bg-white text-black p-6 border border-black font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
             {content}
           </div>
        </div>
        <div className="p-8 bg-white border-t border-black text-right">
           <button onClick={onClose} className="btn-primary py-3 px-8 text-[10px] uppercase font-bold tracking-widest">Acknowledge</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-24 right-8 z-[100] px-8 py-4 border border-black shadow-none text-[10px] font-bold uppercase tracking-widest animate-slide-up ${type === "success" ? "bg-black text-white" : "bg-white text-black"}`}>
      {message}
    </div>
  );
}

export default function CreateQuiz() {
  const navigate = useNavigate();
  const languages = ["javascript", "python", "java", "cpp"];

  const [formData, setFormData] = useState({
    title: "",
    allowedStudents: 0,
    questions: [
      {
        questionType: "mcq",
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        marks: 1,
        descriptiveAnswer: "",
        starterCode: { ...defaultCode },
        testcases: Array.from({ length: 8 }, () => ({ input: "", output: "" }))
      }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [toast, setToast] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleQuestionField = (index, field, value) => {
    setFormData(prev => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [field]: value };
      
      if (field === "questionType") {
        if (value === "mcq" && !Array.isArray(questions[index].options)) questions[index].options = ["", "", "", ""];
        if (value === "coding") {
            if (!questions[index].starterCode || Object.keys(questions[index].starterCode).length === 0) {
                questions[index].starterCode = { ...defaultCode };
            }
            if (!Array.isArray(questions[index].testcases)) questions[index].testcases = Array.from({ length: 8 }, () => ({ input: "", output: "" }));
        }
      }
      if (field === "marks") questions[index].marks = Number(value);
      return { ...prev, questions };
    });
  };

  const handleStarterCodeChange = (qIndex, lang, code) => {
    setFormData(prev => {
        const questions = [...prev.questions];
        questions[qIndex] = {
            ...questions[qIndex],
            starterCode: {
                ...questions[qIndex].starterCode,
                [lang]: code
            }
        };
        return { ...prev, questions };
    });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    setFormData(prev => {
      const questions = [...prev.questions];
      if (!Array.isArray(questions[qIndex].options)) questions[qIndex].options = ["", "", "", ""];
      questions[qIndex].options[oIndex] = value;
      return { ...prev, questions };
    });
  };

  const handleTestcaseChange = (qIndex, tcIndex, field, value) => {
    setFormData(prev => {
      const questions = [...prev.questions];
      if (!Array.isArray(questions[qIndex].testcases)) questions[qIndex].testcases = Array.from({ length: 8 }, () => ({ input: "", output: "" }));
      const tcs = [...questions[qIndex].testcases];
      tcs[tcIndex] = { ...tcs[tcIndex], [field]: value };
      questions[qIndex].testcases = tcs;
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionType: "mcq",
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          marks: 1,
          descriptiveAnswer: "",
          starterCode: { ...defaultCode },
          testcases: Array.from({ length: 8 }, () => ({ input: "", output: "" }))
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => {
      if (prev.questions.length <= 1) {
        showToast("Minimum 1 assessment required.", "error");
        return prev;
      }
      const questions = prev.questions.filter((_, i) => i !== index);
      return { ...prev, questions };
    });
  };

  const downloadTemplate = () => {
    const header = '"questionType","questionText","option1","option2","option3","option4","correctAnswerIndex","marks"\n';
    const example = '"mcq","What is 2+2?","1","2","4","3",2,2\n"descriptive","Explain photosynthesis","","","","",,5\n"coding","Sum two numbers","","","","",,4\n';
    const csv = "data:text/csv;charset=utf-8," + header + example;
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "quiz_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = ev.target.result.split("\n").filter(r => r.trim() !== "");
        if (rows.length <= 1) throw new Error("Missing protocol headers.");
        const headers = rows[0].split(",").map(h => h.replace(/"/g, "").trim());
        const expected = ["questionType","questionText","option1","option2","option3","option4","correctAnswerIndex","marks"];
        if (JSON.stringify(headers) !== JSON.stringify(expected)) throw new Error("Invalid CSV structural schema.");
        const newQuestions = [];
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(",").map(c => c.replace(/"/g, "").trim());
          if (cols.length !== 8) continue;
          const [questionType, questionText, o1, o2, o3, o4, correctStr, marksStr] = cols;
          const qType = questionType.toLowerCase();
          const marks = Number(marksStr) || 1;
          const baseQuestion = {
            questionText,
            marks,
            starterCode: { ...defaultCode },
            testcases: Array.from({ length: 8 }, () => ({ input: "", output: "" }))
          };
          if (qType === "mcq") {
            newQuestions.push({ ...baseQuestion, questionType: "mcq", options: [o1 || "", o2 || "", o3 || "", o4 || ""], correctAnswer: Number(correctStr) || 0, descriptiveAnswer: "" });
          } else if (qType === "descriptive") {
            newQuestions.push({ ...baseQuestion, questionType: "descriptive", options: ["", "", "", ""], correctAnswer: null, descriptiveAnswer: "" });
          } else {
            newQuestions.push({ ...baseQuestion, questionType: "coding", options: ["", "", "", ""], correctAnswer: null, descriptiveAnswer: "" });
          }
        }
        setFormData(prev => ({ ...prev, questions: newQuestions }));
        showToast(`Synchronized ${newQuestions.length} entries.`);
      } catch (err) {
        showToast(err.message || "Failed to process registry", "error");
      } finally { setIsParsing(false); e.target.value = null; }
    };
    reader.readAsText(file);
  };

  const submitQuiz = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) { showToast("Title required", "error"); return; }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title,
        allowedStudents: Number(formData.allowedStudents) || 0,
        questions: formData.questions.map(q => ({
          questionType: q.questionType,
          questionText: q.questionText,
          marks: Number(q.marks),
          options: q.questionType === "mcq" ? q.options.slice(0,4) : undefined,
          correctAnswer: q.questionType === "mcq" ? Number(q.correctAnswer) : undefined,
          descriptiveAnswer: q.questionType === "descriptive" ? (q.descriptiveAnswer || "") : undefined,
          starterCode: q.questionType === "coding" ? q.starterCode : undefined,
          testcases: q.questionType === "coding" ? q.testcases.map(tc => ({ input: tc.input || "", output: tc.output || "" })) : undefined
        }))
      };
      await API.post("/api/quizzes/create", payload, { headers: { Authorization: `Bearer ${token}` } });
      showToast("Repository Updated Successfully");
      setTimeout(() => navigate("/staff-dashboard"), 1200);
    } catch (err) { showToast("Failed to commit changes", "error"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      {showHelpModal && <HelpModal content={helpPromptText} onClose={() => setShowHelpModal(false)} />}

      <header className="fixed top-0 w-full z-50 bg-white h-20 border-b border-black flex items-center px-10 justify-between">
        <div className="flex items-center gap-12">
           <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-black p-2.5 rounded-none transition-transform group-hover:invert duration-500">
                 <img src={Logo} alt="ProctorX" className="h-6 w-6 invert brightness-0" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-black font-display uppercase">
                  Proctor<span className="text-slate-400">X</span>
              </span>
           </Link>
           <div className="hidden md:flex items-center gap-2 text-slate-300">
               <span className="text-[10px] font-bold uppercase tracking-widest">Faculty Management</span>
               <ChevronRight size={14} />
               <span className="text-[10px] font-bold uppercase tracking-widest text-black">Institution Creator</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => navigate("/staff-dashboard")} className="h-12 px-6 rounded-none bg-white border border-black text-black font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-black hover:text-white transition-all">
              <Home size={16} /> <span className="hidden sm:inline">Command Center</span>
           </button>
           <button onClick={handleLogout} className="h-12 w-12 rounded-none bg-white border border-black text-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
              <LogOut size={16} />
           </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 pt-32 pb-32">
        <form onSubmit={submitQuiz} className="space-y-12 animate-fade-in">
          <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-black">Assessment Protocol Builder</div>
              <h1 className="text-5xl font-black text-slate-900 font-display tracking-tighter leading-none mb-4 uppercase">Draft New <span className="text-slate-400">Institutional Record</span></h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Define structural integrity • candidate thresholds • curriculum criteria.</p>
          </div>

          <div className="bg-white p-10 rounded-none border border-black space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Portfolio Designation</label>
                   <input 
                      name="title" 
                      placeholder="e.g. ADVANCED SYSTEM ARCHITECTURE 2026"
                      value={formData.title} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border border-black rounded-none px-6 py-4 text-black font-display text-xl font-bold focus:bg-white outline-none transition-all uppercase placeholder:text-slate-200" 
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Candidate Threshold (Seats)</label>
                   <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        name="allowedStudents" 
                        value={formData.allowedStudents} 
                        onChange={handleChange} 
                        className="w-full bg-slate-50 border border-black rounded-none px-6 py-4 text-black font-display text-xl font-bold focus:bg-white outline-none transition-all" 
                        min={0} 
                      />
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest w-24 leading-tight">0 = UNRESTRICTED ACCESS</div>
                   </div>
                </div>
            </div>

            <div className="pt-10 border-t border-black">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-bold text-black font-display uppercase tracking-tight">Mass Ingestion Pipeline</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Synchronize questions from institutional CSV registries.</p>
                 </div>
                 <button type="button" className="flex items-center gap-2 text-black font-bold text-[10px] uppercase tracking-widest" onClick={() => setShowHelpModal(true)}>
                   <HelpCircle className="h-4 w-4" /> Structural Documentation
                 </button>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="cursor-pointer relative overflow-hidden group">
                     <div className="h-16 rounded-none border border-black border-dashed flex items-center justify-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest transition-all group-hover:bg-black group-hover:text-white">
                        <Upload size={16} />
                        {isParsing ? "Synchronizing..." : "Initialize CSV Upload"}
                     </div>
                     <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button type="button" onClick={downloadTemplate} className="h-16 rounded-none bg-slate-50 border border-black flex items-center justify-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                    <Download size={16} /> Obtain Template
                  </button>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-black font-display uppercase tracking-tight">Curriculum Hierarchy</h2>
                <div className="flex bg-white p-1 border border-black text-[9px] font-black uppercase tracking-widest">
                    <span className="px-3 py-1 bg-black text-white">Draft</span>
                    <span className="px-3 py-1 text-slate-400">Review</span>
                </div>
            </div>

            {formData.questions.map((q, i) => (
              <div key={i} className="bg-white p-8 rounded-none border border-black relative group transition-all">
                <div className="absolute -top-4 -left-4 h-12 w-12 bg-black text-white flex items-center justify-center rounded-none font-black text-lg font-display transition-transform group-hover:scale-110 border border-black">{i + 1}</div>

                <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 border-b border-black pb-8">
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative w-56">
                        <select value={q.questionType} onChange={(e) => handleQuestionField(i, "questionType", e.target.value)} className="w-full appearance-none px-5 py-3 bg-white border border-black rounded-none text-[10px] font-black uppercase tracking-widest text-black outline-none focus:bg-black focus:text-white transition-all">
                            <option value="mcq">Structured MCQ</option>
                            <option value="descriptive">Academic Descriptive</option>
                            <option value="coding">Algorithmic Coding</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-white" />
                    </div>
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-none border border-black">
                        <span className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Weight:</span>
                        <input type="number" min={1} value={q.marks} onChange={(e) => handleQuestionField(i, "marks", Number(e.target.value))} className="w-16 bg-slate-50 border border-black rounded-none px-3 py-1.5 text-xs font-black text-black outline-none" />
                        <span className="text-[9px] font-black text-slate-300 uppercase mr-2 tracking-widest">Pts</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeQuestion(i)} className="h-10 w-10 flex items-center justify-center border border-black text-black hover:bg-black hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                    <div className="relative">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Enquiry Specification</label>
                        <textarea 
                            rows={3} 
                            value={q.questionText} 
                            onChange={(e) => handleQuestionField(i, "questionText", e.target.value)} 
                            className="w-full bg-slate-50 border border-black rounded-none px-6 py-4 text-black font-bold text-lg leading-relaxed focus:bg-white outline-none transition-all uppercase placeholder:text-slate-200" 
                            placeholder="Formulate the academic enquiry here..." 
                        />
                    </div>

                    {q.questionType === "mcq" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {q.options.map((opt, j) => (
                            <div key={j} className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">{String.fromCharCode(65 + j)}</span>
                                <input 
                                    type="text" 
                                    value={opt} 
                                    onChange={(e) => handleOptionChange(i, j, e.target.value)} 
                                    className="w-full pl-10 pr-6 py-4 bg-white border border-black rounded-none text-sm font-bold text-black focus:bg-slate-50 outline-none transition-all uppercase" 
                                    placeholder={`Option ${j + 1}`} 
                                />
                            </div>
                        ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-none border border-black">
                            <span className="text-[10px] font-black text-black uppercase tracking-widest ml-2">Validated Protocol Answer:</span>
                            <div className="flex gap-2">
                                {q.options.map((_, j) => (
                                    <button 
                                        key={j}
                                        type="button"
                                        onClick={() => handleQuestionField(i, "correctAnswer", j)}
                                        className={`h-10 w-10 rounded-none font-black text-sm transition-all border ${q.correctAnswer === j ? "bg-black border-black text-white" : "bg-white border-black text-black hover:bg-slate-100"}`}
                                    >
                                        {String.fromCharCode(65 + j)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    )}

                    {q.questionType === "descriptive" && (
                    <div className="relative bg-slate-50 p-6 rounded-none border border-black">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-black" />
                            <label className="text-[10px] font-black text-black uppercase tracking-widest">Ideal Evaluation Template</label>
                        </div>
                        <textarea 
                            rows={4} 
                            value={q.descriptiveAnswer} 
                            onChange={(e) => handleQuestionField(i, "descriptiveAnswer", e.target.value)} 
                            className="w-full bg-white border border-black rounded-none px-6 py-4 text-black text-sm font-bold leading-relaxed focus:bg-slate-50 outline-none transition-all uppercase placeholder:text-slate-200" 
                            placeholder="Provide keywords or a model response for instructor alignment..." 
                        />
                    </div>
                    )}

                    {q.questionType === "coding" && (
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Code size={18} className="text-black" />
                                <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] leading-none">Algorithm Boilerplate Registry</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {languages.map(lang => (
                                    <div key={lang} className="bg-black p-5 rounded-none border border-black overflow-hidden">
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white">{lang} Protocol</span>
                                            <div className="h-1.5 w-1.5 rounded-none bg-white animate-pulse"></div>
                                        </div>
                                        <textarea
                                            rows={8}
                                            value={q.starterCode[lang] || ""}
                                            onChange={(e) => handleStarterCodeChange(i, lang, e.target.value)}
                                            className="w-full bg-black border border-slate-800 rounded-none px-4 py-3 font-mono text-xs text-slate-300 outline-none focus:border-white transition-colors"
                                            placeholder={`// ${lang} boilerplate code...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} className="text-black" />
                                    <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] leading-none">Computational Testcase Matrix (8)</h4>
                                </div>
                                <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-widest border border-black">Dynamic I/O Validation</span>
                            </div>
                            <div className="overflow-hidden bg-white border border-black rounded-none">
                                <table className="w-full text-left">
                                    <thead className="bg-white border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-12">No.</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry (stdin)</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Return (stdout)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {Array.from({ length: 8 }).map((_, tcIndex) => {
                                        const tc = (q.testcases && q.testcases[tcIndex]) || { input: "", output: "" };
                                        return (
                                            <tr key={tcIndex} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-[10px] font-bold text-slate-300">{tcIndex + 1}</td>
                                            <td className="px-6 py-3">
                                                <input value={tc.input} onChange={(e) => handleTestcaseChange(i, tcIndex, "input", e.target.value)} className="w-full bg-white border border-black rounded-none px-4 py-2 text-xs font-bold text-black outline-none focus:bg-black focus:text-white transition-all uppercase" placeholder="Input stream" />
                                            </td>
                                            <td className="px-6 py-3">
                                                <input value={tc.output} onChange={(e) => handleTestcaseChange(i, tcIndex, "output", e.target.value)} className="w-full bg-white border border-black rounded-none px-4 py-2 text-xs font-bold text-black outline-none focus:bg-black focus:text-white transition-all uppercase" placeholder="Expected return" />
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

          <div className="flex flex-col gap-6 pt-10">
              <button 
                type="button" 
                onClick={addQuestion} 
                className="w-full py-8 rounded-none bg-white border border-black text-slate-400 hover:text-black hover:bg-slate-50 transition-all flex items-center justify-center gap-4 group"
              >
                <div className="h-10 w-10 rounded-none bg-white border border-black flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                    <Plus size={20} strokeWidth={3} />
                </div>
                <span className="font-black uppercase tracking-[0.3em] text-xs">Append New Curricular Entry</span>
              </button>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-10 bg-black text-white rounded-none font-black uppercase tracking-[0.4em] text-sm hover:invert transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-6"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-8 w-8" /> : <CheckCircle size={28} strokeWidth={3} />} 
                {isSubmitting ? "Committing Repository Changes..." : "Commit Institutional Record"}
              </button>
          </div>
        </form>
      </main>

      <footer className="mt-20 py-20 text-center border-t border-slate-100 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
          <div className="flex items-center justify-center space-x-2 text-slate-400 mb-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-display">Faculty Governance Protocol</span>
          </div>
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Encypted Session • Admin-ID: {localStorage.getItem('token')?.slice(0,10)}... • ProctorX Registry v4.2</p>
      </footer>
    </div>
  );
}

const ChevronDown = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);