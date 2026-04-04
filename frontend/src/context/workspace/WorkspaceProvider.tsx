import { type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { WorkspaceContext, type Workspace } from "./WorkspaceContext";
import { useAuth } from "../auth/useAuth";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const {
    data: workspaces = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await api.get("/workspace");
      return res.data as Workspace[];
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  return (
    <WorkspaceContext.Provider
      value={{ workspaces, loading: isLoading, refreshWorkspaces: refetch }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
