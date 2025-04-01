import type { Channel, User } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusText(status: string) {
  if (status === "online") return "Online";
  if (status === "away") return "Away";
  if (status === "busy") return "Do not disturb";
  return "Offline";
}

export const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  away: "bg-amber-500",
  busy: "bg-rose-500",
};

export const styleOptions = [
  { label: "Default", value: "default" },
  { label: "Blueberry Milk", value: "blueberry-milk" },
  { label: "Peach Fuzz", value: "peach-fuzz" },
  { label: "Matcha Latte", value: "matcha-latte" },
  { label: "Honey Glaze", value: "honey-glaze" },
  { label: "Macaron Dream", value: "macaron-dream" },
];

export const getChannelTitle = (channel: Channel, user: User) => {
  if (channel.channelMembers?.length == 2 && channel.isPrivate) {
    return channel.channelMembers
      .filter((member) => member.userId != user?.id)
      .map((member) => member?.user.displayName)
      .toString();
  }
  return channel.name;
};
