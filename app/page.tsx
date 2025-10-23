'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: 'gemini-1.5-flash', // or 'gemini-1.5-pro'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResponse(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
              Gemini API Demo
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              Test the Gemini API through your Next.js backend
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Enter your prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Gemini anything..."
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none"
                  rows={4}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Response'}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  Error: {error}
                </p>
              </div>
            )}

            {response && (
              <div className="mt-6 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Response:
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Setup Instructions:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                Get your API key from{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Google AI Studio
                </a>
              </li>
              <li>Add your API key to the <code className="bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded">.env.local</code> file</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 py-6">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              &copy; {new Date().getFullYear()} Gemini API Demo. Built with Next.js
            </p>
            <div className="flex gap-6">
              <a
                href="https://ai.google.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors"
              >
                Gemini Docs
              </a>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors"
              >
                Next.js Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
