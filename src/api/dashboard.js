import api from "./axios";

export const getDashboardApi = () => {
  return api.get("/api/dashboard");
};

export const getDashboardProjectsApi = () => {
  return api.get("/api/dashboard/projects");
};

export const getDashboardDocumentsApi = () => {
  return api.get("/api/dashboard/documents");
};
