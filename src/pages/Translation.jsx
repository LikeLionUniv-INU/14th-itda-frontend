import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Check, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import * as S from "./Translation.styles";
import { getTranslationStatus } from "../api/translationApi";

// 전체 지원 국가/언어 국기 이미지 및 명칭 매핑
const LANG_META = {
  ko: { name: "한국어", flag: "https://flagcdn.com/w160/kr.png" },
  en: { name: "영어", flag: "https://flagcdn.com/w160/gb.png" },
  us: { name: "영어", flag: "https://flagcdn.com/w160/us.png" },
  ja: { name: "일본어", flag: "https://flagcdn.com/w160/jp.png" },
  jp: { name: "일본어", flag: "https://flagcdn.com/w160/jp.png" },
  zh: { name: "중국어", flag: "https://flagcdn.com/w160/cn.png" },
  cn: { name: "중국어", flag: "https://flagcdn.com/w160/cn.png" },
  es: { name: "스페인어", flag: "https://flagcdn.com/w160/es.png" },
  fr: { name: "프랑스어", flag: "https://flagcdn.com/w160/fr.png" },
  de: { name: "독일어", flag: "https://flagcdn.com/w160/de.png" },
  vi: { name: "베트남어", flag: "https://flagcdn.com/w160/vn.png" },
  vn: { name: "베트남어", flag: "https://flagcdn.com/w160/vn.png" },
  id: { name: "인도네시아어", flag: "https://flagcdn.com/w160/id.png" },
};

export default function Translation() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // URL 파라미터 또는 라우팅 state로부터 동적 ID 추출
  const projectId =
    params.projectId || params.teamId || location.state?.projectId || 1;

  // 초기 더미 데이터를 완전히 제거한 빈 배열 상태
  const [languages, setLanguages] = useState([]);
  const [serverProgress, setServerProgress] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const pollingRef = useRef(null);

  // 기획서 고정 안내 멘트
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
    return "현재 언어 번역이 완료되면 자동으로 진행합니다.";
  };

  const fetchStatus = async () => {
    try {
      const response = await getTranslationStatus(projectId);
      const resData = response?.data?.data || response?.data || response;

      // 백엔드에서 내려온 번역 목록 매핑
      if (resData?.languages && Array.isArray(resData.languages)) {
        const formatted = resData.languages.map((item, idx) => {
          const rawCode = (item.code || item.language || "ko").toLowerCase();
          const meta = LANG_META[rawCode] || {
            name: item.name || rawCode.toUpperCase(),
            flag: `https://flagcdn.com/w160/${rawCode}.png`,
          };

          return {
            id: item.id || idx + 1,
            code: rawCode,
            name: meta.name || item.name,
            flagImg: meta.flag,
            status: item.status || "WAITING", // COMPLETED | IN_PROGRESS | WAITING
          };
        });
        setLanguages(formatted);
      }

      // 서버에서 직접 계산해주는 진행률이 있다면 반영
      if (typeof resData?.progressPercentage === "number") {
        setServerProgress(resData.progressPercentage);
      }

      // 전체 완료 여부 체크
      const allCompleted =
        resData?.isAllCompleted ||
        (resData?.languages &&
          resData.languages.length > 0 &&
          resData.languages.every((l) => l.status === "COMPLETED"));

      if (allCompleted) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setShowToast(true);

        setTimeout(() => {
          navigate(`/project/${projectId}`);
        }, 3000);
      }
    } catch (error) {
      console.error("실시간 번역 상태 조회 오류:", error);
    }
  };

  useEffect(() => {
    fetchStatus();

    // 3초 주기로 실시간 상태 갱신
    pollingRef.current = setInterval(() => {
      fetchStatus();
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [projectId]);

  // 실시간 프로그레스바 퍼센티지 계산 (서버 제공값 우선, 없을 시 완료 개수 1/N 계산)
  const completedCount = languages.filter(
    (l) => l.status === "COMPLETED",
  ).length;
  const progressPercentage =
    serverProgress !== null
      ? serverProgress
      : languages.length > 0
        ? Math.round((completedCount / languages.length) * 100)
        : 0;

  // 3개 초과 시 좌우 슬라이드 버튼 활성화
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
        {/* 상단 반짝이 아이콘 */}
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

        {/* 실시간 프로그레스바 */}
        <S.ProgressSection>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percentage={progressPercentage} />
          </S.ProgressBarTrack>
          <S.ProgressText>{progressPercentage}%</S.ProgressText>
        </S.ProgressSection>

        <S.CardsWrapper>
          {/* 이전 버튼 (3개 초과 시 활성화) */}
          <S.TriangleButton
            onClick={handlePrev}
            disabled={!canPrev}
            $direction="left"
          >
            <svg width="18" height="22" viewBox="0 0 18 22" fill="currentColor">
              <path d="M16 2L3 11L16 20V2Z" />
            </svg>
          </S.TriangleButton>

          {/* 언어 카드 리스트 */}
          <S.CardGrid>
            {visibleLanguages.map((lang) => (
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
                </S.StatusBadge>

                <S.DescriptionText>
                  {getStatusDesc(lang.code, lang.status)}
                </S.DescriptionText>
              </S.LangCard>
            ))}
          </S.CardGrid>

          {/* 다음 버튼 (3개 초과 시 활성화) */}
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

        {/* 100% 완료 토스트 메시지 */}
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
