import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

const IssueForm = () => <div>Form for creating an Issue</div>;
const ProjectForm = () => <div>Form for creating a Project</div>;
const InviteForm = () => <div>Form for inviting a Member</div>;

const FORM_MAP: Record<string, React.ReactNode> = {
  Issues: <IssueForm />,
  Projects: <ProjectForm />,
  Members: <InviteForm />,
};

interface AddItemProps {
  text: "Issues" | "Projects" | "Members"; 
}

export default function AddItem({ text }: AddItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between py-2 px-4 text-sm border-b items-center">
      <p>{text}</p>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        className="rounded-full"
      >
        <Plus size={16} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {text}</DialogTitle>
          </DialogHeader>

          <div className="py-4">{FORM_MAP[text] || <p>Form not found</p>}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
