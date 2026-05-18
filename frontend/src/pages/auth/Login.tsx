import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Fingerprint, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data);
      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-white placeholder:text-gray-600"
              placeholder="voter@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-white placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={isLoading}
            className="w-full py-3 rounded-lg flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-semibold transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
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
