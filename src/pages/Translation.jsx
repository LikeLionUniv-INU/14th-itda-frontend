import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Check,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import * as S from "./Translation.styles";
import { getTranslationStatus } from "../api/documentApi";

const LANG_META = {
  ko: { name: "한국어", flag: "https://flagcdn.com/w160/kr.png" },
  en: { name: "영어", flag: "https://flagcdn.com/w160/us.png" },
  ja: { name: "일본어", flag: "https://flagcdn.com/w160/jp.png" },
  zh: { name: "중국어", flag: "https://flagcdn.com/w160/cn.png" },
  es: { name: "스페인어", flag: "https://flagcdn.com/w160/es.png" },
  fr: { name: "프랑스어", flag: "https://flagcdn.com/w160/fr.png" },
  de: { name: "독일어", flag: "https://flagcdn.com/w160/de.png" },
  vi: { name: "베트남어", flag: "https://flagcdn.com/w160/vn.png" },
  id: { name: "인도네시아어", flag: "https://flagcdn.com/w160/id.png" },
};

const normalizeStatus = (statusStr) => {
  if (!statusStr) return "WAITING";
  const s = String(statusStr).toUpperCase().trim();
  if (["COMPLETED", "COMPLETE", "DONE", "FINISHED", "SUCCESS"].includes(s))
    return "COMPLETED";
  if (["IN_PROGRESS", "PROGRESS", "PROCESSING", "TRANSLATING"].includes(s))
    return "IN_PROGRESS";
  if (["FAILED", "FAIL", "ERROR"].includes(s)) return "FAILED";
  return "WAITING";
};

const normalizeCode = (codeStr) => {
  if (!codeStr) return "ko";
  const c = String(codeStr).toLowerCase().trim();
  if (c.startsWith("en") || c.startsWith("us") || c.startsWith("gb"))
    return "en";
  if (c.startsWith("ko") || c.startsWith("kr")) return "ko";
  if (c.startsWith("ja") || c.startsWith("jp")) return "ja";
  if (c.startsWith("zh") || c.startsWith("cn")) return "zh";
  if (c.startsWith("es")) return "es";
  if (c.startsWith("fr")) return "fr";
  if (c.startsWith("de")) return "de";
  if (c.startsWith("vi") || c.startsWith("vn")) return "vi";
  if (c.startsWith("id")) return "id";
  return c.slice(0, 2);
};

