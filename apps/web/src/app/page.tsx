import Link from 'next/link';
import { ApplicationList } from '@/components/ApplicationList';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function getApplications() {
  try {
    const res = await fetch(`${API_URL}/applications`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    const data = await res.json();
    return data.applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

export default async function Home() {
  const applications = await getApplications();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
            <div className="space-x-2">
              <Link
                href="/capture"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                + Add Application
              </Link>
              <Link
                href="/bookmarklet"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Bookmarklet
              </Link>
            </div>
          </div>

          <ApplicationList applications={applications} />
        </div>
      </div>
    </main>
  );
}

