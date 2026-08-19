import React from "react";
import styled from "styled-components";
import { LANGUAGES } from "./languages";

export default function LanguageSelect({
  value = "ko",
  onChange,
  width = "100%",
  height = "42px",
  disabled = false,
  className,
}) {
  return (
    <SelectWrapper width={width} height={height} className={className}>
      <StyledSelect
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </StyledSelect>
      <ArrowIcon viewBox="0 0 24 24" fill="none">
        <path
          d="M6 9L12 15L18 9"
          stroke="#828282"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </ArrowIcon>
    </SelectWrapper>
  );
}

const SelectWrapper = styled.div`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  box-sizing: border-box;
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 100%;
  padding: 0 36px 0 14px;
  border-radius: 8px;
  border: 1px solid #d6d6d6;
  background-color: #ffffff;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #000000;
  outline: none;
  cursor: pointer;
  appearance: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: #462fea;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #828282;
    cursor: not-allowed;
  }
`;

const ArrowIcon = styled.svg`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  pointer-events: none;
`;
