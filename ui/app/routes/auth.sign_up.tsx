import { Link, useNavigate } from '@remix-run/react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { AuthAPI } from '../api';
import { AxiosError } from 'axios';

export default function SignUp() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      const data = await AuthAPI.signIn(email, password);
      setUser({ id: data.id, email: data.email });
      navigate('/user/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Sign in failed');
    }
  }

  return (
    <div className="relative w-full">
      <Link
        to="/"
        className="absolute -top-6 -right-6 p-2 rounded-full bg-white border border-white hover:bg-purple-700 hover:border-white transition-colors shadow-lg"
        title="Back to Home"
        style={{ zIndex: 10 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-7 h-7 text-purple-700 hover:text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>
      <form className="flex flex-col gap-6 w-full" method="post" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-white text-center">Sign Up</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="px-4 py-3 rounded bg-purple-900 text-white placeholder-purple-300 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="px-4 py-3 rounded bg-purple-900 text-white placeholder-purple-300 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          className="w-full py-3 rounded bg-purple-700 hover:bg-purple-600 text-white font-semibold shadow-lg transition-colors"
        >
          Create Account
        </button>
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
        <p className="text-center text-purple-300 text-sm mt-2">
          Already registered?{' '}
          <Link to="/auth/sign_in" className="text-white hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
