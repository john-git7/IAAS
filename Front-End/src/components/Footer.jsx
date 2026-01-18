import { GraduationCap, Mail, Phone, MapPin, Twitter, Linkedin, Github, Facebook } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate, Link } from "react-router-dom";

const footerLinks = {
  platform: [
    { name: "Dashboard", href: "/" },
    { name: "Assessments", href: "#QuizGrid" },
    { name: "Create Quiz", href: "/staff-login" },
    { name: "Student Portal", href: "/student-login" }
  ],
  features: [
    { name: "AI Proctoring", href: "/about-us" },
    { name: "Secure Exams", href: "/about-us" },
    { name: "Live Monitoring", href: "/about-us" },
    { name: "Auto Grading", href: "/about-us" }
  ],
  support: [
    { name: "Documentation", href: "#docs" },
    { name: "Help Center", href: "#help" },
    { name: "System Status", href: "#status" },
    { name: "Contact Support", href: "#contact" }
  ],
  company: [
    { name: "About ProctorX", href: "/about-us" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Security Standards", href: "#security" }
  ]
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" }
];

export function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white border-t border-black pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          
          <div className="md:col-span-2 lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-black p-2.5 rounded-none transition-transform group-hover:invert duration-500">
                 <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-black font-display uppercase">
                Proctor<span className="text-slate-400">X</span>
              </span>
            </Link>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                Next-generation assessment infrastructure. We enable educational institutions to host secure, 
                high-stakes examinations with absolute integrity.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2.5 border border-black text-black hover:bg-black hover:text-white transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key} className="lg:col-span-1">
              <h3 className="text-black text-[10px] font-black uppercase tracking-[0.2em] mb-8 font-display">{key}</h3>
              <ul className="space-y-4">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-slate-400 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-black flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} ProctorX Inc. Built for academic integrity.
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#privacy" className="hover:text-black">Privacy</a>
            <a href="#terms" className="hover:text-black">Terms</a>
            <a href="#cookies" className="hover:text-black">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
