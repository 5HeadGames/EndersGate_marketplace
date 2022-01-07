import clsx from "clsx";
import * as React from "react";

export interface IconProps {
  src: string;
  description?: string;
  href?: string;
  target?: boolean;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  src,
  href,
  description,
  target,
  className,
}) => {
  return href ? (
    target ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={description}
      >
        <img src={src} alt={description} className={clsx(className)} />
      </a>
    ) : (
      <a href={href} title={description}>
        <img src={src} alt={description} className={clsx(className)} />
      </a>
    )
  ) : (
    <img src={src} alt={description} className={clsx(className)} />
  );
};
