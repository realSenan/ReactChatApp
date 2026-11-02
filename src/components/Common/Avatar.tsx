import React, { useEffect, useState } from "react";
import defaultUserImg from "../../assets/user.png";

export type GenderType = "male" | "female" | "unspecified";

interface AvatarProps {
  src?: string | null;
  gender?: GenderType | string;
  alt?: string;
  className?: string;
  id?: string;
  onClick?: () => void;
  title?: string;
  style?: React.CSSProperties;
}

export const getGenderBgColor = (gender?: GenderType | string) => {
  if (gender === "male") return "#2563eb"; // Blue for male
  if (gender === "female") return "#db2777"; // Pink for female
  return "#7c3aed"; // Purple/Slate for unspecified
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  gender = "unspecified",
  alt = "user",
  className = "",
  id,
  onClick,
  title,
  style,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const hasValidCustomSrc = Boolean(src && src.trim() !== "" && !imgError);
  const bgColor = hasValidCustomSrc
    ? "transparent"
    : getGenderBgColor(gender);

  return (
    <img
      id={id}
      src={hasValidCustomSrc ? (src as string) : defaultUserImg}
      alt={alt}
      title={title}
      onClick={onClick}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`${className} ${
        !hasValidCustomSrc ? "default-gender-avatar" : ""
      }`.trim()}
      style={{
        backgroundColor: bgColor,
        ...( !hasValidCustomSrc ? { padding: "4px" } : {} ),
        ...style,
      }}
    />
  );
};

export default Avatar;
