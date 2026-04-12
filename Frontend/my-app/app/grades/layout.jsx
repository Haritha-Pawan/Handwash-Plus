import Link from "next/link";

export default function GradesLayout({ children }) {
  return (
    <>
      <style>{`
        nav { display: none !important; }
      `}</style>
      <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Grades Management</h1>
              <p className="mt-1 text-slate-500 text-sm">
                Monitor sanitizer levels and manage grade records.
              </p>
            </div>
            <Link
              href="/sanitizer-report"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
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