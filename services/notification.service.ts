import api from "./api";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data.data;
};

export const markNotificationRead = async (id: string) => {
  await api.post(`/notifications/${id}/mark-read`);
};

export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  return res.data.data;
};