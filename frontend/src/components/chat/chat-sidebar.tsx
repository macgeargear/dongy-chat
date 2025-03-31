"use client";

import type React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  ChevronUpIcon,
  GroupIcon,
  HomeIcon,
  InboxIcon,
  PlusIcon,
  SettingsIcon,
  User2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import type { Channel, User } from "@/types";
import { useCreateChannel } from "@/hooks/channel/use-create-channel";
import CreateChannelDialog, {
  type CreateChannelInput,
} from "../channels/create-channel-dialog";
import toast from "react-hot-toast";
import { SwipeSidebarProvider } from "./swipe-sidebar-provider";

const items = [
  { title: "Home", to: "/chat", icon: HomeIcon },
  { title: "All users", to: "/chat/users", icon: InboxIcon },
  { title: "All Channels", to: "/chat/channel", icon: GroupIcon },
  { title: "Settings", to: "/chat/settings", icon: SettingsIcon },
];

interface ChatSidebarProps {
  channels?: Channel[];
  user?: User;
  children?: React.ReactNode;
}

export function ChatSidebar({ channels, user, children }: ChatSidebarProps) {
  const createChannel = useCreateChannel();

  const handleCreateChannel = async (data: CreateChannelInput) => {
    toast.promise(createChannel.mutateAsync(data), {
      loading: "Creating channel...",
      success: "Channel created successfully!",
      error: "Failed to create channel",
    });
  };

  return (
    <SidebarProvider>
      <SwipeSidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar variant="floating" collapsible="offcanvas">
            <SidebarHeader />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Dongy Chit</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.to}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {/* Channels */}
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center justify-between">
                  <p>Channels</p>
                  <CreateChannelDialog
                    onSubmit={handleCreateChannel}
                    trigger={
                      <Button variant="ghost" className="rounded-all">
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    }
                  />
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {channels?.map((channel) => (
                      <SidebarMenuSubItem key={channel.name}>
                        <SidebarMenuButton asChild>
                          <Link to={`/chat`}>
                            <GroupIcon className="h-4 w-4" />
                            <span>{channel.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {/* Inbox */}
              <SidebarGroup>
                <SidebarGroupLabel>Inbox</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>{/* Add Inbox items */}</SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton>
                        <User2Icon /> Username
                        <ChevronUpIcon className="ml-auto" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      className="w-[--radix-popper-anchor-width]"
                    >
                      <DropdownMenuItem>Account</DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button
                          className="w-full h-fit hover:bg-red-500 hover:text-white"
                          variant="ghost"
                        >
                          Sign out
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1">
            <div className="flex h-full flex-col">
              <header className="flex h-16 items-center border-b px-4">
                <SidebarTrigger className="mr-2" />
                <h1 className="text-lg font-semibold">
                  👋🏻 Hello, {user?.displayName}!
                </h1>
              </header>
              <main className="flex-1 overflow-auto p-4">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </SwipeSidebarProvider>
    </SidebarProvider>
  );
}
