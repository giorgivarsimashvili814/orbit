import { createContext } from "react";

export interface Team {
  id: string;
  name: string;
  key: string;
}

export interface TeamContextType {
  teams: Team[];
  loading: boolean;
  refreshTeams: () => Promise<void>;
}

export const TeamContext = createContext<TeamContextType>(null!);
