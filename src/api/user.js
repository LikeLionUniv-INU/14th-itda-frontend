import api from "./axios";

// 1. 내 정보 조회 API (GET /api/users/me)
export const getMyInfoApi = () => {
  return api.get("/api/users/me");
};

// 2. 프로필 정보 수정 API
export const updateProfileApi = (profileData) => {
  return api.put("/api/users/me", profileData);
};

// 3. 프로필 이미지 업로드용 Presigned URL 요청 API
export const getPresignedUrlApi = (fileData) => {
  return api.post("/api/users/me/profile-image/presigned-url", fileData);
};

// 4. 프로필 이미지 저장/업데이트 API
export const updateProfileImageApi = (imageData) => {
  return api.put("/api/users/me/profile-image", imageData);
};

// 5. 비밀번호 변경 API
export const changePasswordApi = (passwordData) => {
  return api.put("/api/users/me/password", passwordData);
};

// 6. 이메일 변경 API
export const changeEmailApi = (emailData) => {
  return api.put("/api/users/me/email", emailData);
};

// 7. 회원 탈퇴 API
export const deleteAccountApi = (deleteData) => {
  return api.delete("/api/users/me", { data: deleteData });
};
