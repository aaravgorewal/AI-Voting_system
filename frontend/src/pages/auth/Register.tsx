import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }

    setIsLoading(true);
    try {
      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password
      };
      const { data } = await api.post('/auth/register', payload);
      login(data.token, data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-1 flex items-center justify-center relative px-4 py-12">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 blur-[100px] rounded-full" />
      
      <div className="w-full max-w-xl p-8 rounded-2xl bg-surface/60 border border-white/10 backdrop-blur-xl z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary-500/20 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold">Voter Registration</h2>
          <p className="text-gray-400 text-sm mt-2 text-center max-w-sm">
            Create your digital identity. You will be required to set up face verification later.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-white placeholder:text-gray-600" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-white placeholder:text-gray-600" placeholder="Doe" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-white placeholder:text-gray-600" placeholder="voter@example.com" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input name="password" value={formData.password} onChange={handleChange} type="password" className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-white placeholder:text-gray-600" placeholder="••••••••" />
          </div>

          <button disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 mt-4 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-semibold transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
