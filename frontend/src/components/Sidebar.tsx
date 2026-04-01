import { CollapsibleTree } from "./CollapsibleTree";
import WsDropdownMenu from "./WsDropdownMenu";

export default function Sidebar() {
  return (
    <div className="max-lg:hidden w-75 flex flex-col gap-2.5 overflow-y-auto">
      <WsDropdownMenu />
      <CollapsibleTree />
    </div>
  );
}
