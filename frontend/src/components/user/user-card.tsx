import type { User } from "@/types";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import clsx from "clsx";

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
  const statusColor = statusColors["online"];

  return (
    <Card className="transition-shadow duration-200 border border-border/60 hover:shadow-lg rounded-xl overflow-hidden bg-background/80 backdrop-blur">
      <CardContent className="p-5 pb-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border border-border shadow-sm">
              <AvatarImage src={user.imageUrl} alt={user.displayName} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-lg rounded-full">
                {user.displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={clsx(
                "absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-background",
                statusColor,
              )}
              aria-hidden="true"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {user.displayName}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {getStatusText("online")}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-accent/50"
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
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Ban className="w-4 h-4 mr-2 text-red-500" />
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <CardFooter className="flex items-center h-fit justify-between p-4 pt-2 bg-muted/20 border-t border-border/30">
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onDirectMessage?.(user.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
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
                  onClick={() => onGroupChat?.(user.id)}
                >
                  <UsersIcon className="h-4 w-4 mr-1" />
                  Group
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add to group chat</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
