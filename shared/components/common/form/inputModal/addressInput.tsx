"use client";
import * as React from "react";
import clsx from "clsx";
import styles from "./input.module.scss";
import { Typography } from "../../typography";
import { XIcon } from "@heroicons/react/solid";

export const AddressInputModal: React.FC<
  any & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  name,
  title,
  isFill,
  ref,
  rules,
  rightImg,
  leftImg,
  rightClick,
  leftClick,
  customPlaceholder,
  onChangeCustom,
  error,
  className,
  classNameContainer,
  InputSelect,
  labelVisible,
  verifyValue,
  handleVerification,
  white,
  reset,
  withoutX = false,
  ...props
}) => {
  //@typescript-eslint/no-unused-vars

  const [showLabel, setShowLabel] = React.useState(false);

  return (
    <div className={clsx("relative flex flex-col w-full", className)}>
      <div className={clsx(styles.input)}>
        <div className="flex flex-1">
          {labelVisible && (
            <div className="flex-auto">
              <Typography
                type="label"
                className={clsx(
                  { "text-alert-error": error || verifyValue === false },
                  { "text-white": isFill },
                  { "text-white": white && !error },
                  "mb-1 block text-sm font-bold text-white",
                )}
              >
                {(showLabel || labelVisible) && title}
                <span className="text-alert-error">*</span>
              </Typography>
            </div>
          )}
        </div>
        <div className="relative container-input">
          <input
            onKeyUp={(e) => {
              if (props.type === "tel") {
                e.currentTarget.value === ""
                  ? setShowLabel(false)
                  : setShowLabel(true);
              }
            }}
            id={name}
            name={name}
            placeholder={customPlaceholder || title}
            autoComplete="off"
            className={clsx(
              styles.text,

              //Styles normal input
              {
                "outline-none ring-offset-transparent ring-opacity-0 ring-transparent":
                  !isFill && !error,
              },
              !!isFill && styles.inputDateWithValue,
              "placeholder-white-disabled  w-full font-montserrat border-b-[0.5px] border-gray-200",
              {
                "border-gray-500": !error && !isFill,
              },
              "placeholder-gray-500 disabled:cursor-not-allowed disabled:text-gray-500",
              "bg-transparent text-white text-sm",
              {
                "focus:outline-none focus:ring-offset-transparent focus:ring-opacity-0 focus:border-white focus:ring-transparent p-1":
                  !error,
              },
              classNameContainer,
            )}
            ref={ref}
            onChange={(e) => {
              onChangeCustom && onChangeCustom(e); // your method
              e.target.value === "" ? setShowLabel(false) : setShowLabel(true);
            }}
            // ref={register ? register(rules) : () => ({})}
            {...props}
          />
        </div>
      </div>
    </div>
  );
};
