import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
import Image from "next/image";
import { getChatroom, sendMessage } from "@/utils/api_chat";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import { Chat, User } from "@/utils/interface";

// const socket = io("http://localhost:2000");

interface Home_ChatroomProps {
  token: string;
  selectedFriendId: string;
  user: User;
}

export default function Home_Chatroom({
  token,
  selectedFriendId,
  user,
}: Home_ChatroomProps) {
  // console.log(user)
  const queryClient = useQueryClient();
  const {
    data: chatroom = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chatroom", token, selectedFriendId],
    queryFn: () => getChatroom(token, selectedFriendId),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatroom"] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  // useEffect(() => {
  //   if (user) {
  //     socket.emit("join", { username: user.username, _id: user._id });
  //   }

  //   socket.on("message", (message: Chat) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   return () => {
  //     socket.off("message");
  //   };
  // }, [user]);

  useEffect(() => {
    // console.log("Chatroom:", chatroom);
    if (chatroom && chatroom.chats) {
      setMessages(chatroom.chats);
    }
  }, [chatroom]);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate({
        token,
        userId: selectedFriendId,
        content: newMessage,
      });

      // socket.emit("sendMessage", {
      //   senderId: user?._id,
      //   receiverId: selectedFriendId,
      //   content: newMessage,
      // });

      setNewMessage("");
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
    return <div>Error loading chatroom. Please try again later.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-300 rounded text-black">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-300 rounded">
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
          const isCurrentUser = message.sender._id === user?._id;

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
                    src={`http://localhost:2000/${message.sender.profileId.avatar}`}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full h-full"
                  />
                </div>
              )}
              <div
                className={`p-3 rounded-lg shadow-md max-w-xs md:max-w-md ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-white"
                }`}
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                {!isCurrentUser && (
                  <p className="font-bold">{message.sender.username}</p>
                )}
                <p>{message.content}</p>
              </div>
              {isCurrentUser && (
                <div className="w-10 h-10 ml-3">
                  <Image
                    src={`http://localhost:2000/${message.sender.profileId.avatar}`}
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
