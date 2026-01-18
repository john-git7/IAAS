import { Clock, Users, Star, Play, BookOpen, Laptop, Globe, LayoutGrid, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const quizzes = [
  {
    quizId: "QZ708443",
    title: "General Knowledge",
    description: "In-depth evaluation of Calculus, Linear Algebra, and Statistical foundations.",
    duration: "60 MIN",
    participants: 1247,
    rating: 4.8,
    difficulty: "Advanced",
    icon: Globe,
    color: "indigo"
  },
  {
    quizId: "QZ840043",
    title: "Computer Science",
    description: "Assessment of advanced Data Structures, Algorithms, and logic design principles.",
    duration: "60 MIN",
    participants: 892,
    rating: 4.9,
    difficulty: "Intermediate",
    icon: Laptop,
    color: "sky"
  },
  {
    quizId: "QZ303385",
    title: "Modern History",
    description: "Historical registry tracking from Ancient Civilizations to the Digital Revolution.",
    duration: "60 MIN",
    participants: 634,
    rating: 4.7,
    difficulty: "Beginner",
    icon: BookOpen,
    color: "indigo"
  },
  {
    quizId: "QZ588027",
    title: "English Literature",
    description: "Critical analysis of institutional poetry, drama, and prose manifests.",
    duration: "60 MIN",
    participants: 523,
    rating: 4.6,
    difficulty: "Intermediate",
    icon: LayoutGrid,
    color: "sky"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const getDifficultyStyles = (difficulty) => {
  switch (difficulty) {
    case "Beginner": return "bg-white text-black border-black";
    case "Intermediate": return "bg-black text-white border-black";
    case "Advanced": return "bg-slate-200 text-black border-black";
    default: return "bg-white text-slate-400 border-black";
  }
};

export function QuizGrid() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartQuiz = (quizId) => {
    if (!user) {
      toast.custom((t) => (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white border-2 border-black p-10 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-black p-4 mb-6">
                <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Protocol: Access Denied</h3>
            <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter font-display">Credential Validation</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">
              Secure authentication is mandated to synchronize with this assessment registry.
            </p>
            <div className="flex w-full gap-4">
              <button
                className="flex-1 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] border border-black hover:bg-white hover:text-black transition-all"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/student-login");
                }}
              >
                Log Entry
              </button>
              <button
                className="flex-1 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] border border-black hover:bg-black hover:text-white transition-all"
                onClick={() => toast.dismiss(t.id)}
              >
                Abort
              </button>
            </div>
          </div>
        </motion.div>
      ), {
        position: "bottom-center",
        duration: 4000
      });
      return;
    }
    navigate(`/exam/${quizId}`);
  };

  return (
    <section id="QuizGrid" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <Toaster /> 
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center mb-16">
          <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-[0.4em] mb-6">
            Registry Archives
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-black mb-8 font-display uppercase tracking-tighter leading-none">
            Selected <span className="text-slate-300">Modules</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-tight leading-relaxed">
            Initialize institutional assessments. Deploy protocol <span className="text-black underline underline-offset-4">000000</span> for valid registry synchronization.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {quizzes.map((quiz, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ x: 8, y: -8 }}
              className="group relative"
            >
              {/* Brutalist Shadow Effect */}
              <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-all"></div>
              
              <div className="relative bg-white border-2 border-black p-8 h-full flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-black text-white transition-colors duration-500 group-hover:bg-slate-50 group-hover:text-black group-hover:border-black border border-transparent">
                      <quiz.icon className="h-6 w-6" />
                    </div>
                    <div className={`px-4 py-1.5 border-2 font-black text-[9px] uppercase tracking-[0.2em] ${getDifficultyStyles(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-black mb-4 font-display uppercase tracking-tighter leading-tight">
                    {quiz.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 line-clamp-2 leading-loose">
                    {quiz.description}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-6 border-y border-black/10">
                    <div className="flex items-center gap-3 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{quiz.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                      <Users className="h-3.5 w-3.5" />
                      <span>{quiz.participants.toLocaleString()} UNITS</span>
                    </div>
                    <div className="flex items-center gap-2 text-black text-[9px] font-black uppercase tracking-[0.2em]">
                      <Star className="h-3.5 w-3.5 fill-black" />
                      <span>{quiz.rating}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 bg-black text-white flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-white hover:text-black border-2 border-black shadow-none active:scale-[0.98]"
                    onClick={() => handleStartQuiz(quiz.quizId)}
                  >
                    <Play size={16} className="fill-current" />
                    <span>Establish Entry</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Active Scholars", value: "50k+", icon: Users },
            { label: "Registries Hosted", value: "10k+", icon: LayoutGrid },
            { label: "Stability Index", value: "99.9%", icon: Shield }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-slate-50 p-8 border-2 border-black flex flex-col items-center text-center group transition-all"
            >
              <div className="p-3 bg-white border-2 border-black text-black mb-4 group-hover:bg-black group-hover:text-white transition-all">
                <stat.icon size={24} />
              </div>
              <div className="text-4xl font-black text-black mb-2 font-display tracking-tighter uppercase">{stat.value}</div>
              <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
