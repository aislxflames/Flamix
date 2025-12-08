"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { IconDashboard } from "@tabler/icons-react";
import { ProjectorIcon } from "lucide-react";

const navMainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: ProjectorIcon,
  },
];

export function AppSidebar(props) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <span className="font-semibold text-lg px-4 py-2">
          Flamix Dashboard
        </span>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMainItems} pathname={pathname} />{" "}
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
