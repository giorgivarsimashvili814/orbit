import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/workspace/useWorkspace";

export default function Home() {
  const navigate = useNavigate();
  const { workspaces } = useWorkspace();

  useEffect(() => {
    if (workspaces.length === 0) {
      navigate("/create-new", { replace: true });
    } else {
      navigate(`/${workspaces[0].slug}/issues`, { replace: true });
    }
  }, [workspaces, navigate]);

  return null
}
