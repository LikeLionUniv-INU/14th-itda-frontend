import api from "./axios";

// 내 정보 조회 API (GET /api/users/me)
export const getMyInfoApi = () => {
  return api.get("/api/users/me");
};