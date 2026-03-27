import { NavLink } from "react-router-dom";
import React from "react";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  end?: boolean;
}

export default function NavItem({ to, children, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex gap-2 items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#e5e5e6] text-black"
            : "text-gray-700 hover:bg-[#e8e8e9] hover:text-black"
        } cursor-default`
      }
    >
      {children}
    </NavLink>
  );
}
