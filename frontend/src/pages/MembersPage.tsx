import AddItem from "@/components/AddItem";
import { useAuth } from "../context/useAuth";

export default function MembersPage() {
  const { user } = useAuth();

  return (
    <>
      <AddItem text="Members" />
      <h2>{user?.email}</h2>
    </>
  );
}
