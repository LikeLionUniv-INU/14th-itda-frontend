export const getRelativeTime = (dateString) => {
  if (!dateString) return "방금 전";

  let str = String(dateString).trim();
  str = str.replace(" ", "T");

  if (!str.endsWith("Z") && !str.includes("+") && !str.includes("-", 10)) {
    str += "Z";
  }

  const past = new Date(str);
  if (isNaN(past.getTime())) return "방금 전";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "방금 전";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}일 전`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}달 전`;

  return `${Math.floor(diffInDays / 365)}년 전`;
};
