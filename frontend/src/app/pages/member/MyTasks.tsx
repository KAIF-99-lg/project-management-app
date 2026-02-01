import React, { useState, useEffect } from 'react';
import MemberLayout from '@/app/components/MemberLayout';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI } from '@/services/api.js';
import { Link } from 'react-router';
import {
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  Filter,
  Flag,
  AlertCircle,
  Eye
} from 'lucide-react';

export default function MyTasks() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getUserTasks();
      setTasks(response.data.data || []);
    } catch (error) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await tasksAPI.updateTask(taskId, { status: newStatus });
      fetchMyTasks(); // Refresh tasks
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Done':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'In Review':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'In Review':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'Done') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <MemberLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">My Tasks</h1>
            <p className="text-slate-500 mt-1">Manage your assigned tasks</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="font-medium text-slate-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading tasks...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-emerald-100">
            <div className="p-6 border-b border-emerald-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Tasks ({filteredTasks.length})
              </h2>
            </div>
            <div className="divide-y divide-emerald-100">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate, task.status);

                  return (
                    <div key={task._id} className="p-6 hover:bg-emerald-50/50 transition">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-1">{task.title}</h3>
                              <p className="text-sm text-slate-600">{task.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                <Flag className="w-3 h-3 inline mr-1" />
                                {task.priority}
                              </span>
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)}`}
                              >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="In Review">In Review</option>
                                <option value="Done">Done</option>
                              </select>
                              <Link
                                to={`/member/tasks/${task._id}`}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded"
                              >
                                <Eye className="w-3 h-3" />
                                Details
                              </Link>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Circle className="w-4 h-4" />
                              <span>{task.project?.name || 'No project'}</span>
                            </div>
                            {task.dueDate && (
                              <div className={`flex items-center gap-2 text-sm ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {overdue ? 'Overdue: ' : 'Due: '}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">No tasks found</h3>
                  <p className="text-sm text-slate-500">
                    {tasks.length === 0 ? 'No tasks assigned to you yet' : 'Try adjusting your filters'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
}
