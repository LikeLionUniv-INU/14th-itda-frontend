import styled, { css } from "styled-components";

const COLORS = {
  primary: "#462FEA",
  border: "#D6D6D6",
  black: "#000000",
  white: "#FFFFFF",
  danger: "#FF0000",
};

const getVariantStyles = ({ variant }) => {
  switch (variant) {
    case "primary":
      return css`
        background-color: ${COLORS.primary};
        color: ${COLORS.white};
        border: 1px solid ${COLORS.primary};

        &:hover:not(:disabled) {
          opacity: 0.9;
        }
      `;

    case "secondary":
    case "outline":
      return css`
        background-color: ${COLORS.white};
        color: ${COLORS.black};
        border: 1px solid ${COLORS.border};

        &:hover:not(:disabled) {
          background-color: #f8f9fa;
          border-color: ${COLORS.black};
        }
      `;

    case "danger":
      return css`
        background-color: ${COLORS.white};
        color: ${COLORS.danger};
        border: 1px solid ${COLORS.danger};

        &:hover:not(:disabled) {
          background-color: #fff1f0;
        }
      `;

    case "tableAction":
      return css`
        background-color: ${COLORS.white};
        color: ${COLORS.primary};
        border: 1px solid ${COLORS.primary};
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 4px;

        &:hover:not(:disabled) {
          background-color: #f4f3fe;
        }
      `;

    case "tableCancel":
      return css`
        background-color: ${COLORS.white};
        color: ${COLORS.danger};
        border: 1px solid ${COLORS.danger};
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 4px;

        &:hover:not(:disabled) {
          background-color: #fff1f0;
        }
      `;

    default:
      return css`
        background-color: ${COLORS.primary};
        color: ${COLORS.white};
        border: 1px solid ${COLORS.primary};
      `;
  }
};

const getSizeStyles = ({ size, variant }) => {
  if (variant === "tableAction" || variant === "tableCancel") return null;

  switch (size) {
    case "small":
      return css`
        padding: 6px 14px;
        font-size: 13px;
        height: 32px;
      `;
    case "large":
      return css`
        padding: 12px 28px;
        font-size: 16px;
        height: 48px;
      `;
    case "medium":
    default:
      return css`
        padding: 8px 20px;
        font-size: 14px;
        height: 40px;
      `;
  }
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  box-sizing: border-box;

  ${getVariantStyles}
  ${getSizeStyles}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    background-color: #f5f5f5;
    color: ${COLORS.border};
    border-color: ${COLORS.border};
    cursor: not-allowed;
  }
`;
