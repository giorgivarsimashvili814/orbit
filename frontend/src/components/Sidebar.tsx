import { Box, Layers, Users } from "lucide-react";
import NavItem from "./NavItem";

interface SidebarProps {
  workspace: { name: string; slug: string };
}

export default function Sidebar({ workspace }: SidebarProps) {
  return (
    <div className="basis-1/5 p-2 flex flex-col gap-0.5">
      <div></div>
      <NavItem to={`/${workspace.slug}/issues`}>
        <Layers size={12} />
        Issues
      </NavItem>
      <NavItem to={`/${workspace.slug}/projects/all`} end>
        <Box size={12} />
        Projects
      </NavItem>
      <NavItem to={`/${workspace.slug}/members`}>
        <Users size={12} />
        Members
      </NavItem>
    </div>
  );
}
