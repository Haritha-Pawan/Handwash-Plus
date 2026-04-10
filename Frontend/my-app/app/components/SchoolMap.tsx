"use client";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const SchoolMapInner = dynamic(() => import("./SchoolMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 rounded-3xl animate-pulse flex flex-col items-center justify-center border border-slate-200">
      <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-3" />
      <span className="text-slate-500 font-medium">Loading Map...</span>
    </div>
  ),
});

export function SchoolMap(props: React.ComponentProps<typeof SchoolMapInner>) {
  return <SchoolMapInner {...props} />;
}
