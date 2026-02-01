import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import MemberLayout from '@/app/components/MemberLayout';
import { tasksAPI } from '@/services/api.js';
import { ArrowLeft, Target, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTaskById(id);
      setTask(response.data.data);
    } catch (error) {
      setError('Failed to load task details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await tasksAPI.updateTask(id, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      setError('Failed to update task status');
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case 'In Progress':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'In Review':
        return <AlertCircle className="w-6 h-6 text-amber-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading task details...</div>
        </div>
      </MemberLayout>
    );
  }

  if (error || !task) {
    return (
      <MemberLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Task not found</h2>
          <p className="text-slate-500 mb-6">{error || 'The task you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/member/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
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
            to="/member/tasks"
            className="p-2 hover:bg-emerald-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-slate-900">{task.title}</h1>
            <p className="text-slate-500 mt-1">Task Details</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              task.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
              task.status === 'In Review' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {task.status}
            </span>
          </div>
        </div>

        {/* Task Requirements */}
        <div className="bg-white rounded-xl border border-emerald-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Task Requirements
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">What needs to be done:</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2"></div>
                  <span>Complete the assigned task according to specifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2"></div>
                  <span>Follow project guidelines and standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2"></div>
                  <span>Communicate progress and any blockers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2"></div>
                  <span>Test and validate the work before marking as complete</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Task Description */}
        <div className="bg-white rounded-xl border border-emerald-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Task Description
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {task.description || 'No detailed description provided for this task.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-emerald-100">
            <div>
              <p className="text-sm text-slate-600 mb-1">Project</p>
              <p className="font-medium text-slate-900">{task.project?.name || 'No project'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Priority</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority}
              </span>
            </div>
            {task.dueDate && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Due Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-600 mb-1">Created By</p>
              <p className="font-medium text-slate-900">{task.createdBy?.name || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Expected Outcome */}
        <div className="bg-white rounded-xl border border-emerald-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Expected Outcome</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <p className="text-slate-600">Task completed according to requirements and specifications</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <p className="text-slate-600">All deliverables meet quality standards</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <p className="text-slate-600">Documentation and testing completed where applicable</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <p className="text-slate-600">Task status updated to reflect current progress</p>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-xl border border-emerald-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Update Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['To Do', 'In Progress', 'In Review', 'Done'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={updating || task.status === status}
                className={`p-3 rounded-lg border-2 transition ${
                  task.status === status
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-center">
                  {getStatusIcon(status)}
                  <p className="text-sm font-medium mt-1">{status}</p>
                </div>
              </button>
            ))}
          </div>
          {updating && (
            <p className="text-sm text-slate-500 mt-3">Updating status...</p>
          )}
        </div>
      </div>
    </MemberLayout>
  );
}