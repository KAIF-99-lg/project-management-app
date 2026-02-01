import React from 'react';
import ManagerLayout from '@/app/components/ManagerLayout';
import {
  History,
  ListTodo,
  UserPlus,
  FolderKanban,
  Users,
  CheckCircle2
} from 'lucide-react';

export default function ActivityLogs() {
  return (
    <ManagerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Activity Logs</h1>
          <p className="text-slate-500 mt-1">Activity tracking coming soon</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Activity Logs</h3>
          <p className="text-slate-500">Activity tracking will be implemented in a future update</p>
        </div>
      </div>
    </ManagerLayout>
  );
}
