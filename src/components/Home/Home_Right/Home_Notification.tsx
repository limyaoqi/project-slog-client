import { Notification, ToggleAccordion } from "@/utils/interface";

export default function Home_Notification({
  openAccordion,
  toggleAccordion,
  notifications,
}: ToggleAccordion) {
  const hasUnreadNotifications = notifications?.some(
    (notification) => !notification.read
  );

  return (
    <div
      className={`border border-gray-300 rounded ${
        openAccordion === "notification" ? "flex-grow" : "flex-none"
      }`}
    >
      <div
        className="flex justify-between items-center px-4 py-2 rounded bg-black hover:bg-gray-900 focus:outline-none transition-colors duration-300 "
        onClick={toggleAccordion}
      >
        <button className="w-full  text-left text-lg font-semibold   ">
          Notification
        </button>
        {hasUnreadNotifications && (
          <span className=" h-3 w-3 rounded-full bg-red-500"></span>
        )}
      </div>

      {openAccordion === "notification" && (
        <div className="bg-black rounded text-white px-2 pb-2 space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification: Notification) => (
              <div
                key={notification._id}
                className="px-2 py-2 my-2 bg-hoverGray rounded cursor-pointer"
              >
                {notification.content}
              </div>
            ))
          ) : (
            <div className="p-4 bg-hoverGray rounded h-full overflow-y-auto">
              <p className="text-gray-300">You have no new notifications.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
