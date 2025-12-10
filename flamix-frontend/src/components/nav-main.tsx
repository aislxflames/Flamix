"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateProjectDialog from "./dialog/CreateProjectDialog";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon | LucideIcon;
  }[];
}) {
  const pathname = usePathname(); // ⭐ get current url

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* QUICK CREATE BUTTON (unchanged) */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <CreateProjectDialog />
            </SidebarMenuButton>

            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* MAIN MENU */}
        <SidebarMenu>
          {items.map((item) => {
            let isActive = false;

            // ⭐ Dashboard active ONLY on exact "/dashboard"
            if (item.url === "/dashboard") {
              isActive = pathname === "/dashboard";
            }

            // ⭐ Projects active on ANY sub-route
            if (item.url === "/dashboard/projects") {
              isActive = pathname.startsWith("/dashboard/projects");
            }

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    data-active={isActive ? "true" : "false"} // ⭐ required for Shadcn
                    className={`
                      duration-200 ease-linear 
                      rounded-md px-2
                      data-[active=true]:bg-secondary
                      data-[active=true]:text-secondary-foreground
                      data-[active=true]:font-semibold
                    `}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
