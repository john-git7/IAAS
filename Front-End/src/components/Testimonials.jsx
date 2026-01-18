import { Card, CardContent } from "../ui/Card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "The future belongs to those who learn more skills and combine them in creative ways.",
    author: "Dr. Sarah Chen",
    role: "Professor of Education",
    institution: "Tech University",
    highlight: "ProctorX has revolutionized how we conduct online assessments."
  },
  {
    quote: "Intelligence plus character - that is the goal of true education.",
    author: "Marcus Johnson",
    role: "School Principal",
    institution: "Future Leaders Academy",
    highlight: "The AI proctoring system is incredibly sophisticated yet user-friendly."
  },
  {
    quote: "Education is not preparation for life; education is life itself.",
    author: "Emma Rodriguez",
    role: "Student",
    institution: "State University",
    highlight: "Students love the seamless experience and instant feedback."
  }
];

const motivationalQuotes = [
  {
    quote: "Success is where preparation and opportunity meet.",
    author: "Bobby Unser"
  },
  {
    quote: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    quote: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black text-black mb-8 font-display uppercase tracking-tight">
            Voices of <span className="text-slate-300">Validation</span>
          </h2>
          <p className="text-lg sm:text-x font-bold text-slate-400 max-w-2xl mx-auto uppercase tracking-tight">
            Institutional feedback from the academic frontier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-none border border-black p-10 hover:bg-black hover:text-white transition-all group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Quote className="h-10 w-10 text-slate-200 group-hover:text-white/20 transition-all" />
                </div>
                <blockquote className="text-black group-hover:text-white italic text-xl font-bold leading-relaxed transition-all">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-black group-hover:border-white/20 pt-8">
                  <div className="text-black group-hover:text-white font-black uppercase tracking-tight text-lg">{testimonial.author}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{testimonial.role}</div>
                  <div className="text-xs font-black text-black group-hover:text-white uppercase tracking-[0.2em] mt-2">{testimonial.institution}</div>
                </div>
                <div className="bg-slate-50 group-hover:bg-white/5 rounded-none p-5 border border-black group-hover:border-white/20 transition-all">
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-widest leading-relaxed">"{testimonial.highlight}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-none p-12 lg:p-16 border border-black">
          <h3 className="text-3xl font-black text-black text-center mb-16 uppercase tracking-tight font-display">
            Philosophical <span className="text-slate-300">Foundations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {motivationalQuotes.map((quote, index) => (
              <div key={index} className="text-center p-8 rounded-none bg-slate-50 border border-black transition-all hover:bg-black hover:text-white group">
                <Quote className="h-8 w-8 text-slate-200 mx-auto mb-6 group-hover:text-white/20" />
                <blockquote className="text-black group-hover:text-white italic font-bold mb-6 text-lg">
                  "{quote.quote}"
                </blockquote>
                <cite className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-400">— {quote.author}</cite>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-20">
          <div className="inline-block px-10 py-5 bg-black text-white rounded-none border border-black transition-all hover:invert cursor-pointer">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              Initialize <span className="text-slate-400">Excellence</span> protocol
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

