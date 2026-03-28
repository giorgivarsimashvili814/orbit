import AddItem from "@/components/AddItem";
import { useAuth } from "../context/auth/useAuth";
import { useWorkspace } from "@/context/workspace/useWorkspace";
import { Navigate, useParams } from "react-router-dom";

export default function IssuesPage() {
  const { user } = useAuth();
  const { slug } = useParams();
  const { workspaces } = useWorkspace();
  const currentWorkspace = workspaces.find((w) => w.slug === slug);

  if (!currentWorkspace) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AddItem text="Issues" />
      <h2>{user?.email}</h2>
      <h3>{currentWorkspace.slug}</h3>
    </>
  );
}
