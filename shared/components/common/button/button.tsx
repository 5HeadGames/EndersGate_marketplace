import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import {Spinner} from "../spinner/spinner";
import {Typography} from "../typography";

export interface ButtonProps {
  size?: "extra-small" | "small" | "medium" | "large" | "full";
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
  fill?: boolean;
  labelProps?: string;
  href?: string;
  decoration?: "fill" | "line-white" | "line-primary" | "fillPrimary";
  social?: "facebook" | "google";
  icon?: any;
  className?: string;
  withBorder?: boolean;
  boderRadius?: string;
  type?: string;
  tag?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  size,
  label,
  disabled,
  onClick,
  decoration,
  social,
  icon,
  withBorder = true,
  className,
  loading,
  labelProps,
  tag = false,
  children,
  type,
  ...props
}) => {
    return (
      <>
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={clsx(
            // with border
            { "border-none": !withBorder },
            //size
            { "w-full": size === "full" },

            //fill
            {
              "bg-primary border-transparent shadow-md text-white":
                decoration === "fill" && !social && !tag,
            },
            {
              "bg-primary border-primary shadow-md text-white":
                decoration === "fillPrimary" && !social && !tag,
            },
            {
              "hover:text-primary hover:border-primary hover:bg-transparent":
                decoration === "fillPrimary" && !social && !disabled,
            },
            {
              "hover:text-primary hover:border-primary hover:bg-transparent":
                decoration === "fill" && !social && !disabled,
            },
            //not fill white
            {
              "text-gray-0 border-gray-0":
                decoration === "line-white" && !social,
            },
            {
              "hover:bg-primary hover:text-gray-0 hover:border-primary":
                decoration === "line-white" && !social && !disabled,
            },
            //not fill primary
            {
              "text-primary border-primary":
                decoration === "line-primary" && !social,
            },
            {
              "hover:bg-primary hover:text-white hover:border-primary":
                decoration === "line-primary" && !social && !disabled,
            },
            //disabled
            {
              "disabled:bg-primary-disabled disabled:text-primary disabled:opacity-50 disabled:border-primary-disabled":
                !social && !tag,
            },
            //facebook
            { "text-facebook border-facebook": social === "facebook" },
            {
              "hover:text-gray-0 hover:bg-facebook":
                social === "facebook" && !disabled,
            },
            //google
            { "text-gray-500 border-gray-500": social === "google" },
            {
              "hover:text-gray-0 hover:bg-gray-500":
                social === "google" && !disabled,
            },
            //disable social
            {
              "disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-900 disabled:opacity-50":
                social,
            },

            //global
            "group flex items-center justify-center border rounded-[8px] outline-none transition-colors duration-200",
            "focus:outline-none",
            "disabled:cursor-not-allowed",
            { "px-6 py-2": size === "small" },
            { "px-10 py-4": size === "medium" },
            "font-medium",

            // tag
            {
              "mb-4 px-4 mx-2 border-black bg-gray-200 disabled:text-gray-0 disabled:opacity-50":
                tag && disabled,
            },
            className
          )}
          {...props}
        >
          {label ? (
            <Typography
              type="label"
              className={clsx(
                labelProps,
                "w-full text-left cursor-pointer flex items-center"
              )}
            >
              {icon && (
                <div className="mr-2 w-4 h-4 flex shrink-0 items-center">
                  {typeof icon === "string" ? (
                    <img
                      alt="icon"
                      src={icon}
                      className={clsx(
                        {
                          "text-facebook ": social === "facebook",
                        },
                        {
                          "group-hover:text-gray-0":
                            social === "facebook" && !disabled,
                        }
                      )}
                    />
                  ) : (
                    icon
                  )}
                </div>
              )}
              {loading && <Spinner type="loadingButton" />}
              {label}
            </Typography>
          ) : (
            children
          )}
        </button>
      </>
    );
  };

export const ButtonContent: React.FC<
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  size,
  label,
  disabled,
  onClick,
  href,
  decoration = "fill",
  social,
  icon,
  children,
  tag = false,
  className,
  type,
  ...props
}) => {
    return (
      <>
        {href ? (
          <Link href={href}>
            <a>
              <Button
                size={size}
                label={label}
                disabled={disabled}
                href={href}
                decoration={decoration}
                social={social}
                icon={icon}
                tag={tag}
                className={className}
                type={type}
                {...props}
              >
                {children}
              </Button>
            </a>
          </Link>
        ) : (
          <Button
            size={size}
            label={label}
            disabled={disabled}
            onClick={onClick}
            href={href}
            decoration={decoration}
            social={social}
            icon={icon}
            tag={tag}
            type={type}
            className={className}
            {...props}
          >
            {children}
          </Button>
        )}
      </>
    );
  };
