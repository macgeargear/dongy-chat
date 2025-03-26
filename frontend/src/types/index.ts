export interface Channel {
  id: string;
  name: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  messages: Message[];
  channelMembers: ChannelMember[];
}

export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  imageUrl: string;
  channelMembers: ChannelMember[];
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  channelId: string;
  channel: Channel;
  senderId: string;
  sender: User;
}

export interface ChannelMember {
  latestSeenMessageId: string;
  channelId: string;
  channel: Channel;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
