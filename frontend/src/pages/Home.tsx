import { useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const res = await api.get("/workspace", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const workspaces = res.data;
        if (!workspaces.length) {
          navigate("/create-new");
        } else {
          navigate(`/${workspaces[0].slug}/issues`);
        }
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) fetchWorkspaces();
  }, [accessToken]);

  if (loading) return <p>Loading...</p>;
}
