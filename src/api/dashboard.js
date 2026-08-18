import api from "./axios";

// 대시보드 홈 데이터 조회 (GET /api/dashboard)
export const getDashboardApi = () => {
  return api.get("/api/dashboard");
};

// 대시보드 프로젝트 목록 조회 (GET /api/dashboard/projects)
export const getDashboardProjectsApi = () => {
  return api.get("/api/dashboard/projects");
};

// 대시보드 문서 목록 조회 (GET /api/dashboard/documents)
export const getDashboardDocumentsApi = () => {
  return api.get("/api/dashboard/documents");
};