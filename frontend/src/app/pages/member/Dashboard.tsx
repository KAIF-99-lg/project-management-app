import React, { useState, useEffect } from 'react';
import MemberLayout from '@/app/components/MemberLayout';
import { useAuth } from '@/context/AuthContext';
import { teamsAPI, projectsAPI, tasksAPI, usersAPI } from '@/services/api.js';
import { Link } from 'react-router';
import {
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Loader2,
  Users,
  FolderKanban,
  Eye
} from 'lucide-react';

export default function MemberDashboard() {
  const { currentUser } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, teamsRes, projectsRes] = await Promise.all([
        tasksAPI.getUserTasks(),
        usersAPI.getUserTeams(),
        usersAPI.getUserProjects()
      ]);
      
      setMyTasks(tasksRes.data.data || []);
      setMyTeams(teamsRes.data.data || []);
      setMyProjects(projectsRes.data.data || []);
      
    } catch (error) {
      setError('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </MemberLayout>
    );
  }

  const completedTasks = myTasks.filter(t => t.status === 'Done');
  const inProgressTasks = myTasks.filter(t => t.status === 'In Progress');
  const todoTasks = myTasks.filter(t => t.status === 'To Do');

  const completionPercentage = myTasks.length > 0 
    ? Math.round((completedTasks.length / myTasks.length) * 100) 
    : 0;

  // Get upcoming tasks (sorted by due date)
  const upcomingTasks = myTasks
    .filter(t => t.status !== 'Done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Tasks',
      value: myTasks.length,
      icon: Circle,
      color: 'slate',
      bgColor: 'bg-slate-50',
      iconColor: 'text-slate-600'
    },
    {
      label: 'In Progress',
      value: inProgressTasks.length,
      icon: Clock,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle2,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'To Do',
      value: todoTasks.length,
      icon: AlertCircle,
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <MemberLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-slate-500 mt-1">Here's an overview of your tasks</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 border border-emerald-100 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* My Teams & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Teams */}
          <div className="bg-white rounded-xl border border-emerald-100">
            <div className="p-6 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">My Teams</h3>
                  <p className="text-sm text-slate-500">Teams you're part of</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {myTeams.length > 0 ? (
                <div className="space-y-3">
                  {myTeams.slice(0, 3).map((team) => {
                    const myRole = team.members?.find(member => member.user?._id === currentUser?.id)?.role;
                    return (
                      <div key={team._id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{team.name}</p>
                              <p className="text-xs text-slate-500">{team.members?.length || 0} members</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {myRole}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-700">Team Members:</h4>
                          <div className="flex flex-wrap gap-2">
                            {team.members?.slice(0, 4).map((member) => (
                              <div key={member.user._id} className="flex items-center gap-1 text-xs text-slate-600">
                                <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center">
                                  <span className="text-xs">{member.user.name.charAt(0)}</span>
                                </div>
                                <span>{member.user.name}</span>
                              </div>
                            ))}
                            {team.members?.length > 4 && (
                              <span className="text-xs text-slate-500">+{team.members.length - 4} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {myTeams.length > 3 && (
                    <p className="text-sm text-slate-500 text-center pt-2">
                      +{myTeams.length - 3} more teams
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Not assigned to any teams yet</p>
                </div>
              )}
            </div>
          </div>

          {/* My Projects */}
          <div className="bg-white rounded-xl border border-emerald-100">
            <div className="p-6 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">My Projects</h3>
                  <p className="text-sm text-slate-500">Projects assigned to your teams</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {myProjects.length > 0 ? (
                <div className="space-y-3">
                  {myProjects.slice(0, 3).map((project) => {
                    const getStatusColor = (status) => {
                      switch (status) {
                        case 'Active': return 'bg-emerald-100 text-emerald-700';
                        case 'Completed': return 'bg-blue-100 text-blue-700';
                        case 'On Hold': return 'bg-amber-100 text-amber-700';
                        default: return 'bg-slate-100 text-slate-700';
                      }
                    };
                    
                    return (
                      <div key={project._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FolderKanban className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{project.name}</p>
                            <p className="text-xs text-slate-500">{project.team?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <Link
                            to={`/member/projects/${project._id}`}
                            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {myProjects.length > 3 && (
                    <p className="text-sm text-slate-500 text-center pt-2">
                      +{myProjects.length - 3} more projects
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No projects assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Overall Progress</h3>
                <p className="text-sm text-slate-500">Your task completion rate</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-emerald-600">{completionPercentage}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl border border-emerald-100">
          <div className="p-6 border-b border-emerald-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Upcoming Tasks</h2>
              <Link
                to="/member/tasks"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-emerald-100">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const project = myProjects.find(p => p._id === task.project);
                const overdue = isOverdue(task.dueDate);

                return (
                  <Link
                    key={task.id}
                    to={`/member/tasks/${task.id}`}
                    className="block p-6 hover:bg-emerald-50/50 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="mt-1">
                            {task.status === 'In Progress' ? (
                              <Clock className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 mb-1">{task.title}</h3>
                            <p className="text-sm text-slate-600 line-clamp-1">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap ml-8">
                          <span className="text-xs text-slate-500">{project?.name || 'Unknown Project'}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority} Priority
                          </span>
                          <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-600' : 'text-slate-500'}`}>
                            <Calendar className="w-3 h-3" />
                            <span>
                              {overdue ? 'Overdue: ' : 'Due: '}
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900 mb-1">
                          {task.progress}%
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-medium text-slate-900 mb-1">All caught up!</h3>
                <p className="text-sm text-slate-500">You have no pending tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
