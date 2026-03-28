import { useEffect, useCallback, type ReactNode, useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../auth/useAuth";
import { WorkspaceContext, type Workspace } from "./WorkspaceContext";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, accessToken, loading: authLoading } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  const isGlobalLoading = authLoading || loading;

  const refreshWorkspaces = useCallback(async () => {
    if (authLoading || !user || !accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/workspace", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setWorkspaces(res.data);
    } catch {
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }, [user, accessToken, authLoading]);

  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  useEffect(() => {
    if (!user) {
      setWorkspaces([]);
    }
  }, [user]);

  return (
    <WorkspaceContext.Provider
      value={{ workspaces, loading: isGlobalLoading, refreshWorkspaces }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
