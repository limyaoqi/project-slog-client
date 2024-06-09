import React, { useState } from "react";
import {
  format,
  formatDistanceToNow,
  parseISO,
  isBefore,
  subDays,
} from "date-fns";
import { User } from "@/utils/interface";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockUser,
  getUsers,
  promoteToAdmin,
  unblockUser,
} from "@/utils/api_users";
import { FaBan } from "react-icons/fa";
import { useRouter } from "next/navigation";
import PasswordModal from "@/components/PasswordModal";
import { useSnackbar } from "notistack";

interface HomeUserManagementProps {
  token: string;
  currentUser: User;
  setView: (view: string) => void;
  setBackpage: (backpage: string) => void;
  setProfileId: (profileId: string) => void;
}

const Home_UserManagement: React.FC<HomeUserManagementProps> = ({
  currentUser,
  token,
  setView,
  setBackpage,
  setProfileId,
}) => {
  const search = "";
  const { data: users = [] } = useQuery({
    queryKey: ["users", token, search],
    queryFn: () => getUsers(token, search),
  });
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [actionType, setActionType] = useState<
    "block" | "unblock" | "roleChange" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<"admin" | "user" | undefined>(
    undefined
  );

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar(error.response.data.message || "Failed to block user", {
        variant: "error",
      });
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar(error.response.data.message || "Failed to unblock user", {
        variant: "error",
      });
    },
  });

  const promoteToAdminMutation = useMutation({
    mutationFn: promoteToAdmin,
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar(error.response.data.message || "Failed to promote user", {
        variant: "error",
      });
    },
  });

  const handleRoleChange = (
    userId: string,
    newRole: "admin" | "user" | undefined
  ) => {
    setSelectedUser(users.find((user: User) => user._id === userId) || null);
    setNewRole(newRole);
    setActionType("roleChange");
    setIsModalOpen(true);
  };

  const onBlockUser = (userId: string) => {
    setSelectedUser(users.find((user: User) => user._id === userId) || null);
    setActionType("block");
    setIsModalOpen(true);
  };

  const onUnblockUser = (userId: string) => {
    setSelectedUser(users.find((user: User) => user._id === userId) || null);
    setActionType("unblock");
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    if (actionType === "block" && selectedUser) {
      blockUserMutation.mutate({ token, userId: selectedUser._id, password });
    } else if (actionType === "unblock" && selectedUser) {
      unblockUserMutation.mutate({ token, userId: selectedUser._id, password });
    } else if (actionType === "roleChange" && selectedUser) {
      if (newRole === undefined) {
        enqueueSnackbar("Please select a role before promoting the user.", {
          variant: "error",
        });
        return;
      }
      promoteToAdminMutation.mutate({
        token,
        userId: selectedUser._id,
        password,
        role: newRole,
      });
    }
    setIsModalOpen(false);
    setPassword("");
  };

  const roleOrder: { [key: string]: number } = {
    superAdmin: 1,
    admin: 2,
    user: 3,
  };

  const sortedUsers = users.sort((a: any, b: any) => {
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <div className="flex justify-center w-full p-4">
      <table className="min-w-full bg-gray-800 border-2 border-b-indigo-200 rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-3 text-left">User Information</th>
            <th className="py-3 px-3 text-left">Role</th>
            <th className="py-3 px-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers &&
            sortedUsers.map((user: User) => {
              const lastActiveDate = parseISO(user.lastActive.toString());
              const moreThan7DaysAgo = isBefore(
                lastActiveDate,
                subDays(new Date(), 7)
              );
              const lastActiveStatus = user.isOnline
                ? "Online"
                : moreThan7DaysAgo
                ? `${format(lastActiveDate, "yyyy-MM-dd")}`
                : `${formatDistanceToNow(lastActiveDate)}`;

              const canChangeRole = currentUser.role === "superAdmin";
              const canBlockUser =
                currentUser.role === "superAdmin" ||
                currentUser.role === "admin";
              const canUnblockUser = currentUser.role === "superAdmin";

              return (
                <tr key={user._id} className="border-b border-gray-200">
                  <td className="py-3 px-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3">
                        <Image
                          className="rounded-full h-full w-full object-contain border-2 border-white"
                          src={`http://localhost:2000/${user.profileId?.avatar}`}
                          alt={`${user.username}'s avatar`}
                          width={999}
                          height={999}
                        />
                      </div>
                      <div>
                        <div>{user.username}</div>
                        <div
                          className="cursor-pointer hover:underline transition duration-200 ease-in-out"
                          onClick={() => {
                            setBackpage("Home_UserManagement");
                            setProfileId(user.profileId._id);
                            setView("Home_ProfileDetail");
                          }}
                        >
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-400">
                          Status: {lastActiveStatus}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {canChangeRole ? (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value as "admin" | "user"
                          )
                        }
                        className="p-1 bg-gray-700 text-white border border-gray-600 rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {user.role !== "superAdmin" && (
                      <>
                        {user.isBlocked ? (
                          <button
                            className={`${
                              canUnblockUser
                                ? "text-green-500 hover:text-green-700"
                                : "text-gray-500 opacity-50 cursor-not-allowed"
                            }`}
                            onClick={() => onUnblockUser(user._id)}
                            disabled={!canUnblockUser}
                          >
                            <FaBan className="w-6 h-6" />
                          </button>
                        ) : (
                          <button
                            className={`${
                              canBlockUser && user.role !== "admin"
                                ? "text-red-500 hover:text-red-700"
                                : "text-gray-500 opacity-50 cursor-not-allowed"
                            }`}
                            onClick={() => onBlockUser(user._id)}
                            disabled={user.role === "admin"}
                          >
                            <FaBan className="w-6 h-6" />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {isModalOpen && (
        <PasswordModal
          password={password}
          setPassword={setPassword}
          setOpenModal={setIsModalOpen}
          handleSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default Home_UserManagement;
