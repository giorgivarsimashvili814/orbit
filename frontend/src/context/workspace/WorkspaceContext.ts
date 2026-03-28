import { createContext } from "react";

export interface Workspace {
  name: string;
  slug: string;
}

export interface WorkspaceContextType {
  workspaces: Workspace[];
  loading: boolean;
  refreshWorkspaces: () => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextType>(null!);
