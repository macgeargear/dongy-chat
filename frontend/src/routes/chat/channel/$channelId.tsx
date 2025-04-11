import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2Icon, Send } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useAuth } from "@/hooks/use-auth";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useTyping } from "@/hooks/message/use-typing";
import { type Message } from "@/types/index";

import { getChannel } from "@/hooks/channel/use-channel";
import { useUpdateChannel } from "@/hooks/channel/use-update-channel";
import { cn, getChannelTitle, styleOptions } from "@/lib/utils";
import api from "@/lib/axios";

import { v4 as uuidv4 } from "uuid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/chat/channel/$channelId")({
  loader: async ({ params }) => {
    const channel = await getChannel({ id: params.channelId });
    return { channel };
  },
  component: ChannelRoomPage,
});

function ChannelRoomPage() {
  const { channel } = Route.useLoaderData();
  const { channelId } = Route.useParams();
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const pendingMessages = useRef(new Set<string>());

  const [activeUser, setActiveUser] = useState<any[]>([]);

  const navigate = useNavigate();

  const initialMessages = channel.messages;

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
      initialMessages.forEach((m) => pendingMessages.current.add(m.id));
    }
  }, [initialMessages]);

  const onMessage = useCallback((msg: Message) => {
    if (!msg.id) return;
    if (pendingMessages.current.has(msg.id)) return;
    console.log("message: ", msg);
    pendingMessages.current.add(msg.id);
    setMessages((prev) => [...prev, msg]);
  }, []);

  const onActiveUser = useCallback((user: any) => {
    // if (new Set(user) != new Set(activeUser)) setActiveUser(user);
    setActiveUser(user);
  }, []);

  const { sendMessage } = useChatSocket(
    channelId,
    user!,
    onMessage,
    onActiveUser,
  );

  const { typing, stopTyping } = useTyping(
    channelId,
    (username) => setTypingUsers((u) => [...new Set([...u, username])]),
    (username) => setTypingUsers((u) => u.filter((x) => x !== username)),
  );

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      channel,
      channelId,
      sender: user!,
      updatedAt: new Date(),
      createdAt: new Date(),
      content: input,
      senderId: user!.id,
      id: uuidv4(),
    };

    setMessages((prev) => {
      pendingMessages.current.add(newMessage.id);
      return [...prev, newMessage];
    });

    sendMessage(newMessage);
    setInput("");
    stopTyping();
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateString: string | Date) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    if (channel) {
      setTheme(channel.theme); //initial chat theme
    }
  }, [channel]);

  const updateChannel = useUpdateChannel();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (channel) {
      updateChannel.mutate({ ...channel, theme: newTheme });
    }
  };

  return (
    <div className="flex flex-col w-full h-[85vh]">
      <Card
        className={`flex flex-col h-full shadow-md border-slate-200 theme-${theme}`}
      >
        <CardHeader className="p-4 border-b flex flex-row flex-wrap items-center justify-between gap-4">
          <div className="flex flex-row gap-3 justify-center">
            <Link
              className={cn(buttonVariants({ variant: "ghost" }))}
              to="/chat/channel"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex flex-col flex-grow justify-start gap-1">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-primary">💬</span>
                {channel && user ? (
                  getChannelTitle(channel, user)
                ) : (
                  <Loader2Icon className="size-4" />
                )}
              </h1>{" "}
              <Badge variant="outline">{messages.length} messages</Badge>
            </div>

            {activeUser.length > 0 && (
              <div className="text-sm text-muted-foreground ml-4">
                <div className="flex items-center gap-1">
                  {activeUser.map((user, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={user.user.imageUrl} />
                            <AvatarFallback
                              className={getAvatarColor(user.user.displayName)}
                            >
                              {user.user.displayName[0]}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{user.user.displayName}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-3 items-center">
            <span className="text-xl">🎨</span>
            <Select onValueChange={handleThemeChange}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder={channel.theme} />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full ">
            <div className="p-4 space-y-4">
              {messages.map((msg, i) => {
                const isCurrentUser = msg.senderId === user?.id;
                const isAdmin = msg.sender?.username === "Admin";

                const showTimestamp =
                  i === 0 ||
                  new Date(msg.createdAt).toDateString() !==
                    new Date(messages[i - 1].createdAt).toDateString();

                return (
                  <div key={msg.id}>
                    {showTimestamp && (
                      <div className="flex justify-center my-4">
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground"
                        >
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex gap-3 max-w-[80%]",
                        isCurrentUser ? "ml-auto flex-row-reverse" : "",
                        isAdmin ? "mx-auto" : "",
                      )}
                    >
                      {!isCurrentUser && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={async () => {
                            const res = await api.post("/api/channel", {
                              userIds: [msg.sender.id, user?.id],
                            });

                            navigate({
                              to: `/chat/channel/$channelId`,
                              params: { channelId: res.data.id },
                            });
                          }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.sender.imageUrl} />
                            <AvatarFallback
                              className={getAvatarColor(msg.sender.username)}
                            >
                              {getInitials(msg.sender.username)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      )}
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          isCurrentUser
                            ? "bg-[var(--message-primary)] text-[var(--message-primary-foreground)]"
                            : isAdmin
                              ? "bg-muted text-muted-foreground text-center"
                              : "bg-[var(--message-secondary)] text-[var(--message-secondary-foreground)]",
                        )}
                      >
                        {!isCurrentUser && !isAdmin && (
                          <p className="font-semibold text-xs mb-1">
                            {msg.sender.username}
                          </p>
                        )}
                        <div className="break-words max-w-xs">
                          {msg.content}
                        </div>
                        <div className="text-xs mt-1 text-right text-muted-foreground">
                          {formatTime(new Date(msg.createdAt))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {typingUsers.length > 0 && (
                <p className="text-xs text-muted-foreground italic mt-1">
                  {typingUsers.join(", ")}{" "}
                  {typingUsers.length > 1 ? "are" : "is"} typing...
                </p>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t">
          <div className="flex gap-2 items-center w-full">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                typing();
              }}
              onBlur={stopTyping}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
