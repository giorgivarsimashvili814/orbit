import {
  Box,
  ChevronRightIcon,
  Layers,
  ScanText,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTeam } from "@/context/team/useTeam";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type FileTreeItem =
  | { name: string; href?: string; icon?: React.ElementType }
  | {
      name: string;
      href?: string;
      icon?: React.ElementType;
      items: FileTreeItem[];
    };

export function CollapsibleTree() {
  const { teams } = useTeam();
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fileTree: FileTreeItem[] = [
    { name: "My issues", href: `/${slug}/my-issues/assigned`, icon: ScanText },
    {
      name: "Workspace",
      items: [
        { name: "Projects", href: `/${slug}/projects/all`, icon: Box },
        { name: "Members", href: `/${slug}/members`, icon: Users },
      ],
    },
    {
      name: "Your teams",
      items: teams.map((team) => ({
        name: team.name,
        icon: Settings,
        items: [
          {
            name: "Issues",
            href: `/${slug}/team/${team.key}/issues/active`,
            icon: Layers,
          },
          {
            name: "Projects",
            href: `/${slug}/team/${team.key}/projects/all`,
            icon: Box,
          },
        ],
      })),
    },
  ];

  const renderItem = (fileItem: FileTreeItem) => {
    const isActive = "href" in fileItem && fileItem.href === location.pathname;

    if ("items" in fileItem) {
      const IconComponent = fileItem.icon;
      return (
        <Collapsible key={fileItem.name} defaultOpen>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="group w-full justify-start gap-2 data-[state=open]:bg-transparent hover:data-[state=open]:bg-[#e5e5e6]"
            >
              {IconComponent && <IconComponent size={16} />}
              {fileItem.name}
              <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col ml-2">
            {fileItem.items.map((child) => renderItem(child))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    const IconComponent = fileItem.icon;
    return (
      <Button
        key={fileItem.name}
        variant="ghost"
        size="sm"
        onClick={() => fileItem.href && navigate(fileItem.href)}
        className={`w-full justify-start gap-2 hover:bg-[#e5e5e6] ${
          isActive ? "bg-[#e5e5e6] text-black font-medium" : ""
        }`}
      >
        {IconComponent && <IconComponent size={16} />}
        <span>{fileItem.name}</span>
      </Button>
    );
  };

  return (
    <div className="flex flex-col text-gray-700 gap-1">
      {fileTree.map((item) => renderItem(item))}
    </div>
  );
}
