import AddItem from "@/components/AddItem";
import { useAuth } from "../context/auth/useAuth";
import { useWorkspace } from "@/context/workspace/useWorkspace";
import { Navigate, useParams } from "react-router-dom";
import { useTeam } from "@/context/team/useTeam";

const VALID_FILTERS = ["all", "active", "archived", "assigned"];

export default function IssuesPage() {
  const { user } = useAuth();
  const { slug, key, filter } = useParams();
  const { workspaces } = useWorkspace();
  const currentWorkspace = workspaces.find((w) => w.slug === slug)!;
  const { teams } = useTeam();
  const currentTeam = key ? teams.find((t) => t.key === key) : null;

  if (!VALID_FILTERS.includes(filter!)) {
    return <Navigate to="/all" replace />;
  }

  return (
    <>
      <AddItem text="Issues" />
      <>{filter}</>
      <h2>{user?.email}</h2>
      <h3>{currentWorkspace.slug} ws</h3>
      {currentTeam ? (
        <h3>{currentTeam.name} team issues</h3>
      ) : (
        <h3>my issues</h3>
      )}
    </>
  );
}
