import { CollapsibleTree } from "./CollapsibleTree";
import WsDropdownMenu from "./WsDropdownMenu";


export default function Sidebar() {

  return (
    <div className="basis-1/5 flex flex-col gap-2.5 overflow-y-auto">
      <WsDropdownMenu />
      <CollapsibleTree />
    </div>
  );
}
