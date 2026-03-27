import { useOutletContext } from "react-router-dom";
import AddItem from "@/components/AddItem";
import { useAuth } from "../context/useAuth";

type ContextType = { name: string; slug: string };

export default function IssuesPage() {
  const workspace = useOutletContext<ContextType>();
  const { user } = useAuth();

  return (
    <>
      <AddItem text="Issues" />
      <h2>{user?.email}</h2>
      <h3>{workspace.slug}</h3>
    </>
  );
}
