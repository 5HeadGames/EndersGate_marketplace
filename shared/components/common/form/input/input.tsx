import * as React from 'react';
import clsx from 'clsx';
import styles from './input.module.scss';
import { Typography } from "../../typography";
import { InputProps } from "@shared/interfaces/common";
import { Icons } from "@shared/const/Icons";
import { Icon } from "../../icon";

export const Input: React.FC<
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  name,
  title,
  isFill,
  register,
  rules,
  rightImg,
  leftImg,
  rightClick,
  leftClick,
  customPlaceholder,
  onChangeCustom,
  error,
  className,
  InputSelect,
  labelVisible,
  verifyValue,
  handleVerification,
  primary,
  ...props
}) => {
  //@typescript-eslint/no-unused-vars
  const [showLabel, setShowLabel] = React.useState(false);
  const registerAux = register(name, rules);
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
                  { "text-primary": isFill },
                  { "text-primary": primary && !error },
                  "mb-2 block f-14 text-primary"
                )}
              >
                {(showLabel || labelVisible) && title}
              </Typography>
            </div>
          )}

          {verifyValue === false && (
            <div className="flex-1 text-right">
              <Typography
                type="label"
                className={clsx(
                  "ml-3 font-bold mb-2 block f-18 text-gray-500 cursor-pointer"
                )}
                onClick={handleVerification}
              >
                <p>Verificar</p>
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
              {
                "border-alert-error focus:border-alert-error placeholder-alert-error focus:ring-transparent":
                  error || verifyValue === false,
              },
              {
                "text-alert-error ": error,
              },
              { "px-4": !leftImg && !rightImg },
              { "pl-21 md:pl-36 pr-4": InputSelect },
              { "pl-14 pr-4": leftImg },
              { "pr-8 pl-4": rightImg },
              { "border text-primary border-primary": isFill },
              { "bg-transparent border-primary": primary && !error },

              //Styles normal input
              {
                "bg-gray-opacity-10 outline-none ring-offset-transparent ring-opacity-0 border-gray-opacity-10 ring-transparent":
                  !isFill && !error,
              },
              !!isFill && styles.inputDateWithValue,
              "placeholder-gray-500 py-2 w-full text-dark font-montserrat border rounded-lg",
              {
                "border-gray-500": !error && !isFill,
              },
              "disabled:placeholder-gray-200 disabled:cursor-not-allowed disabled:text-gray-500",
              {
                "focus:outline-none focus:bg-gray-opacity-10 focus:ring-offset-transparent focus:ring-opacity-0 focus:border-none focus:ring-transparent":
                  !error,
              }
            )}
            ref={registerAux && registerAux.ref}
            onChange={(e) => {
              registerAux && registerAux.onChange(e); // method from hook form register
              onChangeCustom && onChangeCustom(e); // your method
              e.target.value === "" ? setShowLabel(false) : setShowLabel(true);
            }}
            // ref={register ? register(rules) : () => ({})}
            {...props}
          />
          {InputSelect && (
            <div className="absolute top-0 h-full w-20 md:w-32">
              <InputSelect />
            </div>
          )}

          {leftImg && (
            <div
              onClick={leftClick}
              className="absolute left-7 top-1/4 w-5 h-5"
            >
              <Icon src={leftImg} className="text-gray-500 cursor-pointer" />
            </div>
          )}
          {rightImg && (
            <div
              onClick={rightClick}
              className="absolute right-2 top-1/4 w-5 h-4"
            >
              <Icon src={rightImg} className="cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
