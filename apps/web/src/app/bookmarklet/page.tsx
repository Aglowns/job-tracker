'use client';

import Link from 'next/link';

const ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

const bookmarkletCode = `javascript:(function(){const payload={url:location.href,title:document.title,text:(document.querySelector('h1')?.innerText||'').slice(0,200)};open('${ORIGIN}/capture?d='+encodeURIComponent(btoa(JSON.stringify(payload))),'_blank');})();`;

export default function BookmarkletPage() {
  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    alert('Bookmarklet code copied! Now create a bookmark and paste this as the URL.');
  };

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

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Job Tracker Bookmarklet
            </h1>

            <p className="text-gray-700 mb-6">
              Drag the button below to your bookmarks bar, or copy the code and create
              a bookmark manually.
            </p>

            <div className="mb-6">
              <a
                href={bookmarkletCode}
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 cursor-move"
                onClick={(e) => e.preventDefault()}
              >
                📌 Job Tracker
              </a>
              <p className="text-sm text-gray-600 mt-2">
                ← Drag this to your bookmarks bar
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Manual Setup:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Click the button below to copy the code</li>
                <li>Create a new bookmark in your browser</li>
                <li>Paste the code as the bookmark URL</li>
                <li>Name it "Job Tracker" or anything you like</li>
              </ol>
            </div>

            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Copy Bookmarklet Code
            </button>

            <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-600 font-mono break-all">
                {bookmarkletCode}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">How to Use:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Navigate to any job posting page</li>
                <li>Click your "Job Tracker" bookmark</li>
                <li>A new tab will open with the job details pre-filled</li>
                <li>Review and save the application</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

