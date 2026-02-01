import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import ManagerLayout from '@/app/components/ManagerLayout';
import { projectsAPI, tasksAPI, teamsAPI } from '@/services/api.js';
import { ArrowLeft, Users, ListTodo, Calendar, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        projectsAPI.getProjectById(id),
        tasksAPI.getAllTasks()
      ]);
      
      const projectData = projectRes.data.data;
      setProject(projectData);
      
      // Filter tasks for this project
      const projectTasks = tasksRes.data.data.filter(task => task.project._id === id);
      setTasks(projectTasks);
      
      // Get team members
      if (projectData.team) {
        const membersRes = await teamsAPI.getTeamMembers(projectData.team._id);
        setTeamMembers(membersRes.data.data || []);
      }
    } catch (error) {
      setError('Failed to load project details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading project details...</div>
        </div>
      </ManagerLayout>
    );
  }

  if (error || !project) {
    return (
      <ManagerLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Project not found</h2>
          <p className="text-slate-500 mb-6">{error || 'The project you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/manager/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/manager/projects"
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-1">Project Details</p>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600">{project.description || 'No description provided'}</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Assigned Team</h3>
              <p className="text-slate-600">{project.team?.name || 'No team assigned'}</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {project.status}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Priority</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.priority === 'High' ? 'bg-red-100 text-red-700' :
                project.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {project.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({teamMembers.length})
            </h2>
          </div>
          <div className="p-6">
            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.user._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {member.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{member.user.name}</p>
                      <p className="text-sm text-slate-500">{member.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No team members assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <ListTodo className="w-5 h-5" />
              Project Tasks ({tasks.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {tasks.length > 0 ? tasks.map((task) => (
              <div key={task._id} className="p-6 hover:bg-slate-50 transition">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-medium text-slate-900">{task.title}</h3>
                        <p className="text-sm text-slate-600">{task.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Assigned to: {task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center">
                <ListTodo className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tasks created for this project yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}