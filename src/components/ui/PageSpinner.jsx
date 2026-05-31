export default function PageSpinner() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Loading…</span>
      </div>
    </div>
  )
}
