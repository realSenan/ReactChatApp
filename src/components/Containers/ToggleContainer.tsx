import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  isActive: boolean;
  className?: string;
}

const ToggleContainer: React.FC<Props> = ({
  className = "",
  isActive,
  children,
}) => {
  return (
    <div
      className={`display-container ${isActive ? "active" : ""} ${className}`}
    >
      <div id="hidden">{children ? children : null}</div>
    </div>
  );
};

export default ToggleContainer;
