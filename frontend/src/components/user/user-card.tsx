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
import { MessageCircle, MoreHorizontal, UsersIcon } from "lucide-react";

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
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border border-border/60 rounded-lg">
      <CardContent className="p-5 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* <Avatar className="h-14 w-14 border border-border/40">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/5 text-primary font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar> */}

            {/* Status indicator */}
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${statusColors["online"]}`}
              aria-hidden="true"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base text-foreground">
                {user.displayName}
              </h3>
            </div>

            <div className="flex flex-col mt-1 gap-1">
              <span className="text-xs text-muted-foreground">
                {getStatusText("online")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-3 bg-muted/20 border-t border-border/30">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-primary/10 hover:bg-primary/20 text-primary border-0"
            onClick={() => {
              if (onDirectMessage) onDirectMessage(user.id);
            }}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            DM
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-background/80 hover:bg-background border-border/40"
            onClick={() => {
              if (onGroupChat) onGroupChat(user.id);
            }}
          >
            <UsersIcon className="h-3.5 w-3.5 mr-1.5" />
            Group
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem>Block User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
