import Link from "next/link";

export default function GradesLayout({ children }) {
  return (
    <>
      <style>{`
        nav { display: none !important; }
      `}</style>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Grades Management</h1>
              <p className="mt-1 text-slate-400 text-sm">
                Monitor sanitizer levels and manage grade records.
              </p>
            </div>
            <Link
              href="/sanitizer-report"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-300 hover:bg-sky-400/20 transition-colors"
            >
              📄 View Sanitizer Report
            </Link>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}