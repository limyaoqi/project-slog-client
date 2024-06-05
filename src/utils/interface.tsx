// User Interface
export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isOnline: boolean;
  friendsCount: number;
  lastActive: Date;
  firstLogin: boolean;
  profileId: Profile;
}

export interface Profile {
  _id: string;
  user: User | null;
  bio: string;
  location: string;
  avatar: string;
  interests: Tags[];
}

// Interface for Post
export interface Post {
  _id: string;
  title: string;
  description?: string;
  user: User | null;
  comments?: Comment[];
  likes?: User[];
  tags?: Tags[];
  attachments?: string[];
  visibility?: "public" | "private";
  status?: "draft" | "published" | "archived";
  isDeleted?: boolean;
  createdAt: string;
}
export interface Comment {
  _id: string;
  content: string;
  post: Post;
  user: User | null;
  likes: User[];
  replies?: Reply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  _id: string;
  content: string;
  user: User | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Friendship {
  _id: string;
  user1: User;
  user2: User;
  status: "pending" | "accepted";
  createdAt: Date;
}

export interface Notification {
  _id: string;
  type:
    | "comment"
    | "like"
    | "reply"
    | "follow"
    | "friend_request"
    | "friend_request_accept";
  content: string;
  recipient: User;
  createdBy: User;
  postId?: Post;
  read: boolean;
  createdAt: Date;
}

export interface Tags {
  _id?: string;
  name: string;
}

export interface ToggleAccordion {
  openAccordion: "notification" | "request" | null;
  toggleAccordion: () => void;
  notifications?: Notification[];
  requests?: Friendship[];
  token: string;
  setView: (view: string) => void;
}

export interface PostData {
  _id?: string;
  token: string;
  title: string;
  description: string;
  visibility: string;
  status: string;
  tags: string[];
  attachments: File[];
}
