import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  isActive: boolean;
  className?: string | undefined;
}

const DisplayContainer: React.FC<Props> = ({
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

export default DisplayContainer;
