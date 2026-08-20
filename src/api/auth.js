import api from "./axios";

// 로그인 API 함수 (토큰 및 유저 언어 자동 저장)
export const loginApi = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  const resData = response?.data?.data || response?.data || response;

  // 1. 토큰 추출 및 저장
  const accessToken =
    resData?.accessToken ||
    resData?.token ||
    resData?.data?.accessToken ||
    resData?.data?.token;

  const refreshToken = resData?.refreshToken || resData?.data?.refreshToken;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  // 2. 유저 언어 추출 및 자동 저장 (ko, en, ja 등)
  const rawUser = resData?.user || resData?.data?.user || resData;
  const userLang =
    rawUser?.language ||
    rawUser?.targetLanguage ||
    rawUser?.defaultLanguage ||
    rawUser?.lang ||
    "ko";

  localStorage.setItem("userLanguage", String(userLang).toLowerCase().trim());

  return response;
};

// 회원가입 API 함수
export const signupApi = (signupData) => {
  return api.post("/api/auth/signup", signupData);
};
