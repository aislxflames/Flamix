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
import { IconDashboard, IconDeviceDesktop } from "@tabler/icons-react";
import { ServerIcon } from "lucide-react";
import { UserAvatar, UserButton, useUser } from "@clerk/nextjs";

const navMainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: IconDeviceDesktop,
  },
    {
    title: "Reverse Proxy",
    url: "/dashboard/proxy",
    icon: ServerIcon,
  },
];

export function AppSidebar(props: any) {
  const pathname = usePathname();
  const {user} = useUser();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <span className="font-semibold text-lg px-4 py-2">
          Flamix Dashboard
        </span>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMainItems} />{" "}
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: `${user?.username}`,
            email: `${user?.primaryEmailAddress?.emailAddress}`,
            avatar: `${user?.imageUrl}`,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
