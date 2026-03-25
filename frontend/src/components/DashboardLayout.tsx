import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/useAuth";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState<{
    name: string;
    slug: string;
  }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkWorkspace() {
      try {
        const res = await api.get(`/workspace/${slug}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setWorkspace(res.data);
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    }
    checkWorkspace();
  }, [slug, accessToken, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100 p-2 gap-2">
      <aside className="w-82.5 p-2">{workspace?.name}</aside>
      <main className="flex-1 bg-white rounded-md p-2">
        <Outlet />
      </main>
    </div>
  );
}
