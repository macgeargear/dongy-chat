import type { User } from "@/types";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { getStatusText, statusColors } from "@/lib/utils";
import {
  MessageCircle,
  MoreHorizontal,
  UsersIcon,
  Eye,
  BellOff,
  Ban,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface UserCardProps {
  user: User;
  onDirectMessage?: (userId: string) => void;
  onGroupChat?: (userId: string) => void;
}

export function UserCard({
  user,
  onDirectMessage,
  onGroupChat,
}: UserCardProps) {
  const statusColor = statusColors["online"]; // You could make this dynamic

  return (
    <Card className="transition-shadow duration-200 border border-border/60 hover:shadow-md rounded-xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14 ring-2 ring-offset-2 ring-offset-background ring-primary/50">
              <AvatarImage src={user.imageUrl} alt={user.displayName} />
              <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                {user.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${statusColor}`}
              aria-hidden="true"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {user.displayName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getStatusText("online")}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-3 bg-muted/30 border-t border-border/30">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-primary flex items-center gap-1"
                  onClick={() => onDirectMessage?.(user.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  DM
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send a direct message</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-background hover:bg-muted"
                  onClick={() => onGroupChat?.(user.id)}
                >
                  <UsersIcon className="h-4 w-4" />
                  Group
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add to group chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2 text-muted-foreground" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellOff className="w-4 h-4 mr-2 text-muted-foreground" />
              Mute Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Ban className="w-4 h-4 mr-2 text-muted-foreground" />
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
