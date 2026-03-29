import AddItem from "@/components/AddItem";
import { useAuth } from "../context/auth/useAuth";
import { useWorkspace } from "@/context/workspace/useWorkspace";
import { useParams } from "react-router-dom";

export default function IssuesPage() {
  const { user } = useAuth();
  const { slug } = useParams();
  const { workspaces } = useWorkspace();
  const currentWorkspace = workspaces.find((w) => w.slug === slug)!

  return (
    <>
      <AddItem text="Issues" />
      <h2>{user?.email}</h2>
      <h3>{currentWorkspace.slug}</h3>
    </>
  );
}
