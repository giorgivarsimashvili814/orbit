import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/useAuth";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState<{
    name: string;
    slug: string;
  }>();

  useEffect(() => {
    async function checkWorkspace() {
      try {
        const res = await api.get(`/workspace/${slug}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setWorkspace(res.data);
      } catch {
        navigate("/", { replace: true });
      }
    }
    checkWorkspace();
  }, [slug, accessToken, navigate]);

  if (!workspace) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-[#f3f3f4] p-2 gap-2">
      <Sidebar workspace={workspace} />
      <main className="basis-4/5 bg-white rounded-lg">
        <Outlet context={workspace} />
      </main>
    </div>
  );
}
