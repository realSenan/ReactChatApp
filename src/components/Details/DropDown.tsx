import { IoChevronDown } from "react-icons/io5";
import React, { ReactNode } from "react";
import DisplayContainer from "../Containers/ToggleContainer"

interface Props {
  id: string;
  text: string;
  isActive: boolean;
  children?: ReactNode;
  changeActive: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const DropDown: React.FC<Props> = ({
  id,
  text,
  isActive,
  children,
  changeActive,
}) => {
  return (
    <div className="drop-down">
      <div className="label-dropdown" id={id} onClick={changeActive}>
        {text}

        <div className={`icon ${isActive ? "active" : ""}`}>
          <IoChevronDown size={16} />
        </div>
      </div>

      <DisplayContainer isActive={isActive}>{children ? children : null}</DisplayContainer>
    </div>
  );
};

export default DropDown;
