const joinedWorkspaces = [
  {
    title: "Quimica Organica",
    subtitle: "Prof. Garcia",
    roleLabel: "Miembro",
    accentColor: "#C44F4C",
  },
  {
    title: "Programacion Web",
    subtitle: "Prof. Rodriguez",
    roleLabel: "Miembro",
    accentColor: "#DC8738",
  },
];

export default function JoinedWorkspaceSection() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {joinedWorkspaces.map((workspace) => (
        <article
          key={workspace.title}
          className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.05)]"
        >
          <div
            className="flex h-16 items-end px-3 pb-3"
            style={{ backgroundColor: workspace.accentColor }}
          >
            <span className="rounded-md bg-white/18 px-2 py-1 text-[0.68rem] font-medium text-white backdrop-blur-sm">
              {workspace.roleLabel}
            </span>
          </div>

          <div className="space-y-1 px-4 py-4 [@media(min-width:1450px)]:py-7">
            <h4 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
              {workspace.title}
            </h4>
            <p className="text-sm text-slate-500">{workspace.subtitle}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
