import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  Link,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { AuthProvider } from './context/AuthContext';
import './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-purple-950">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans bg-purple-950 text-white min-h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <Outlet />
  </AuthProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-purple-700">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl shadow-2xl bg-purple-950/90 border border-purple-800">
        <img src="/logo-dark.png" alt="Snipify Logo" className="w-20 mb-2" />
        <h1 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong.</h1>
        <p className="text-purple-200 mb-4 text-center max-w-md">
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
        <Link
          to="/"
          className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-semibold shadow-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
