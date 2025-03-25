// chat-sidebar.tsx
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
} from "@/components/ui/sidebar";
import {
  ChevronUpIcon,
  GroupIcon,
  HomeIcon,
  InboxIcon,
  MessageCircleIcon,
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

const items = [
  { title: "Home", to: "/chat", icon: HomeIcon },
  { title: "All users", to: "/chat", icon: InboxIcon },
  { title: "All Channels", to: "/chat", icon: GroupIcon },
  { title: "Settings", to: "/chat/settings", icon: SettingsIcon },
];

const mockChannels: { name: string; theme: string }[] = [
  { name: "General", theme: "light" },
  { name: "Announcements", theme: "dark" },
  { name: "Random", theme: "light" },
];

const mockInbox: { username: string; id: string }[] = [
  { username: "John Doe", id: "1" },
  { username: "Jane Doe", id: "2" },
  { username: "Bob Smith", id: "3" },
];

export function ChatSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dongy Chat</SidebarGroupLabel>
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
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockChannels.map((channel) => (
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
            <SidebarMenu>
              {mockInbox.map((inbox) => (
                <SidebarMenuSubItem key={inbox.username}>
                  <SidebarMenuButton asChild>
                    <Link to={`/chat`}>
                      <MessageCircleIcon className="h-4 w-4" />
                      <span>{inbox.username}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenu>
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
  );
}
