import { Navigate, Outlet, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useWorkspace } from "@/context/workspace/useWorkspace";

export default function DashboardLayout() {
  const { slug } = useParams();
  const { workspaces, loading } = useWorkspace();

  if (loading) return null;

  const currentWorkspace = workspaces.find((ws) => ws.slug === slug);

  if (!currentWorkspace) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f3f3f4] p-2 gap-2">
      <Sidebar />
      <main className="basis-4/5 bg-white rounded-lg">
        <Outlet />
      </main>
    </div>
  );
}
