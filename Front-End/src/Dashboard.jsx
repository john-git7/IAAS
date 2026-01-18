import React, { useRef, useState, useEffect } from "react";
import { Topbar } from "./components/Topbar";
import { 
  ArrowRight, Play, Sparkles, Laptop, History, TrendingUp, 
  Mail, Calendar, Library, Users, LifeBuoy, GraduationCap, 
  Coffee, ArrowUpRight, Zap, MessageSquare, Plus, Check, Trash2, Loader2 
} from "lucide-react";
import API from "../Api";
import { Features } from "./components/Feautures";
import { QuizGrid } from "./components/QuizGrid";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LOGO from "./assets/LOGO.png";

function Dashboard() {
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const quizRef = useRef(null);
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await API.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.post('/api/tasks', { text: newTask }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([res.data, ...tasks]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.patch(`/api/tasks/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const apps = [
    { label: "Arena", icon: Play, link: "#QuizGrid", desc: "Live Assessments" },
    { label: "Features", icon: Zap, link: "#Features", desc: "Protocol Capabilities" },
    { label: "Performance", icon: TrendingUp, link: "/performance", desc: "Performance Evolution" },
    { label: "Academic", icon: History, link: "/attempts", desc: "Academic Record" },
    { label: "Scholars", icon: MessageSquare, link: "#Testimonials", desc: "Institutional Feedback" },
    { label: "Support", icon: LifeBuoy, link: "#Footer", desc: "Protocol Help" },
  ];

  return (
    <div className="w-full bg-white text-black relative min-h-screen">
      <Topbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-12">
          
          {/* LEFT COLUMN: Profile & Schedule */}
          <div className="space-y-12">
            
            {/* Profile Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-8 border-2 border-black bg-slate-50 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase font-display leading-none">
                      Hi, {user?.name || "Candidate 0x81"} 
                    </h1>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">
                      {user?.email || "candidate@proctorx.com"}
                    </h2>
                  </div>

                  {/* <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <div className="p-1.5 bg-black rounded-none">
                        <Laptop size={12} className="text-white" />
                      </div>
                      <span className="uppercase tracking-tight">{user?.department || "Computer Science (Software Product Engineering)"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <div className="p-1.5 bg-black rounded-none">
                        <Library size={12} className="text-white" />
                      </div>
                      <span className="uppercase tracking-tight">{user?.institution || "Kalasalingam Academy of Research and Education"}</span>
                    </div>
                  </div> */}
                </div>

                <div className="shrink-0 p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img src={LOGO} alt="Institutional Badge" className="h-20 w-20 object-contain grayscale contrast-125" />
                </div>
              </div>
            </motion.div>

            {/* My Day Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b-2 border-black pb-4">
                <h3 className="text-xl font-black uppercase tracking-tighter">My Day</h3>
              </div>

              <div className="w-full border-2 border-black bg-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px'}}></div>
                
                <form onSubmit={addTask} className="relative z-10 flex gap-4 mb-6">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="INITIALIZE NEW TASK PROTOCOL..."
                    className="flex-1 bg-slate-50 border-2 border-black p-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:bg-white transition-colors"
                  />
                  <button 
                    type="submit"
                    className="bg-black text-white px-4 flex items-center justify-center hover:bg-slate-800 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </form>

                <div className="relative z-10 space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingTasks ? (
                    <div className="flex justify-center py-8">
                       <Loader2 className="animate-spin text-black" size={24} />
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                      <Coffee size={32} className="text-black mb-3" />
                      <p className="font-black uppercase tracking-widest text-black">Registry Idle</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">No active protocols found</p>
                    </div>
                  ) : (
                    tasks.map(task => (
                      <div 
                        key={task._id} 
                        className={`flex items-center gap-4 p-3 border border-black transition-all ${task.completed ? 'bg-slate-100 opacity-60' : 'bg-white hover:bg-slate-50'}`}
                      >
                         <button 
                           onClick={() => toggleTask(task._id)}
                           className={`h-5 w-5 border-2 border-black flex items-center justify-center transition-colors ${task.completed ? 'bg-black' : 'bg-white'}`}
                         >
                            {task.completed && <Check size={12} className="text-white" />}
                         </button>
                         <span className={`flex-1 text-[10px] font-bold uppercase tracking-wider ${task.completed ? 'line-through text-slate-400' : 'text-black'}`}>
                           {task.text}
                         </span>
                         <button 
                           onClick={() => deleteTask(task._id)}
                           className="text-slate-300 hover:text-red-500 transition-colors"
                         >
                            <Trash2 size={14} />
                         </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: App Grid */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Institutional Access Matrix</h3>
            
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              {apps.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                  onClick={() => app.link.startsWith('#') ? document.getElementById(app.link.substring(1))?.scrollIntoView({ behavior: 'smooth' }) : navigate(app.link)}
                  className="aspect-square bg-white border-2 border-black p-4 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-0 translate-y-0 hover:translate-x-1 hover:translate-y-1"
                >
                  <div className="p-3 bg-slate-50 border border-black mb-3 group-hover:bg-white transition-colors">
                    <app.icon className="h-6 w-6 text-black" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-white leading-tight">
                    {app.label}
                  </span>
                  <div className="h-0 group-hover:h-auto overflow-hidden transition-all">
                     <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">{app.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-black text-white space-y-4">
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Security Protocol v4.2</p>
               <p className="text-xs font-bold leading-relaxed tracking-tight">Active encryption synchronization established. Maintain visual registry alignment for all proctored modules.</p>
            </div>
          </div>

        </div>
      </div>

      <div id="Features" ref={featuresRef} className="bg-white py-20 border-y border-black">
        <Features />
      </div>

      <div id="QuizGrid" ref={quizRef} className="bg-white py-20 border-b border-black">
        <QuizGrid />
      </div>

      <div id="Testimonials" className="bg-white py-20">
        <Testimonials />
      </div>
      
      <div id="Footer">
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
