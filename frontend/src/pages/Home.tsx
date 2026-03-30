import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/workspace/useWorkspace";
import { useAuth } from "../context/auth/useAuth";
import api from "../lib/api";

export default function Home() {
  const navigate = useNavigate();
  const { workspaces } = useWorkspace();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (workspaces.length === 0) {
      navigate("/create-new", { replace: true });
      return;
    }

    const slug = workspaces[0].slug;

    api
      .get(`/${slug}/teams`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const teams = res.data;
        if (teams.length > 0) {
          navigate(`/${slug}/team/${teams[0].key}/issues/active`, {
            replace: true,
          });
        } else {
          navigate("/create-new", { replace: true });
        }
      })
      .catch(() => navigate("/create-new", { replace: true }));
  }, [workspaces, accessToken, navigate]);

  return null;
}
