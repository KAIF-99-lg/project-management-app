import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { Users, Mail, Lock, AlertCircle } from 'lucide-react';

export default function MemberLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password, 'Member');
      if (success) {
        navigate('/member/dashboard');
      } else {
        setError('Invalid credentials or unauthorized access');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">Team Member Portal</h1>
          <p className="text-emerald-100">Access your tasks and collaborate</p>
        </div>

        {/* Login Form */}
        <div className="bg-teal-800/30 backdrop-blur-sm border border-emerald-700/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-teal-900/50 border border-emerald-600/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="member@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-teal-900/50 border border-emerald-600/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-emerald-100 text-sm">
              Don't have an account?{' '}
              <Link to="/member/signup" className="text-emerald-300 hover:text-emerald-200 font-medium transition">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-emerald-700/30">
            <p className="text-center text-emerald-200 text-sm">
              Manager?{' '}
              <Link to="/manager/login" className="text-indigo-300 hover:text-indigo-200 font-medium transition">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-teal-900/50 rounded-lg border border-emerald-700/20">
            <p className="text-xs text-emerald-200 mb-2 font-medium">Demo Credentials:</p>
            <p className="text-xs text-emerald-300/80">Email: rahul@example.com</p>
            <p className="text-xs text-emerald-300/80">Password: member123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
