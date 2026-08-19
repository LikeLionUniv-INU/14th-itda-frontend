import api from "./axios";

// 1. 회원가입
export const signupApi = async (userData) => {
  // userData: { firstName, lastName, email, password, country, language }
  const response = await api.post("/api/auth/signup", userData);
  return response.data;
};

// 2. 로그인
export const loginApi = async (credentials) => {
  // credentials: { email, password }
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
};

// 3-1. 내 정보 전체 조회
export const getMyInfo = async () => {
  const response = await api.get("/api/users/me");
  return response.data;
};

// 3-2. 대시보드 홈 탭 (인사말, 프로젝트, 최근 문서)
export const getDashboardHome = async () => {
  const response = await api.get("/api/dashboard");
  return response.data;
};

// 3-3. 대시보드 프로젝트 탭
export const getDashboardProjects = async () => {
  const response = await api.get("/api/dashboard/projects");
  return response.data;
};

// 3-4. 대시보드 문서 탭
export const getDashboardDocuments = async () => {
  const response = await api.get("/api/dashboard/documents");
  return response.data;
};

// 10-1. 프로필 정보 수정 (이름, 국가, 언어, bio)
export const updateProfile = async (profileData) => {
  const response = await api.put("/api/users/me", profileData);
  return response.data;
};

// 10-2. 프로필 이미지 변경 파이프라인 (Presigned URL -> S3 Upload -> DB 저장)
export const uploadProfileImagePipeline = async (file) => {
  // Step 1. Presigned URL 발급
  const presignedRes = await api.post("/api/users/me/profile-image/presigned-url", {
    fileName: file.name,
    contentType: file.type || "image/png",
  });
  const { presignedUrl, fileUrl } = presignedRes.data.data;

  // Step 2. S3 직접 업로드
  await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/png" },
    body: file,
  });

  // Step 3. 이미지 URL 저장
  const response = await api.put("/api/users/me/profile-image", {
    profileImageUrl: fileUrl,
  });
  return response.data;
};

// 10-2-1. 프로필 이미지 삭제
export const deleteProfileImage = async () => {
  const response = await api.delete("/api/users/me/profile-image");
  return response.data;
};

// 10-3. 비밀번호 변경
export const updatePassword = async ({ currentPassword, newPassword }) => {
  const response = await api.put("/api/users/me/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// 10-4. 이메일 변경
export const updateEmail = async ({ password, newEmail }) => {
  const response = await api.put("/api/users/me/email", {
    password,
    newEmail,
  });
  return response.data;
};

// 10-5. 회원 탈퇴
export const deleteAccount = async (password) => {
  const response = await api.delete("/api/users/me", {
    data: { password },
  });
  return response.data;
};