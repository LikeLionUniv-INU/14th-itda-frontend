import api from "./axios";

export const loginApi = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  const resData = response?.data?.data || response?.data || response;

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

export const signupApi = (signupData) => {
  return api.post("/api/auth/signup", signupData);
};
