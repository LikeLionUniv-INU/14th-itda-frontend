import api from "./axios";

// 로그인 API 함수
export const loginApi = (email, password) => {
  return api.post("/api/auth/login", { email, password });
};
// 회원가입 API 함수 (새로 추가)
export const signupApi = (signupData) => {
  return api.post("/api/auth/signup", signupData);
};