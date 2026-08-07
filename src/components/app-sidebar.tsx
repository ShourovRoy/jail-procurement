import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  TerminalIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const data = {
  user: {
    name: "User name",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // organization management
    {
      title: "Organization",
      url: "/organization",
      icon: <TerminalSquareIcon />,
      isActive: false,
      items: [
        {
          title: "Create Organization",
          url: "/organization/create-new-organization",
        },
        {
          title: "All Organization",
          url: "/organization/view-all-organizations",
        },
      ],
    },

    // jail management
    {
      title: "Jail Management",
      url: "/jail",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "Create New Jail",
          url: "/jail/create-new-jail",
        },
        {
          title: "View All Jails",
          url: "/jail/view-all-jails",
        },
      ],
    },

    // food management
    {
      title: "Food Management",
      url: "/food-management",
      icon: <BotIcon />,
      items: [
        {
          title: "Create New Unit",
          url: "/food-management/create-new-unit",
        },
        {
          title: "Available Units",
          url: "#",
        },
        {
          title: "Create New Food",
          url: "#",
        },
        {
          title: "Available Food Items",
          url: "#",
        },
      ],
    },
    // tender management
    {
      title: "Tender Management",
      url: "/tenders",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Create New Tender",
          url: "/tenders/create-new-tender",
        },
        {
          title: "All Tenders",
          url: "/tenders/view-tenders",
        },
      ],
    },
    // tender bid management
    {
      title: "Bid Management",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Add Bid",
          url: "#",
        },
        {
          title: "Available Bids",
          url: "#",
        },
      ],
    },
    // pay order and performance security management
    {
      title: "Payorder & Security",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "All Payorders",
          url: "#",
        },
        {
          title: "Performance Securities",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    Public Procurement
                  </span>
                  <span className="truncate text-xs">Private Software</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
