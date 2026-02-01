import React from 'react';
import { Link } from 'react-router';
import { Shield, Users, LayoutDashboard, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl mb-6 shadow-2xl shadow-indigo-500/30">
            <LayoutDashboard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            ProjectFlow
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Professional project management platform for modern teams
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Manager Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">For Managers</h2>
            <p className="text-indigo-200 mb-6">
              Full control over projects, teams, and analytics. Create and assign tasks, track progress, and manage your organization.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Create and manage teams',
                'Assign tasks and set priorities',
                'Track team progress',
                'View analytics and reports',
                'Manage activity logs'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-indigo-100">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/manager/login"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition font-medium shadow-lg shadow-indigo-500/30"
            >
              Manager Login
            </Link>
          </div>

          {/* Team Member Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">For Team Members</h2>
            <p className="text-emerald-200 mb-6">
              Access your assigned tasks, update progress, and collaborate with your team efficiently.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'View assigned tasks',
                'Update task status',
                'Track your progress',
                'Set task priorities',
                'Manage deadlines'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/member/login"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition font-medium shadow-lg shadow-emerald-500/30"
            >
              Team Member Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-indigo-300">
          <p className="text-sm">
            © 2026 ProjectFlow. Professional project management for modern organizations.
          </p>
        </div>
      </div>
    </div>
  );
}
