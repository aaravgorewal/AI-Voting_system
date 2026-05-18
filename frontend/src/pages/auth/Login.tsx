import { Link } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';

export default function Login() {
  return (
    <div className="flex-1 flex items-center justify-center relative px-4 py-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 blur-[100px] rounded-full" />
      
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface/60 border border-white/10 backdrop-blur-xl z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary-500/20 rounded-full mb-4">
            <Fingerprint className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-2">Sign in to cast your secure vote</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-white placeholder:text-gray-600"
              placeholder="voter@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-white placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
