import AddItem from "@/components/AddItem";
import { useAuth } from "../context/auth/useAuth";
import { Navigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/context/workspace/useWorkspace";
import { useTeam } from "@/context/team/useTeam";

const VALID_FILTERS = ["all", "active", "archived"];

export default function ProjectsPage() {
  const { user } = useAuth();
  const { filter, key, slug } = useParams();
  const { workspaces } = useWorkspace();
  const currentWorkspace = workspaces.find((w) => w.slug === slug)!;
  const { teams } = useTeam();
  const currentTeam = key ? teams.find((t) => t.key === key) : null;

  if (!VALID_FILTERS.includes(filter!)) {
    return <Navigate to="all" replace />;
  }

  return (
    <>
      <AddItem text="Projects" />
      <>{filter}</>
      <h2>{user?.email}</h2>
      <h3>ws slug {currentWorkspace.slug}</h3>
      {currentTeam ? (
        <h3>{currentTeam.name} team projects</h3>
      ) : (
        <h3>Workspace projects</h3>
      )}
    </>
  );
}
