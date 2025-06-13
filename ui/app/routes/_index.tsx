import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => [
  { title: 'Snipify - AI Snippet Service' },
  { name: 'description', content: 'Summarize and manage your text snippets with AI.' },
];

export default function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-purple-700">
      <div className="flex flex-col items-center gap-10 p-8 rounded-2xl shadow-2xl bg-purple-950/80 border border-purple-800">
        <img src="/logo-dark.png" alt="Snipify Logo" className="w-32 mb-4" />
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight select-none">
          S-n-i-p-i-f-y ✂️
        </h1>
        <p className="text-lg text-purple-200 mb-6 text-center max-w-xl select-none">
          Effortlessly summarize and manage your text snippets with AI. Paste your text, get a
          concise summary, and organize your knowledge.
        </p>
        <Link
          to="/auth/sign_up"
          className="px-6 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-semibold shadow-lg transition-colors"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