export default function Translation() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const passedState = location.state || {};
  const teamId =
    passedState.teamId ||
    params.teamId ||
    params.projectId ||
    passedState.projectId ||
    localStorage.getItem("currentTeamId") ||
    "";

  const jobId = passedState.jobId || params.jobId;

  const [languages, setLanguages] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const pollingRef = useRef(null);
  const hasNavigatedRef = useRef(false);

  const getStatusDesc = (langCode, status) => {
    if (langCode === "ko" && status === "COMPLETED") {
      return "기본 언어로 번역 없이 원본이 유지 됩니다.";
    }
    if (status === "COMPLETED") {
      return "번역이 완료되었습니다.";
    }
    if (status === "IN_PROGRESS") {
      return "자연스러운 표현으로 번역하고 있습니다.";
    }
    if (status === "FAILED") {
      return "번역 중 오류가 발생했습니다.";
    }
    return "현재 언어 번역이 완료되면 자동으로 진행합니다.";
  };

  const fetchStatus = async () => {
    if (!jobId) {
      console.warn("진행할 jobId가 전달되지 않았습니다.");
      return;
    }

    try {
      const response = await getTranslationStatus(jobId);
      const resData = response?.data?.data || response?.data || response;

      if (!resData) return;

      if (resData.status === "FAILED" || resData.status === "FAIL") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setErrorMessage(
          "AI 번역 서버 오류로 번역이 중단되었습니다. 문서는 정상 저장되었습니다.",
        );

        setTimeout(() => {
          alert("AI 번역 처리에 실패했습니다. (문서는 정상 저장되었습니다)");
          navigate(teamId ? `/teamp-leader/${teamId}` : "/home");
        }, 2000);
        return;
      }

      const rawList =
        resData?.languages ||
        resData?.translationStatuses ||
        resData?.translations ||
        (Array.isArray(resData) ? resData : []);

      if (Array.isArray(rawList) && rawList.length > 0) {
        const formatted = rawList.map((item, idx) => {
          const rawCode =
            item.targetLanguage ||
            item.code ||
            item.languageCode ||
            item.language ||
            "ko";
          const normCode = normalizeCode(rawCode);
          const meta = LANG_META[normCode] || {
            name: item.name || item.languageName || normCode.toUpperCase(),
            flag: `https://flagcdn.com/w160/${normCode}.png`,
          };

          const rawStatus = item.status || "PENDING";

          return {
            id: item.id || idx + 1,
            code: normCode,
            name: meta.name || item.name || "언어",
            flagImg: meta.flag,
            status:
              normCode === "ko" ? "COMPLETED" : normalizeStatus(rawStatus),
          };
        });
        setLanguages(formatted);
      }

      // 3. 진행률 파싱
      let currentProgress = 0;
      if (typeof resData?.progress === "number") {
        currentProgress = resData.progress;
      } else if (typeof resData?.progressPercentage === "number") {
        currentProgress = resData.progressPercentage;
      } else if (Array.isArray(rawList) && rawList.length > 0) {
        const doneCount = rawList.filter(
          (l) => normalizeStatus(l.status) === "COMPLETED",
        ).length;
        currentProgress = Math.round((doneCount / rawList.length) * 100);
      }

      setProgressPercent(currentProgress);

      // 4. 완료 판별
      const isJobDone =
        resData?.status === "COMPLETED" ||
        currentProgress >= 100 ||
        (rawList.length > 0 &&
          rawList.every((l) => normalizeStatus(l.status) === "COMPLETED"));

      if (isJobDone && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        if (pollingRef.current) clearInterval(pollingRef.current);
        setProgressPercent(100);
        setShowToast(true);

        setTimeout(() => {
          navigate(teamId ? `/teamp-leader/${teamId}` : "/home");
        }, 1500);
      }
    } catch (error) {
      console.error("실시간 번역 상태 조회 오류:", error);
    }
  };

  useEffect(() => {
    fetchStatus();

    pollingRef.current = setInterval(() => {
      fetchStatus();
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [jobId]);

  const maxVisible = 3;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex + maxVisible < languages.length;

  const handlePrev = () => {
    if (canPrev) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canNext) setCurrentIndex((prev) => prev + 1);
  };

  const visibleLanguages = languages.slice(
    currentIndex,
    currentIndex + maxVisible,
  );

  return (
    <S.PageWrapper>
      <S.CenterContainer>
        <S.SparkleIconWrapper>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"
              fill="#5243E9"
            />
            <path
              d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z"
              fill="#5243E9"
            />
          </svg>
        </S.SparkleIconWrapper>

        <S.Title>AI 번역 진행중...</S.Title>
        <S.SubTitle>문서를 분석하고 각 언어로 번역을 진행합니다.</S.SubTitle>

        <S.ProgressSection>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percentage={progressPercent} />
          </S.ProgressBarTrack>
          <S.ProgressText>{progressPercent}%</S.ProgressText>
        </S.ProgressSection>

        {errorMessage && (
          <div
            style={{
              color: "#EF4444",
              fontWeight: "600",
              margin: "16px 0",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}

        <S.CardsWrapper>
          <S.TriangleButton
            onClick={handlePrev}
            disabled={!canPrev}
            $direction="left"
          >
            <svg width="18" height="22" viewBox="0 0 18 22" fill="currentColor">
              <path d="M16 2L3 11L16 20V2Z" />
            </svg>
          </S.TriangleButton>

          <S.CardGrid>
            {languages.length === 0 ? (
              <p style={{ color: "#888", padding: "40px 0" }}>
                번역 정보를 불러오는 중입니다...
              </p>
            ) : (
              visibleLanguages.map((lang) => (
                <S.LangCard key={lang.id}>
                  <S.FlagCircle>
                    {lang.flagImg ? (
                      <img src={lang.flagImg} alt={`${lang.name} 국기`} />
                    ) : (
                      <span>{lang.name?.charAt(0)}</span>
                    )}
                  </S.FlagCircle>

                  <S.LangName>{lang.name}</S.LangName>

                  <S.StatusBadge $status={lang.status}>
                    {lang.status === "COMPLETED" && (
                      <>
                        <Check size={14} strokeWidth={2.5} /> 완료
                      </>
                    )}
                    {lang.status === "IN_PROGRESS" && (
                      <>
                        <Sparkles size={14} className="spinner" /> 번역 중
                      </>
                    )}
                    {lang.status === "WAITING" && (
                      <>
                        <Clock size={14} /> 대기 중
                      </>
                    )}
                    {lang.status === "FAILED" && (
                      <>
                        <AlertCircle size={14} color="#EF4444" /> 실패
                      </>
                    )}
                  </S.StatusBadge>

                  <S.DescriptionText>
                    {getStatusDesc(lang.code, lang.status)}
                  </S.DescriptionText>
                </S.LangCard>
              ))
            )}
          </S.CardGrid>

          <S.TriangleButton
            onClick={handleNext}
            disabled={!canNext}
            $direction="right"
          >
            <svg width="18" height="22" viewBox="0 0 18 22" fill="currentColor">
              <path d="M2 2L15 11L2 20V2Z" />
            </svg>
          </S.TriangleButton>
        </S.CardsWrapper>

        {showToast && (
          <S.ToastMessage>
            <CheckCircle2 size={16} color="#1CA74B" />
            <span>전체 문서의 번역이 완료되었습니다.</span>
          </S.ToastMessage>
        )}
      </S.CenterContainer>
    </S.PageWrapper>
  );
}
