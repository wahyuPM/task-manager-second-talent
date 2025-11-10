import { signupAction } from '@data/auth/auth.repository';
import Link from 'next/link';

export default function SignupPage({ searchParams }: { searchParams?: { error?: string } }) {
  const error = searchParams?.error;
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form action={signupAction} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign up</h1>
        {error && (
          <p className="text-red-600 text-sm">{decodeURIComponent(error)}</p>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm">Email</label>
          <input id="email" name="email" type="email" required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm">Password</label>
          <input id="password" name="password" type="password" required className="w-full border rounded px-3 py-2" />
        </div>
        <button type='submit' className="w-full bg-black text-white rounded py-2">Create account</button>
        <p className="text-sm text-center text-gray-600">
          Already have an account? <Link className="underline" href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
