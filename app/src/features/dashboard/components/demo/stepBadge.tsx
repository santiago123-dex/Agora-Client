export default function StepBadge({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#275D79]/10 text-[10px] font-semibold text-[#275D79]">
        {step}
      </span>
      <span>Paso {step} de {total}</span>
      <div className="ml-2 flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`h-1 w-4 rounded-full ${i < step ? "bg-[#275D79]" : "bg-slate-200 dark:bg-slate-700"}`} />
        ))}
      </div>
    </div>
  );
}
