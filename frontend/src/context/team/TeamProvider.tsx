import { type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const { user } = useAuth();

  const {
    data: teams = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["teams", workspaceSlug],
    queryFn: async () => {
      const res = await api.get(`/${workspaceSlug}/teams`);
      return res.data as Team[];
    },
    enabled: !!user && !!workspaceSlug,
    staleTime: 1000 * 60,
  });

  return (
    <TeamContext.Provider
      value={{ teams, loading: isLoading, refreshTeams: refetch }}
    >
      {children}
    </TeamContext.Provider>
  );
}
