export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="rounded-lg border border-white/10 bg-slate-900 px-6 py-4 text-slate-300">
        {text}
      </div>
    </div>
  );
}