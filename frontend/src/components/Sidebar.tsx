import {
  Box,
  Check,
  ChevronDown,
  Layers,
  LogOut,
  RefreshCw,
  Users,
} from "lucide-react";
import NavItem from "./NavItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/context/auth/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/context/workspace/useWorkspace";
// import { useTeam } from "@/context/team/useTeam";

export default function Sidebar() {
  const { slug } = useParams();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { workspaces } = useWorkspace();
  const currentWorkspace = workspaces.find((w) => w.slug === slug)!;
  // const { teams } = useTeam();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="basis-1/5 px-2 flex flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex gap-1 items-center">
            <span className="font-bold text-sm">{currentWorkspace.name}</span>
            <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56 mt-1">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <RefreshCw size={14} />
              <span>Switch Workspace</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-48 ml-1">
                <span className="text-xs text-gray-600 font-medium px-1.5 py-1 truncate">
                  {user?.email}
                </span>

                {workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws.slug}
                    className="flex items-center justify-between"
                    onClick={() => navigate(`/${ws.slug}/issues`)}
                  >
                    <span className="truncate">{ws.name}</span>
                    {ws.slug === slug && (
                      <Check size={14} className="text-black-500" />
                    )}
                  </DropdownMenuItem>
                ))}

                <span className="text-xs text-gray-600 font-medium px-1.5 py-1 truncate">
                  Account
                </span>

                <DropdownMenuItem
                  className="flex items-center justify-between"
                  onClick={() => navigate(`/create-new`)}
                >
                  <span className="truncate">Create new workspace...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut size={14} />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="mt-2 flex flex-col gap-0.5">
        <NavItem to={`/${currentWorkspace.slug}/issues`}>
          <Layers size={12} />
          Issues
        </NavItem>
        <NavItem to={`/${currentWorkspace.slug}/projects/all`} end>
          <Box size={12} />
          Projects
        </NavItem>
        <NavItem to={`/${currentWorkspace.slug}/members`}>
          <Users size={12} />
          Members
        </NavItem>
      </div>
      {/* {teams.map((t) => (
        <div key={t.id}>{t.name}</div>
      ))} */}
    </div>
  );
}
