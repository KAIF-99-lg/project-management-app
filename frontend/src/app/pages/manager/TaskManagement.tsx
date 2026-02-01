import React, { useState, useEffect } from 'react';
import ManagerLayout from '@/app/components/ManagerLayout';
import { tasksAPI, projectsAPI, teamsAPI } from '@/services/api.js';
import { ListTodo, Plus, Calendar, User, AlertCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team: '',
    project: '',
    assignedTo: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    dueDate: ''
  });

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
      setError('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamProjects = (teamId: string) => {
    const teamProjects = projects.filter(p => p.team._id === teamId);
    return teamProjects;
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const membersRes = await teamsAPI.getTeamMembers(teamId);
      setTeamMembers(membersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    }
  };

  const handleTeamChange = (teamId: string) => {
    setFormData({ ...formData, team: teamId, project: '', assignedTo: '' });
    setTeamMembers([]);
    if (teamId) {
      fetchTeamMembers(teamId);
    }
  };

  const handleProjectChange = (projectId: string) => {
    setFormData({ ...formData, project: projectId, assignedTo: '' });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tasksAPI.createTask(formData);
      setFormData({
        title: '',
        description: '',
        project: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: ''
      });
      setTeamMembers([]);
      setShowCreateModal(false);
      fetchData();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await tasksAPI.deleteTask(taskId);
      fetchData();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
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
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <ManagerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Task Management</h1>
            <p className="text-slate-500 mt-1">Create and assign tasks to team members</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </button>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading tasks...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">All Tasks ({tasks.length})</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <ListTodo className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks yet</h3>
                  <p className="text-slate-500 mb-6">Create your first task to get started</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Create Task
                  </button>
                </div>
              ) : (
                tasks.map((task) => {
                  return (
                    <div key={task._id} className="p-6 hover:bg-slate-50 transition">
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
                                {task.priority}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-1 hover:bg-red-100 rounded text-red-600 hover:text-red-700"
                                title="Delete task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                            <div className="flex items-center gap-6 flex-wrap">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <ListTodo className="w-4 h-4" />
                                <span>{task.project?.name || 'No project'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <User className="w-4 h-4" />
                                <span>{task.assignedTo?.name || 'Unassigned'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span>Team: {task.project?.team?.name || 'No team'}</span>
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl my-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Build landing page"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Task details..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Team *
                  </label>
                  <select
                    value={formData.team}
                    onChange={(e) => handleTeamChange(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select team</option>
                    {teams.map(team => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project *
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                    disabled={!formData.team}
                  >
                    <option value="">Select project</option>
                    {formData.team && fetchTeamProjects(formData.team).map(project => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))}
                  </select>
                  {!formData.team && (
                    <p className="text-sm text-slate-500 mt-1">Select a team first</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Assign To *
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                    disabled={!formData.team}
                  >
                    <option value="">Select member</option>
                    {teamMembers.map(member => (
                      <option key={member.user._id} value={member.user._id}>
                        {member.user.name}
                      </option>
                    ))}
                  </select>
                  {!formData.team && (
                    <p className="text-sm text-slate-500 mt-1">Select a team first</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' | 'Critical' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
}
