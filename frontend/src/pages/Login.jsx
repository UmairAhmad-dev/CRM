import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import { login } from '../api/client';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('crm_user', JSON.stringify(data));
      navigate('/');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary-900 skew-y-6 transform -translate-y-32 -z-10"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow-xl mb-4">
          <Briefcase className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-slate-900">Sign in to CRM Pro</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {loginMutation.isError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2 border border-red-100">
                <AlertCircle className="h-4 w-4" /> {loginMutation.error.message}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input required type="email" placeholder="you@company.com"
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input required type="password" placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            <button 
              type="submit" disabled={loginMutation.isPending}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70"
            >
              {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}