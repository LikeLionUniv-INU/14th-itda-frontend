import api from "./axios";

// 4. 팀 프로젝트 생성
export const createTeam = ({ name, defaultLanguage }) => {
  return api.post("/api/teams", { name, defaultLanguage });
};

// 5. 팀 참여 (초대코드 입력)
export const joinTeam = ({ inviteCode }) => {
  return api.post("/api/teams/join", { inviteCode });
};

// 5-1. 초대코드 조회
export const getTeamInviteCode = (teamId) => {
  return api.get(`/api/teams/${teamId}/invite-code`);
};

// 6. 팀 프로젝트 상세 조회
export const getTeamDetail = (teamId) => {
  return api.get(`/api/teams/${teamId}`);
};

// 6-1. 팀 알림 조회
export const getTeamNotifications = (teamId) => {
  return api.get(`/api/teams/${teamId}/notifications`);
};

// 6-2. 팀 알림 읽음 처리
export const markNotificationAsRead = (teamId, notificationId) => {
  return api.post(`/api/teams/${teamId}/notifications/${notificationId}/read`);
};

// 6-3. 팀 문서 생성 (팀장 전용)
export const createTeamDocument = (teamId, docData) => {
  return api.post(`/api/teams/${teamId}/documents`, docData);
};
