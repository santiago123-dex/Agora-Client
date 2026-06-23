import Link from "next/link";
import { ArrowRight } from "lucide-react";

type DashboardSectionHeaderProps = {
  title: string;
  href: string;
};

export default function DashboardSectionHeader({
  title,
  href,
}: DashboardSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-[1.35rem] font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-[#275D79]"
      >
        Ver todos
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
