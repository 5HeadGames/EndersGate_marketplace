import * as React from "react";
import clsx from "clsx";

export interface TypographyProps {
  type: "title" | "subTitle" | "smallTitle" | "label" | "caption" | "span";
  text?: string;
  className?: string;
  onClick?: () => void;
}

export const Typography: React.FC<TypographyProps> = ({
  type,
  children,
  text = "",
  className = "",
  onClick,
}) => {
  if (type === "title")
    return (
      <h1
        className={clsx(className, "text-xl")}
        onClick={() => onClick && onClick()}
      >
        {children || text}
      </h1>
    );
  if (type === "subTitle")
    return (
      <h2
        className={clsx("text-base", className)}
        onClick={() => onClick && onClick()}
      >
        {children || text}
      </h2>
    );
  if (type === "smallTitle")
    return (
      <h2
        className={clsx("text-sm", className)}
        onClick={() => onClick && onClick()}
      >
        {children || text}
      </h2>
    );
  if (type === "label")
    return (
      <label
        className={clsx(className, "font-montserrat")}
        onClick={() => onClick && onClick()}
      >
        {children || text}
      </label>
    );
  if (type === "span")
    return (
      <span
        className={clsx("text-xs", className)}
        onClick={() => onClick && onClick()}
      >
        {children || text}
      </span>
    );
  if (type === "caption")
    return (
      <p
        className={clsx("text-caption", className)}
        onClick={() => onClick && onClick()}
      >
        {children || text}
      </p>
    );

  return null;
};
