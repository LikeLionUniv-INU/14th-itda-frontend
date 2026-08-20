import api from "./axios";

export const getMyInfoApi = () => {
  return api.get("/api/users/me");
};

export const updateProfileApi = (profileData) => {
  return api.put("/api/users/me", profileData);
};

export const getPresignedUrlApi = (fileData) => {
  return api.post("/api/users/me/profile-image/presigned-url", fileData);
};

export const updateProfileImageApi = (imageData) => {
  return api.put("/api/users/me/profile-image", imageData);
};

export const changePasswordApi = (passwordData) => {
  return api.put("/api/users/me/password", passwordData);
};

export const changeEmailApi = (emailData) => {
  return api.put("/api/users/me/email", emailData);
};

export const deleteAccountApi = (deleteData) => {
  return api.delete("/api/users/me", { data: deleteData });
};
