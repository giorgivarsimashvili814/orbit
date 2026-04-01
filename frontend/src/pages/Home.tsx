import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/workspace/useWorkspace";

export default function Home() {
  const navigate = useNavigate();
  const { workspaces } = useWorkspace();

  const slug = workspaces[0].slug;
  const teamKey = workspaces[0].teams[0].key;

  useEffect(() => {
    if (workspaces.length === 0) {
      navigate("/create-new", { replace: true });
    } else {
      navigate(`/${slug}/team/${teamKey}/issues/active`, { replace: true });
    }
  }, [workspaces, navigate, slug, teamKey]);

  return null;
}
