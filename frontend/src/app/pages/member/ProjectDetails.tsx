import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import MemberLayout from '@/app/components/MemberLayout';
import { projectsAPI, teamsAPI } from '@/services/api.js';
import { ArrowLeft, Users, Target, FolderKanban } from 'lucide-react';

export default function MemberProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
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
      const projectRes = await projectsAPI.getProjectById(id);
      const projectData = projectRes.data.data;
      setProject(projectData);
      
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

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading project details...</div>
        </div>
      </MemberLayout>
    );
  }

  if (error || !project) {
    return (
      <MemberLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Project not found</h2>
          <p className="text-slate-500 mb-6">{error || 'The project you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/member/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/member/dashboard"
            className="p-2 hover:bg-emerald-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-1">Project Details</p>
          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-xl border border-emerald-100 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Project Overview</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                  project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {project.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.priority === 'High' ? 'bg-red-100 text-red-700' :
                  project.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {project.priority} Priority
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-xl border border-emerald-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Project Description
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {project.description || 'No description provided for this project.'}
          </p>
        </div>

        {/* Project Goals */}
        <div className="bg-white rounded-xl border border-emerald-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Goals</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
              <p className="text-slate-600">Deliver high-quality results within the specified timeline</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
              <p className="text-slate-600">Collaborate effectively with team members</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
              <p className="text-slate-600">Meet all project requirements and specifications</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
              <p className="text-slate-600">Maintain clear communication throughout the project lifecycle</p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-emerald-100">
          <div className="p-6 border-b border-emerald-100">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Team Members Involved ({teamMembers.length})
            </h3>
          </div>
          <div className="p-6">
            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.user._id} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-emerald-600">
                        {member.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{member.user.name}</p>
                      <p className="text-sm text-slate-500">{member.user.email}</p>
                      <span className="text-xs px-2 py-1 bg-emerald-200 text-emerald-700 rounded-full">
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No team members assigned to this project</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Timeline */}
        <div className="bg-white rounded-xl border border-emerald-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.startDate && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Start Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(project.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            {project.endDate && (
              <div>
                <p className="text-sm text-slate-600 mb-1">End Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(project.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
          {project.progress !== undefined && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Overall Progress</p>
                <p className="text-sm font-medium text-slate-900">{project.progress}%</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  );
}