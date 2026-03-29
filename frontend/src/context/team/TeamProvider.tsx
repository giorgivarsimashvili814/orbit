import { useEffect, useCallback, type ReactNode, useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../auth/useAuth";
import { TeamContext, type Team } from "./TeamContext";

export function TeamProvider({
  children,
  workspaceSlug,
}: {
  children: ReactNode;
  workspaceSlug: string;
}) {
  const { user, accessToken, loading: authLoading } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const isGlobalLoading = authLoading || loading;

  const refreshTeams = useCallback(async () => {
    if (authLoading || !user || !accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/${workspaceSlug}/teams`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTeams(res.data);
    } catch {
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [user, accessToken, authLoading, workspaceSlug]);

  useEffect(() => {
    refreshTeams();
  }, [refreshTeams]);

  return (
    <TeamContext.Provider
      value={{ teams, loading: isGlobalLoading, refreshTeams }}
    >
      {children}
    </TeamContext.Provider>
  );
}
