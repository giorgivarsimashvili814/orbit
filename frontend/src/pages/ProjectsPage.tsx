import AddItem from "@/components/AddItem";
import { useAuth } from "../context/auth/useAuth";

export default function ProjectsPage() {
  const { user } = useAuth();

  return (
    <>
      <AddItem text="Projects" />
      <h2>{user?.email}</h2>
    </>
  );
}
