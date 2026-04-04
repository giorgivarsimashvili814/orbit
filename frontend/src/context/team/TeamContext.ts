import type { QueryObserverResult } from "@tanstack/react-query";
import { createContext } from "react";

export interface Team {
  id: string;
  name: string;
  key: string;
}

export interface TeamContextType {
  teams: Team[];
  loading: boolean;
  refreshTeams: () => Promise<QueryObserverResult>;
}

export const TeamContext = createContext<TeamContextType>(null!);
