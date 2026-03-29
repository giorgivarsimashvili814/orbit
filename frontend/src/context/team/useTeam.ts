import { useContext } from "react";
import { TeamContext } from "./TeamContext";

export function useTeam() {
  return useContext(TeamContext);
}
