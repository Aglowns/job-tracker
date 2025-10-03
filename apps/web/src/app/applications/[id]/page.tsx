import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplicationDetail } from '@/components/ApplicationDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function getApplication(id: string) {
  try {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.application;
  } catch (error) {
    console.error('Error fetching application:', error);
    return null;
  }
}

export default async function ApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await getApplication(params.id);

  if (!application) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              ← Back to Applications
            </Link>
          </div>

          <ApplicationDetail application={application} />
        </div>
      </div>
    </main>
  );
}

