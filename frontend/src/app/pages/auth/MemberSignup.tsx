import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Users, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../../../services/api.js';

export default function MemberSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await authAPI.signup(formData.name, formData.email, formData.password, 'member');
      setSuccess(true);
      setTimeout(() => {
        navigate('/member/login');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">Join as Team Member</h1>
          <p className="text-emerald-100">Start collaborating with your team</p>
        </div>

        {/* Signup Form */}
        <div className="bg-teal-800/30 backdrop-blur-sm border border-emerald-700/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-300">Account created! Redirecting to login...</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-teal-900/50 border border-emerald-600/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-teal-900/50 border border-emerald-600/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-teal-900/50 border border-emerald-600/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={success}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-emerald-100 text-sm">
              Already have an account?{' '}
              <Link to="/member/login" className="text-emerald-300 hover:text-emerald-200 font-medium transition">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-emerald-700/30">
            <p className="text-center text-emerald-200 text-sm">
              Manager?{' '}
              <Link to="/manager/signup" className="text-indigo-300 hover:text-indigo-200 font-medium transition">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
