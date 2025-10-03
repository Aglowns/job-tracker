'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface Followup {
  id: string;
  due_at: string;
  kind: string;
  sent_at: string | null;
}

interface Application {
  id: string;
  title: string;
  company: string;
  location: string | null;
  job_url: string | null;
  job_id: string | null;
  source: string;
  applied_at: string;
  status: string;
  needs_review: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  followups?: Followup[];
}

const statusOptions = [
  'Applied',
  'PhoneScreen',
  'Interview',
  'Offer',
  'Rejected',
  'Ghosted',
];

export function ApplicationDetail({ application: initialApp }: { application: Application }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [application, setApplication] = useState(initialApp);
  const [formData, setFormData] = useState({
    status: application.status,
    notes: application.notes || '',
  });

  const handleUpdate = async () => {
    setSaving(true);
    
    try {
      const response = await fetch(`${API_URL}/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setApplication(data.application);
        setEditing(false);
        router.refresh();
      } else {
        alert('Error updating application');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating application');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{application.title}</h1>
          <p className="mt-1 text-lg text-gray-600">{application.company}</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              {editing ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-gray-900">{application.status}</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Date Applied</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {format(new Date(application.applied_at), 'MMMM d, yyyy')}
            </dd>
          </div>

          {application.location && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{application.location}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500">Source</dt>
            <dd className="mt-1 text-sm text-gray-900">{application.source}</dd>
          </div>

          {application.job_url && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Job URL</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {application.job_url}
                </a>
              </dd>
            </div>
          )}

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1">
              {editing ? (
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              ) : (
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {application.notes || 'No notes'}
                </p>
              )}
            </dd>
          </div>
        </dl>

        {editing && (
          <div className="mt-6">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {application.followups && application.followups.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Follow-ups</h2>
          <div className="space-y-3">
            {application.followups.map((followup) => (
              <div
                key={followup.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {followup.kind === 'PLUS_7D' ? '+7 days' : '+14 days'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {format(new Date(followup.due_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  {followup.sent_at ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Sent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Application Created</p>
              <p className="text-sm text-gray-500">
                {format(new Date(application.created_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
          {application.updated_at !== application.created_at && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(application.updated_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

