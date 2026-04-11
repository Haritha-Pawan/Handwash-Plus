export default function GradesLayout({ children }) {
  return (
    <>
      <style>{`
        nav { display: none !important; }
      `}</style>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Grades Management</h1>
          <p className="mt-2 text-slate-400">
            Manage grades using the backend Grades API
          </p>
        </div>
        {children}
      </div>
    </div>
    </>
  );
}