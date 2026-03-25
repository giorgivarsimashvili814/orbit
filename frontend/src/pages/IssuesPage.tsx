import { useAuth } from "../context/useAuth";

export default function IssuesPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Issues page</h1>
      <h2>{user?.email}</h2>
    </>
  );
}
