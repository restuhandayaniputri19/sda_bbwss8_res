import { API2 } from ".";

export const getAdminLogs = async (page = 1, limit = 10, userId = "") => {
  const response = await API2.get(
    `/admin-logs?page=${page}&limit=${limit}`
  );
  if (userId) {
    response.data.data = response.data.data.filter(
      (log) => log.userId === userId
    );
  }
  return response.data;
};

export const getUsersOption = async () => {
  const response = await API2.get(`/users?limit=100`);
  return response.data;
};