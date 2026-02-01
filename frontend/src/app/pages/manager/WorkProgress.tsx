import React from 'react';
import ManagerLayout from '@/app/components/ManagerLayout';
import { TrendingUp } from 'lucide-react';

export default function WorkProgress() {
  return (
    <ManagerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Work Progress</h1>
          <p className="text-slate-500 mt-1">Progress analytics coming soon</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Work Progress</h3>
          <p className="text-slate-500">Progress analytics will be implemented in a future update</p>
        </div>
      </div>
    </ManagerLayout>
  );
}