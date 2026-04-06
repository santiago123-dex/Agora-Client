type WorkspaceCard = {
  id: string;
  title: string;
  membersLabel: string;
  roleLabel: string;
  accentColor: string;
  statusLabel: string;
  statusVariant: "pending" | "done";
};

const mockWorkspaces: WorkspaceCard[] = [
  {
    id: "workspace-1",
    title: "Matematicas Avanzadas",
    membersLabel: "32 miembros",
    roleLabel: "Creador",
    accentColor: "#0E6174",
    statusLabel: "8 por calificar",
    statusVariant: "pending",
  },
  {
    id: "workspace-2",
    title: "Fisica I",
    membersLabel: "28 miembros",
    roleLabel: "Creador",
    accentColor: "#359677",
    statusLabel: "5 por calificar",
    statusVariant: "pending",
  },
  {
    id: "workspace-3",
    title: "Lengua Castellana",
    membersLabel: "16 miembros",
    roleLabel: "Creador",
    accentColor: "#56AEB1",
    statusLabel: "16 por calificar",
    statusVariant: "pending",
  },
  {
    id: "workspace-4",
    title: "Grupo 4B",
    membersLabel: "20 miembros",
    roleLabel: "Creador",
    accentColor: "#8A56B6",
    statusLabel: "Todo listo",
    statusVariant: "done",
  },
  {
    id: "workspace-5",
    title: "Ficha 3144622",
    membersLabel: "10 miembros",
    roleLabel: "Creador",
    accentColor: "#FFA63A",
    statusLabel: "Todo listo",
    statusVariant: "done",
  },
];

export default function WorkspacePage() {
  return (
    <section className="px-7 py-6 pb-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Mis espacios"
              className="relative flex h-6 w-11 items-center rounded-full bg-[#0E6174] px-1 shadow-sm"
            >
              <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
            </button>
            <span className="text-sm font-medium text-slate-700">Mis espacios</span>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 self-start rounded-md bg-[#275D79] px-3 py-2 text-sm font-medium text-white shadow-sm md:self-auto"
          >
            <span className="text-base leading-none">+</span>
            Crear Espacio
          </button>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {mockWorkspaces.map((workspace) => (
            <article
              key={workspace.id}
              className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            >
              <div
                className="flex min-h-17 items-end justify-between gap-3 px-3 pb-3"
                style={{ backgroundColor: workspace.accentColor }}
              >
                <span className="rounded-sm bg-white/18 px-2 py-0.5 text-[0.62rem] font-medium text-white backdrop-blur-sm">
                  {workspace.roleLabel}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[0.62rem] font-medium ${
                    workspace.statusVariant === "done"
                      ? "bg-white text-[#1A936F]"
                      : "bg-white text-slate-700"
                  }`}
                >
                  {workspace.statusVariant === "done" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m20 6-11 11-5-5" />
                    </svg>
                  ) : null}
                  {workspace.statusLabel}
                </span>
              </div>

              <div className="space-y-1 px-4 py-4 [@media(min-width:1450px)]:py-7">
                <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">
                  {workspace.title}
                </h3>
                <p className="text-sm text-slate-500">{workspace.membersLabel}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
