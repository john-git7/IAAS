import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Brain, Shield, BarChart3, Users, Eye, Lock, Zap, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const features = [
    {
        icon: Brain,
        title: "Adaptive AI Proctoring",
        description: "Intelligent monitoring system that maintains high academic standards while minimizing student anxiety.",
        image: "https://images.unsplash.com/photo-1674027444636-ce7379d51252?auto=format&fit=crop&q=80&w=800",
        tag: "Core"
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Built on university-grade security principles to ensure data privacy and assessment integrity.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        tag: "Security"
    },
    {
        icon: BarChart3,
        title: "Insightful Analytics",
        description: "Transform raw data into actionable insights for both students and educational administrators.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        tag: "Analytics"
    },
    {
        icon: Users,
        title: "Seamless Management",
        description: "Advanced tools for educators to manage large-scale cohorts with zero technical overhead.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
        tag: "Admin"
    }
];

const smallFeatures = [
    { icon: Eye, title: "Real-time Monitoring" },
    { icon: Lock, title: "End-to-end Encryption" },
    { icon: Zap, title: "Instant Feedback" },
    { icon: CheckCircle, title: "Automated Evaluation" }
];

export function Features() {
    return (
        <section id="Features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-24">
                    <div className="inline-block px-5 py-2 rounded-none bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        Operational Capabilities
                    </div>
                    <h2 className="text-5xl sm:text-7xl font-black text-black mb-8 font-display uppercase tracking-tight">
                        Engineered for <span className="text-slate-300">Integrity</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-tight leading-relaxed">
                        The most reliable assessment engine powered by sophisticated AI 
                        to ensure fairness, simplicity, and absolute security.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
                    {features.map((feature, index) => (
                        <div key={index} className="rounded-none border border-black overflow-hidden bg-white transition-all hover:bg-black hover:text-white group">
                            <div className="relative h-64 overflow-hidden border-b border-black">
                                <ImageWithFallback
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-6 right-6">
                                    <span className="px-4 py-1.5 bg-black/80 rounded-none text-[10px] font-black text-white uppercase tracking-wider border border-white/20">
                                        {feature.tag}
                                    </span>
                                </div>
                                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-none border border-black text-black">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mix-blend-difference font-display uppercase tracking-tight">{feature.title}</h3>
                                </div>
                            </div>
                            <div className="p-10">
                                <p className="text-[12px] font-bold uppercase tracking-widest leading-loose opacity-60 group-hover:opacity-100">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {smallFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-none border border-black transition-all group text-center hover:bg-black hover:text-white"
                        >
                            <div className="inline-flex items-center justify-center p-4 rounded-none border border-black text-black mb-6 group-hover:bg-white group-hover:text-black transition-all">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] leading-snug">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
