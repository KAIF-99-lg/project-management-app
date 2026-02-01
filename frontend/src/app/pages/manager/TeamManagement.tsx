import React, { useState, useEffect } from 'react';
import ManagerLayout from '@/app/components/ManagerLayout';
import { teamsAPI, usersAPI } from '@/services/api.js';
import { Users, Plus, UserPlus, Trash2, Crown, User, AlertCircle, X } from 'lucide-react';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('Member');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, usersRes] = await Promise.all([
        teamsAPI.getAllTeams(),
        usersAPI.getAllUsers()
      ]);
      setTeams(teamsRes.data.data || []);
      setAllUsers(usersRes.data.data || []);
    } catch (error) {
      setError('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teamsAPI.createTeam({ name: newTeamName });
      setNewTeamName('');
      setShowCreateModal(false);
      fetchData(); // Refresh teams list
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create team');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !selectedUser) return;
    
    try {
      await teamsAPI.addMember(selectedTeam._id, selectedUser, selectedRole);
      setShowAddMemberModal(false);
      setSelectedTeam(null);
      setSelectedUser('');
      setSelectedRole('Member');
      fetchData(); // Refresh teams list
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    
    try {
      await teamsAPI.deleteTeam(teamId);
      fetchData(); // Refresh teams list
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete team');
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await teamsAPI.removeMember(teamId, userId);
      fetchData(); // Refresh teams list
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const openAddMemberModal = (team) => {
    setSelectedTeam(team);
    setShowAddMemberModal(true);
  };

  const getAvailableUsers = () => {
    if (!selectedTeam) return allUsers;
    const teamMemberIds = selectedTeam.members?.map(m => m.user?._id) || [];
    return allUsers.filter(user => !teamMemberIds.includes(user._id));
  };

  return (
    <ManagerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Team Management</h1>
            <p className="text-slate-500 mt-1">Create and manage your teams</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
          >
            <Plus className="w-5 h-5" />
            Create Team
          </button>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading teams...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No teams yet</h3>
            <p className="text-slate-500 mb-6">Create your first team to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
              Create Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teams.map((team) => {
              return (
                <div
                  key={team._id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition"
                >
                  <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{team.name}</h3>
                          <p className="text-sm text-slate-500">
                            Created by {team.owner?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTeam(team._id)}
                        className="p-2 hover:bg-white/50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-900">
                        Members ({team.members?.length || 0})
                      </h4>
                      <button 
                        onClick={() => openAddMemberModal(team)}
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add Member
                      </button>
                    </div>

                    <div className="space-y-3">
                      {team.members?.map((member) => {
                        return (
                          <div
                            key={member.user?._id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-indigo-600">
                                  {member.user?.name?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{member.user?.name || 'Unknown'}</p>
                                <p className="text-sm text-slate-500">{member.user?.email || 'No email'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {member.role === 'Admin' ? (
                                <span className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                  <Crown className="w-3 h-3" />
                                  Admin
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-medium">
                                  <User className="w-3 h-3" />
                                  {member.role}
                                </span>
                              )}
                              {member.role !== 'Admin' && (
                                <button
                                  onClick={() => handleRemoveMember(team._id, member.user._id)}
                                  className="p-1 hover:bg-red-100 rounded text-red-600 hover:text-red-700"
                                  title="Remove member"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {(!team.members || team.members.length === 0) && (
                        <div className="text-center py-4 text-slate-500 text-sm">
                          No members yet. Add some members to get started.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Marketing Team"
                  required
                />
              </div>

              <div className="flex gap-3">
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
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Add Member to {selectedTeam.name}
              </h2>
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedTeam(null);
                  setSelectedUser('');
                  setSelectedRole('Member');
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a user</option>
                  {getAvailableUsers().map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {getAvailableUsers().length === 0 && (
                  <p className="text-sm text-slate-500 mt-2">
                    All users are already members of this team.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Member">Member</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setSelectedTeam(null);
                    setSelectedUser('');
                    setSelectedRole('Member');
                  }}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedUser || getAvailableUsers().length === 0}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
}
