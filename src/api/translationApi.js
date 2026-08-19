import api from "./axios";

// 프로젝트 번역 진행 상태 조회 API
export const getTranslationStatus = (projectId) => {
  return api.get(`/api/projects/${projectId}/translations`);
};

// (필요 시) 번역 시작 요청 API
export const startTranslation = (projectId, targetLanguages) => {
  return api.post(`/api/projects/${projectId}/translations/start`, {
    targetLanguages,
  });
};
