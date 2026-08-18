import React, { useState, useEffect } from "react";
import * as S from "./Translation.styles";

// 국기 이미지 API 대신 이모지(Emoji) 사용
const LANGUAGES_INFO = {
  KR: {
    code: "KR",
    name: "한국어",
    flagEmoji: "🇰🇷",
    completedDesc: "기본 언어로 번역 없이 원본이 유지 됩니다.",
    inProgressDesc: "자연스러운 표현으로 번역하고 있습니다.",
    waitingDesc: "현재 언어 번역이 완료되면 자동으로 진행합니다.",
  },
  US: {
    code: "US",
    name: "영어",
    flagEmoji: "🇺🇸",
    completedDesc: "번역이 성공적으로 완료되었습니다.",
    inProgressDesc: "자연스러운 표현으로 번역하고 있습니다.",
    waitingDesc: "현재 언어 번역이 완료되면 자동으로 진행합니다.",
  },
  JP: {
    code: "JP",
    name: "일본어",
    flagEmoji: "🇯🇵",
    completedDesc: "번역이 성공적으로 완료되었습니다.",
    inProgressDesc: "자연스러운 표현으로 번역하고 있습니다.",
    waitingDesc: "현재 언어 번역이 완료되면 자동으로 진행합니다.",
  },
  CN: {
    code: "CN",
    name: "중국어",
    flagEmoji: "🇨🇳",
    completedDesc: "번역이 성공적으로 완료되었습니다.",
    inProgressDesc: "자연스러운 표현으로 번역하고 있습니다.",
    waitingDesc: "현재 언어 번역이 완료되면 자동으로 진행합니다.",
  },
  ES: {
    code: "ES",
    name: "스페인어",
    flagEmoji: "🇪🇸",
    completedDesc: "번역이 성공적으로 완료되었습니다.",
    inProgressDesc: "자연스러운 표현으로 번역하고 있습니다.",
    waitingDesc: "현재 언어 번역이 완료되면 자동으로 진행합니다.",
  },
};

export default function Translation({
  targetLanguages = ["KR", "US", "JP"],
  onComplete,
}) {
  // 언어별 번역 진행 상태 ('COMPLETED' | 'IN_PROGRESS' | 'WAITING')
  const [langStatuses, setLangStatuses] = useState(() => {
    const initial = {};
    targetLanguages.forEach((code, index) => {
      if (index === 0) initial[code] = "COMPLETED";
      else if (index === 1) initial[code] = "IN_PROGRESS";
      else initial[code] = "WAITING";
    });
    return initial;
  });

  // 캐러셀 인덱스 (3개 초과 시 좌우 이동용)
  const [startIndex, setStartIndex] = useState(0);

  // 완료 메시지 토스트 상태
  const [isCompleteMessageVisible, setIsCompleteMessageVisible] =
    useState(false);

  // Progress Bar 계산 (문서 1개 완료 시 1/n 씩 증가)
  const totalCount = targetLanguages.length;
  const completedCount = Object.values(langStatuses).filter(
    (status) => status === "COMPLETED",
  ).length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // 번역 진행 완료 시뮬레이션
  useEffect(() => {
    if (percentage === 100) return;

    const timer = setTimeout(() => {
      setLangStatuses((prev) => {
        const next = { ...prev };
        const inProgressLang = targetLanguages.find(
          (code) => next[code] === "IN_PROGRESS",
        );
        if (inProgressLang) {
          next[inProgressLang] = "COMPLETED";
          const waitingLang = targetLanguages.find(
            (code) => next[code] === "WAITING",
          );
          if (waitingLang) {
            next[waitingLang] = "IN_PROGRESS";
          }
        }
        return next;
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [langStatuses, targetLanguages, percentage]);

  // 100% 달성 시 3초 후 메인 페이지로 이동
  useEffect(() => {
    if (percentage === 100) {
      setIsCompleteMessageVisible(true);

      const redirectTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [percentage, onComplete]);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, targetLanguages.length - 3));
  };

  const visibleLanguages = targetLanguages.slice(startIndex, startIndex + 3);

  return (
    <S.PageWrapper>
      <S.CenterContainer>
        <S.SparkleIconWrapper>
          <S.SparkleIcon />
        </S.SparkleIconWrapper>

        <S.Title>AI 번역 진행중...</S.Title>
        <S.SubTitle>문서를 분석하고 각 언어로 번역을 진행합니다.</S.SubTitle>

        <S.ProgressSection>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percentage={percentage} />
          </S.ProgressBarTrack>
          <S.ProgressText>{percentage}%</S.ProgressText>
        </S.ProgressSection>

        <S.CardsWrapper>
          <S.NavButton
            onClick={handlePrev}
            disabled={startIndex === 0 || targetLanguages.length <= 3}
          >
            ◀
          </S.NavButton>

          <S.CardGrid>
            {visibleLanguages.map((code) => {
              const langInfo = LANGUAGES_INFO[code] || {
                name: code,
                flagEmoji: "🌐",
                completedDesc: "",
                inProgressDesc: "",
                waitingDesc: "",
              };
              const status = langStatuses[code] || "WAITING";

              return (
                <S.LangCard key={code}>
                  <S.FlagCircle>
                    <S.FlagEmoji>{langInfo.flagEmoji}</S.FlagEmoji>
                  </S.FlagCircle>

                  <S.LangName>{langInfo.name}</S.LangName>

                  {status === "COMPLETED" && (
                    <S.StatusBadge $status="COMPLETED">
                      <span className="icon">✓</span> 완료
                    </S.StatusBadge>
                  )}
                  {status === "IN_PROGRESS" && (
                    <S.StatusBadge $status="IN_PROGRESS">
                      <span className="icon spinner">❇</span> 번역 중
                    </S.StatusBadge>
                  )}
                  {status === "WAITING" && (
                    <S.StatusBadge $status="WAITING">
                      <span className="icon">🕒</span> 대기 중
                    </S.StatusBadge>
                  )}

                  <S.DescriptionText>
                    {status === "COMPLETED" && langInfo.completedDesc}
                    {status === "IN_PROGRESS" && langInfo.inProgressDesc}
                    {status === "WAITING" && langInfo.waitingDesc}
                  </S.DescriptionText>
                </S.LangCard>
              );
            })}
          </S.CardGrid>

          <S.NavButton
            onClick={handleNext}
            disabled={
              targetLanguages.length <= 3 ||
              startIndex >= targetLanguages.length - 3
            }
          >
            ▶
          </S.NavButton>
        </S.CardsWrapper>

        {isCompleteMessageVisible && (
          <S.ToastMessage>
            전체 문서의 번역이 완료되었습니다. 메인 페이지로 이동합니다.
          </S.ToastMessage>
        )}
      </S.CenterContainer>
    </S.PageWrapper>
  );
}
