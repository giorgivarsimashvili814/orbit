import { Navigate, Outlet, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useWorkspace } from "@/context/workspace/useWorkspace";
import { useTeam } from "@/context/team/useTeam";
import { TeamProvider } from "@/context/team/TeamProvider";
import { Spinner } from "./ui/spinner";

function DashboardContent() {
  const { loading } = useTeam();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex h-screen bg-[#f3f3f4] p-2 gap-2">
      <Sidebar />
      <main className="basis-4/5 bg-white rounded-lg">
        <Outlet />
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  const { slug } = useParams();
  const { workspaces } = useWorkspace();

  const currentWorkspace = workspaces.find((ws) => ws.slug === slug);

  if (!currentWorkspace) return <Navigate to="/" replace />;

  return (
    <TeamProvider workspaceSlug={slug!}>
      <DashboardContent />
    </TeamProvider>
  );
}
