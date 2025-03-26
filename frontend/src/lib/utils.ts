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
