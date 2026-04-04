import { createContext } from "react";
import type { QueryObserverResult } from "@tanstack/react-query";

export interface Workspace {
  name: string;
  slug: string;
  teams: { key: string }[];
}

export interface WorkspaceContextType {
  workspaces: Workspace[];
  loading: boolean;
  refreshWorkspaces: () => Promise<QueryObserverResult>;
}

export const WorkspaceContext = createContext<WorkspaceContextType>(null!);
