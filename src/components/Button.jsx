import React from "react";
import * as S from "./Button.styles";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <S.StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </S.StyledButton>
  );
};

export default Button;
