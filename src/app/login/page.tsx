import { loginAction } from '@data/auth/auth.repository';
import Link from 'next/link';

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const error = (await searchParams).error;
  
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<form action={loginAction} className="w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-semibold">Login</h1>
				{error && (
				<p className="text-red-600 text-sm">{decodeURIComponent(error)}</p>
				)}
				<div className="space-y-2">
					<label htmlFor="email" className="block text-sm">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						className="w-full border rounded px-3 py-2"
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="password" className="block text-sm">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						className="w-full border rounded px-3 py-2"
					/>
				</div>
				<button className="w-full bg-black text-white rounded py-2">
					Sign in
				</button>
				<p className="text-sm text-center text-gray-600">
					No account?{" "}
					<Link className="underline" href="/signup">
						Sign up
					</Link>
				</p>
			</form>
		</div>
	);
}
