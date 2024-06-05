import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import { getChatroom } from "@/utils/api_chat";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import { User } from "@/utils/interface";

const socket = io("http://localhost:2000");

interface Home_ChatroomProps {
  token: string;
  selectedFriendId: string;
  user: User | null;
}

interface Message {
  user: string;
  content: string;
  avatar: string;
}

export default function Home_Chatroom({
  token,
  selectedFriendId,
  user,
}: Home_ChatroomProps) {
  const {
    data: chatroom = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chatroom", token, selectedFriendId],
    queryFn: () => getChatroom(token, selectedFriendId),
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (chatroom.length > 0) {
      setMessages(chatroom);
    }
  }, [chatroom]);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        user: user?.username || "",
        content: newMessage,
        avatar: user?.profileId.avatar || "",
      };
      socket.emit("sendMessage", message);
      setNewMessage("");
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading chatroom</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-300 rounded text-black">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-300 rounded ">
        <button className="px-4 py-2 bg-gray-200 rounded-md">Back</button>
        <h2 className="text-lg font-bold">
          {chatroom.user1._id === user?._id
            ? chatroom.user2.username
            : chatroom.user1.username}
        </h2>
        <div className="w-10"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.user === user?.username;
          return (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                isCurrentUser ? "justify-end" : ""
              }`}
            >
              {!isCurrentUser && (
                <div className="w-10 h-10 mr-3">
                  <Image
                    src={`http://localhost:2000/${message.avatar}`}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full h-full"
                  />
                </div>
              )}
              <div
                className={`p-3 rounded-lg shadow-md ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {!isCurrentUser && <p className="font-bold">{message.user}</p>}
                <p>{message.content}</p>
              </div>
              {isCurrentUser && (
                <div className="w-10 h-10 ml-3">
                  <Image
                    src={`http://localhost:2000/${message.avatar}`}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full h-full"
                  />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-300 rounded">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md text-black"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
