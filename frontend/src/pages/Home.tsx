import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-white/10 mb-8 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-gray-300">Secure. Transparent. AI-Powered.</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          The Future of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent">Digital Democracy</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10">
          VoteAI ensures absolute election integrity using advanced facial recognition, real-time fraud detection, and blockchain-backed transparency.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/register" className="px-8 py-4 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="px-8 py-4 rounded-lg bg-surface border border-white/10 hover:bg-surfaceHover text-white font-semibold transition-all">
            Sign In
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            { icon: ShieldCheck, title: "Biometric Security", desc: "Military-grade facial recognition prevents impersonation." },
            { icon: Zap, title: "Real-time Processing", desc: "Instant AI verification allows for seamless voting experiences." },
            { icon: Users, title: "Fraud Detection", desc: "Continuous monitoring detects anomalies and secures the vote." }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-surface/40 border border-white/5 backdrop-blur-sm text-left flex flex-col items-start hover:bg-surface/60 transition-colors">
              <div className="p-3 rounded-lg bg-primary-500/10 mb-4">
                <feature.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
