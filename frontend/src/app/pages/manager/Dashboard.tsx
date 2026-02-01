import React, { useState, useEffect } from 'react';
import ManagerLayout from '@/app/components/ManagerLayout';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI, projectsAPI, teamsAPI } from '@/services/api.js';
import {
  TrendingUp,
  Users,
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function ManagerDashboard() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes, teamsRes] = await Promise.all([
        tasksAPI.getAllTasks(),
        projectsAPI.getAllProjects(),
        teamsAPI.getAllTeams()
      ]);
      setTasks(tasksRes.data.data || []);
      setProjects(projectsRes.data.data || []);
      setTeams(teamsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </ManagerLayout>
    );
  }

  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = tasks.filter(t => t.status === 'To Do').length;
  const totalTeams = teams.length;
  const totalMembers = teams.reduce((acc, team) => acc + (team.members?.length || 0), 0);

  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Recent tasks
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjects,
      total: totalProjects,
      icon: FolderKanban,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      label: 'Total Tasks',
      value: completedTasks,
      total: totalTasks,
      icon: ListTodo,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Team Members',
      value: totalMembers,
      total: totalTeams,
      icon: Users,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      subtitle: `${totalTeams} Teams`
    },
    {
      label: 'Completion Rate',
      value: `${completionPercentage}%`,
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-amber-100 text-amber-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <ManagerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-semibold text-slate-900">
                        {stat.value}
                      </p>
                      {stat.total && (
                        <span className="text-sm text-slate-500">/ {stat.total}</span>
                      )}
                    </div>
                    {stat.subtitle && (
                      <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Task Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">To Do</h3>
              <span className="text-2xl font-semibold text-slate-400">{todoTasks}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-slate-400 h-2 rounded-full transition-all"
                style={{ width: `${totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">In Progress</h3>
              <span className="text-2xl font-semibold text-blue-600">{inProgressTasks}</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Completed</h3>
              <span className="text-2xl font-semibold text-emerald-600">{completedTasks}</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Recent Tasks</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {recentTasks.length > 0 ? recentTasks.map((task) => {
              return (
                <div key={task._id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-slate-500">
                            Team: {task.project?.team?.name || 'No team'}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            Project: {task.project?.name || 'No project'}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            Assigned to: {task.assignedTo?.name || 'Unassigned'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="p-6 text-center text-slate-500">
                No tasks found
              </div>
            )}
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}
