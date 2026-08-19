import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as S from "./Translation.styles";
import { getTranslationStatus } from "../services/documentApi";

export default function Translation({ isLeader = true, projectId = 1 }) {
  const navigate = useNavigate();

  const [languages, setLanguages] = useState([
    {
      id: 1,
      name: "한국어",
      desc: "기본 언어로 번역 없이 원본이 유지 됩니다.",
      flagImg: null,
      status: "COMPLETED",
    },
    {
      id: 2,
      name: "영어",
      desc: "자연스러운 표현으로 번역하고 있습니다.",
      flagImg: null,
      status: "WAITING",
    },
    {
      id: 3,
      name: "일본어",
      desc: "현재 언어 번역이 완료되면 자동으로 진행합니다.",
      flagImg: null,
      status: "WAITING",
    },
  ]);

  const [showToast, setShowToast] = useState(false);
  const pollingRef = useRef(null);

  // 번역 상태 폴링 함수
  const fetchStatus = async () => {
    try {
      const response = await getTranslationStatus(projectId);
      const data = response.data; // Axios 응답 데이터 구조에 맞게 접근

      if (data?.languages) {
        setLanguages(data.languages);
      }

      const allCompleted =
        data?.isAllCompleted ||
        data?.languages?.every((lang) => lang.status === "COMPLETED");

      if (allCompleted) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setShowToast(true);

        setTimeout(() => {
          if (isLeader) {
            navigate(`/project/leader/${projectId}`);
          } else {
            navigate(`/project/member/${projectId}`);
          }
        }, 3000);
      }
    } catch (error) {
      console.error("번역 진행 상태 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchStatus();

    // 3초 간격으로 진행 상황 체크
    pollingRef.current = setInterval(() => {
      fetchStatus();
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [projectId, isLeader, navigate]);

  const completedCount = languages.filter(
    (l) => l.status === "COMPLETED",
  ).length;
  const progressPercentage =
    languages.length > 0
      ? Math.round((completedCount / languages.length) * 100)
      : 0;

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
            <S.ProgressBarFill $percentage={progressPercentage} />
          </S.ProgressBarTrack>
          <S.ProgressText>{progressPercentage}%</S.ProgressText>
        </S.ProgressSection>

        <S.CardsWrapper>
          <S.NavButton disabled>
            <ChevronLeft size={24} />
          </S.NavButton>

          <S.CardGrid>
            {languages.map((lang) => (
              <S.LangCard key={lang.id}>
                <S.FlagCircle>
                  {lang.flagImg ? (
                    <img src={lang.flagImg} alt={`${lang.name} 국기`} />
                  ) : null}
                </S.FlagCircle>

                <S.LangName>{lang.name}</S.LangName>

                <S.StatusBadge $status={lang.status}>
                  {lang.status === "COMPLETED" && (
                    <>
                      <Check size={14} /> 완료
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

                <S.DescriptionText>{lang.desc}</S.DescriptionText>
              </S.LangCard>
            ))}
          </S.CardGrid>

          <S.NavButton disabled>
            <ChevronRight size={24} />
          </S.NavButton>
        </S.CardsWrapper>

        {showToast && (
          <S.ToastMessage>✓ 전체 문서의 번역이 완료되었습니다.</S.ToastMessage>
        )}
      </S.CenterContainer>
    </S.PageWrapper>
  );
}
