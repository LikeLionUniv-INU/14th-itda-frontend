import api from "./axios";

// 4. 팀 프로젝트 생성
export const createTeam = async ({ name, defaultLanguage }) => {
  const response = await api.post("/api/teams", { name, defaultLanguage });
  return response.data;
};

// 5. 팀 참여 (초대코드 입력)
export const joinTeam = async ({ inviteCode }) => {
  const response = await api.post("/api/teams/join", { inviteCode });
  return response.data;
};

// 5-1. 초대코드 조회
export const getTeamInviteCode = async (teamId) => {
  const response = await api.get(`/api/teams/${teamId}/invite-code`);
  return response.data;
};

// 6. 팀 프로젝트 상세 조회
export const getTeamDetail = async (teamId) => {
  const response = await api.get(`/api/teams/${teamId}`);
  return response.data;
};

// 6-1. 팀 알림 조회
export const getTeamNotifications = async (teamId) => {
  const response = await api.get(`/api/teams/${teamId}/notifications`);
  return response.data;
};

// 6-2. 팀 알림 읽음 처리
export const readTeamNotification = async (teamId, notificationId) => {
  const response = await api.post(
    `/api/teams/${teamId}/notifications/${notificationId}/read`,
  );
  return response.data;
};
