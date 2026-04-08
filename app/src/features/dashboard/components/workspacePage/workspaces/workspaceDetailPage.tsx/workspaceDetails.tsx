import { adminWorkspaces, memberWorkspaces } from "../../data/workspace"
import WorkspaceAdmin from "../admin/workspaceAdmin";
import WorkspaceMember from "../member/workspaceMember";

type WorkspaceDetailsProps = {
  workspaceId: string
}


export default function WorkspaceDetails({ workspaceId }: WorkspaceDetailsProps) {
  const allWorkspaces = [...adminWorkspaces, ...memberWorkspaces];

  const workspace = allWorkspaces.find((item) => item.id === workspaceId);

  if (!workspace) {
    return <div>Workspace no encontrado</div>;
  }
  
  if (workspace?.roleLabel === "admin") {
    return (
      <WorkspaceAdmin></WorkspaceAdmin>
    )
  } else {
    return (
      <WorkspaceMember></WorkspaceMember>
    )
  }

}