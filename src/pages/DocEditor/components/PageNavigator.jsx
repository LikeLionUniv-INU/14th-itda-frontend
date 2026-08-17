import React, { useRef, useState, useEffect } from "react";
import * as S from "./PageNavigator.styles";

const ChevronLeftIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 19L8 12L15 5"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 19L16 12L9 5"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PageNavigator = ({
  pages = [],
  activePageIndex = 0,
  onSelectPage,
  onAddPage,
  isReadOnly = false,
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [pages]);

  const handleWheel = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.deltaY !== 0) {
      el.scrollLeft += e.deltaY;
      checkScrollState();
    }
  };

  const handleScrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -150, behavior: "smooth" });
    setTimeout(checkScrollState, 300);
  };

  const handleScrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: 150, behavior: "smooth" });
    setTimeout(checkScrollState, 300);
  };

  return (
    <S.NavigatorContainer>
      <S.ScrollSection>
        <S.ArrowButton
          type="button"
          canScroll={canScrollLeft}
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
        >
          <ChevronLeftIcon />
        </S.ArrowButton>

        <S.TabListWrapper
          ref={scrollRef}
          onScroll={checkScrollState}
          onWheel={handleWheel}
        >
          {pages.map((page, index) => {
            const isActive = activePageIndex === index;
            const pageNumber = index + 1;
            const pageName = page.screenName?.trim();

            return (
              <S.PageTab
                key={page.pageId || index}
                type="button"
                active={isActive}
                onClick={() => onSelectPage(index)}
              >
                <S.NumberBox active={isActive}>{pageNumber}</S.NumberBox>
                {pageName && (
                  <S.TabText active={isActive}>{pageName}</S.TabText>
                )}
              </S.PageTab>
            );
          })}
        </S.TabListWrapper>

        <S.ArrowButton
          type="button"
          canScroll={canScrollRight}
          onClick={handleScrollRight}
          disabled={!canScrollRight}
        >
          <ChevronRightIcon />
        </S.ArrowButton>
      </S.ScrollSection>

      {!isReadOnly && (
        <S.AddButton type="button" onClick={onAddPage}>
          + 페이지 추가
        </S.AddButton>
      )}
    </S.NavigatorContainer>
  );
};

export default PageNavigator;
