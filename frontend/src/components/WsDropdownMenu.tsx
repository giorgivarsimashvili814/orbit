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
import { Button } from "./ui/button";
import { Check, ChevronDown, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/auth/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/context/workspace/useWorkspace";

export default function WsDropdownMenu() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { workspaces } = useWorkspace();
  const { slug } = useParams();
  const currentWorkspace = workspaces.find((w) => w.slug === slug)!;


  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex justify-start w-fit" size="sm" variant="ghost">
          {currentWorkspace.name}
          <ChevronDown size={14} />
        </Button>
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
                {user!.email}
              </span>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.slug}
                  className="flex items-center justify-between"
                  onClick={() =>
                    navigate(
                      `/${ws.slug}/team/${ws.teams[0].key}/issues/active`,
                    )
                  }
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

        <DropdownMenuItem onClick={() => handleLogout()}>
          <LogOut size={14} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
