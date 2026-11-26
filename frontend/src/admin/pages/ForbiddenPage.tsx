import { passwordlessAuthApi } from '../../lib/api/auth';

export default function ForbiddenPage() {
  const user = passwordlessAuthApi.getCurrentUser();

  return (
    <div className="min-h-screen bg-[#04140c] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-[rgba(110,231,183,0.18)] bg-[rgba(10,42,26,0.7)] backdrop-blur-md p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-950/60 border border-rose-700/50 text-rose-400 mb-6">
          <span className="text-2xl font-bold font-heading">403</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
          Access Restricted
        </h1>
        <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
          Your account ({user?.email || 'Logged in user'}) does not have permission to access the SCNSWF Administrative Console.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Return to Home
          </a>
          <button
            onClick={async () => {
              await passwordlessAuthApi.logout();
              window.location.href = '/login?next=/admin';
            }}
            className="w-full sm:w-auto rounded-lg border border-zinc-700 bg-zinc-800/40 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
