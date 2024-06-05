"use client";

import { useState } from "react";
import Home_FriendRequest from "./Home_Right/Home_FriendRequest";
import Home_Notification from "./Home_Right/Home_Notification";
import { getNotifications, readNotifications } from "@/utils/api_notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Notification } from "@/utils/interface";
import { getFriendRequest } from "@/utils/api_friendships";
import { useRouter } from "next/navigation";

interface Home_RightProps {
  setView: (view: string) => void;
  token: string;
}

export default function Home_Right({ setView, token }: Home_RightProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications", token],
    queryFn: () => getNotifications(token),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["requests", token],
    queryFn: () => getFriendRequest(token),
  });

  const readNotificationtMutation = useMutation({
    mutationFn: readNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      console.log(error.response.data.msg);
    },
  });

  const [openAccordion, setOpenAccordion] = useState<
    "notification" | "request" | null
  >("notification");

  const toggleAccordion = (accordion: "notification" | "request") => {
    setOpenAccordion(openAccordion === accordion ? null : accordion);
    if (accordion === "notification") {
      readNotificationtMutation.mutate(token);
    }
  };

  // const friendRequestNotifications = notifications.filter(
  //   (notification: Notification) => notification.type === "friend_request"
  // );

  const otherNotifications = notifications.filter(
    (notification: Notification) => notification.type !== "friend_request"
  );

  return (
    <div className="bg-black rounded text-white px-4 py-8 space-y-4 h-full overflow-y-auto">
      <Home_Notification
        openAccordion={openAccordion}
        toggleAccordion={() => toggleAccordion("notification")}
        notifications={otherNotifications}
        token={token}
        setView={setView}
      />

      <Home_FriendRequest
        openAccordion={openAccordion}
        toggleAccordion={() => toggleAccordion("request")}
        requests={requests}
        token={token}
        setView={setView}
      />
    </div>
  );
}
