'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

function CaptureForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    job_url: '',
    notes: '',
  });

  // Handle prefill from URL params or shared data
  useEffect(() => {
    const dataParam = searchParams.get('d');
    
    if (dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam));
        setPrefilling(true);
        
        // Get prefill from API
        fetch(`${API_URL}/capture/shared`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(decoded),
        })
          .then((res) => res.json())
          .then((data) => {
            setForm({
              title: data.prefill.title || '',
              company: data.prefill.company || '',
              location: data.prefill.location || '',
              job_url: data.prefill.job_url || '',
              notes: '',
            });
          })
          .catch((error) => {
            console.error('Error prefilling:', error);
          })
          .finally(() => {
            setPrefilling(false);
          });
      } catch (error) {
        console.error('Error parsing data:', error);
        setPrefilling(false);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'Share',
        }),
      });

      if (response.ok) {
        router.push('/?toast=Application saved');
      } else {
        alert('Error saving application');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              ← Back
            </Link>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Add Job Application
            </h1>

            {prefilling && (
              <div className="mb-4 p-4 bg-blue-50 rounded">
                <p className="text-blue-800">Analyzing shared content...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job URL
                </label>
                <input
                  type="url"
                  value={form.job_url}
                  onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Application'}
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CapturePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CaptureForm />
    </Suspense>
  );
}

