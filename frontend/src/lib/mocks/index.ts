import type { Channel, User } from "@/types";

export const mockChannels: Channel[] = [
  {
    id: "1",
    name: "General",
    theme: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isPrivate: false,
    messages: [],
    channelMembers: [],
  },
];

export const mockInbox: { username: string; id: string }[] = [
  { username: "", id: "1" },
  { username: "Jane Doe", id: "2" },
  { username: "Bob Smith", id: "3" },
];

export const mockUsers: User[] = [
  {
    id: "1",
    username: "macgeargear",
    password: "1234",
    displayName: "Gear",
    channelMembers: [],
    messages: [],
  },
  {
    id: "2",
    username: "foo",
    password: "1234",
    displayName: "Foo",
    channelMembers: [],
    messages: [],
  },
  {
    id: "3",
    username: "bar",
    password: "1234",
    displayName: "Bar",
    channelMembers: [],
    messages: [],
  },
  {
    id: "4",
    username: "baz",
    password: "1234",
    displayName: "Baz",
    channelMembers: [],
    messages: [],
  },
];
