import api from "./axios";

export const createTeam = ({ name, defaultLanguage }) => {
  return api.post("/api/teams", { name, defaultLanguage });
};

export const joinTeam = ({ inviteCode }) => {
  return api.post("/api/teams/join", { inviteCode });
};

export const getTeamInviteCode = (teamId) => {
  return api.get(`/api/teams/${teamId}/invite-code`);
};

export const getTeamDetail = (teamId) => {
  return api.get(`/api/teams/${teamId}`);
};

export const getTeamNotifications = (teamId) => {
  return api.get(`/api/teams/${teamId}/notifications`);
};

export const markNotificationAsRead = (teamId, notificationId) => {
  return api.post(`/api/teams/${teamId}/notifications/${notificationId}/read`);
};

export const createTeamDocument = (teamId, docData) => {
  return api.post(`/api/teams/${teamId}/documents`, docData);
};
