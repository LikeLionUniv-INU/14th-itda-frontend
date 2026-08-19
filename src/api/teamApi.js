import api from "./axios"; // axios 인스턴스가 있는 파일 경로 (상황에 맞게 수정)

// 팀 상세 정보 조회
export const getTeamDetail = (teamId) => {
  return api.get(`/api/teams/${teamId}`);
};

// 팀 문서 생성 (팀장 전용)
export const createTeamDocument = (teamId, docData) => {
  return api.post(`/api/teams/${teamId}/documents`, docData);
};

// 팀 알림 목록 조회
export const getTeamNotifications = (teamId) => {
  return api.get(`/api/teams/${teamId}/notifications`);
};

// 팀 알림 읽음 처리
export const markNotificationAsRead = (teamId, notificationId) => {
  return api.post(`/api/teams/${teamId}/notifications/${notificationId}/read`);
};
