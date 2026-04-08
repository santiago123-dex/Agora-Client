import WorkspaceDetails from "@/app/src/features/dashboard/components/workspacePage/workspaces/workspaceDetailPage.tsx/workspaceDetails";

type Props = {
    params : Promise<{
        workspaceId : string
    }>
}

// destructurin para recibir el objeto de params
export default async function WorkspaceId({params} : Props) {
    // destructuring, manera mas abreviada para recibir el id del workspace
    const {workspaceId} = await params;
  return (
    <WorkspaceDetails workspaceId={workspaceId}></WorkspaceDetails>
)
}
