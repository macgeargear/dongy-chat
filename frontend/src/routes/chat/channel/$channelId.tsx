import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, PinIcon, Send } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { ActiveUserInRoomList } from "@/components/active-user-in-room-lists";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useAdminBroadcast } from "@/hooks/use-admin-broadcast";
import { useAuth } from "@/hooks/use-auth";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useTyping } from "@/hooks/message/use-typing";
import { useMessages, type Message } from "@/hooks/message/use-messages";
import { useChannel } from "@/hooks/channel/use-channel";
import { useUpdateChannel } from "@/hooks/channel/use-update-channel"
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

const styleOptions = [
  { label: "Default", value: "default" },
  { label: "Blueberry Milk", value: "blueberry-milk" },
  { label: "Peach Fuzz", value: "peach-fuzz" },
  { label: "Matcha Latte", value: "matcha-latte" },
  { label: "Honey Glaze", value: "honey-glaze" },
  { label: "Macaron Dream", value: "macaron-dream" },
];

export const Route = createFileRoute("/chat/$channelId")({
  component: ChannelRoomPage,
});

function ChannelRoomPage() {
  const { channelId } = Route.useParams();
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const pendingMessages = useRef(new Set<string>());

  const navigate = useNavigate();

  const { data: initialMessages } = useMessages(channelId);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
      initialMessages.forEach((m) => pendingMessages.current.add(m.id));
    }
  }, [initialMessages]);

  const onMessage = useCallback((msg: Message) => {
    if (msg.id && pendingMessages.current.has(msg.id)) return;
    pendingMessages.current.add(msg.id);
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { sendMessage } = useChatSocket(channelId, onMessage);

  const { typing, stopTyping } = useTyping(
    channelId,
    (username) => setTypingUsers((u) => [...new Set([...u, username])]),
    (username) => setTypingUsers((u) => u.filter((x) => x !== username)),
  );

  const { announce } = useAdminBroadcast();

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
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

  const formatTime = (dateString: string) =>
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

  const getChannelTitle = (msg: Message) => {
    if (!msg.channel) return `Room: ${channelId}`;

    if (!msg.channel.isPrivate && msg.channel.name)
      return msg.channel.name;

    const other = msg.channel.channelMembers.find(
      (m) => m.user.username !== user?.username,
    );

    return other?.user.username ?? "Direct Message";
  };

  const [theme, setTheme] = useState<string>("");
  const { data: channel } = useChannel(channelId);
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
    <div className="flex flex-col w-full p-4 mx-auto h-[85vh]">
      <Card className={`flex flex-col h-full shadow-md border-slate-200 theme-${theme}`}>
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row gap-3 justify-center">
            <Link className={cn(buttonVariants({ variant: "ghost" }))} to="/chat">
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex flex-col flex-grow">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-primary">💬</span>
                {messages[0]
                  ? getChannelTitle(messages[0])
                  : `Room: ${channelId}`}
                <Badge variant="outline" className="ml-2">
                  {messages.length} messages
                </Badge>
              </h1>{" "}
            </div>
          </div>
          <div className="flex flex-row gap-3 items-center">
            <span className="text-xl">🎨</span>
            <Select onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Theme" />
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
                const isCurrentUser = msg.sender.username === user?.username;
                const isAdmin = msg.sender.username === "Admin";

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
                      {!isCurrentUser && !isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={async () => {
                            const res = await api.post("/api/channel", {
                              userIds: [msg.sender.id, user?.id], // Make sure `sender.id` is available
                            });

                            navigate({
                              to: `/chat/$channelId`,
                              params: { channelId: res.data.id },
                            });
                          }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={getAvatarColor(msg.sender.username)}
                            >
                              {getInitials(msg.sender.username)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      )}{" "}
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          isCurrentUser
                            ?  "bg-[var(--message-primary)] text-[var(--message-primary-foreground)]"
                            : isAdmin
                              ? "bg-muted text-muted-foreground text-center"
                              :  "bg-[var(--message-secondary)] text-[var(--message-secondary-foreground)]",
                        )}
                      >
                        {!isCurrentUser && !isAdmin && (
                          <p className="font-semibold text-xs mb-1">
                            {msg.sender.username}
                          </p>
                        )}
                        <div className="break-words">{msg.content}</div>
                        <div className="text-xs mt-1 text-right text-muted-foreground">
                          {formatTime(msg.createdAt)}
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
