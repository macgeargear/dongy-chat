import type { Channel, User } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useNavigate } from "@tanstack/react-router";

interface UserCardProps {
  channel?: Channel;
  user: User;
}

export function UserCard({ user, channel }: UserCardProps) {
  const navigate = useNavigate();

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
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {user.displayName}
            </h3>
          </div>
          {channel && (
            <TooltipProvider>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        channel &&
                          navigate({
                            to: "/chat/channel/$channelId",
                            params: {
                              channelId: channel.id,
                            },
                          });
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      DM
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send a direct message</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
