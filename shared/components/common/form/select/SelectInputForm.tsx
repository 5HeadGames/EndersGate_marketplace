import * as React from 'react';
import clsx from 'clsx';

import { Icon } from "../../icon";
import { Icons } from "@shared/const/Icons";
import { Typography } from "../../typography";
import { InputProps } from "@shared/interfaces/common";

export const SelectInputForm: React.FC<
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  arrayValues,
  register,
  name,
  rules,
  title,
  error,
  isFill,
  disabled,
  className,
  placeholder,
  onChangeCustom,
  labelVisible,
}) => {
  const registerAux = register(name, rules);
  const [showLabel, setShowLabel] = React.useState(false);
  return (
    <>
      <div className={clsx(className, "relative flex flex-col py-2")}>
        <label
          htmlFor="location"
          className={clsx(
            { "text-alert-error": error },
            "text-sm ml-3 font-normal mb-2 block f-18"
          )}
        >
          {(showLabel || labelVisible) && title}
        </label>
        <select
          name={name}
          className={clsx(
            {
              "border-alert-error focus:border-alert-error placeholder-alert-error focus:ring-transparent text-alert-error":
                error,
            },
            { "bg-gray-opacity-10 border-none": !isFill && !error },
            { "border border-primary": isFill },
            " disabled:placeholder-gray-200 disabled:cursor-not-allowed disabled:text-gray-500",
            "block w-full pb-3 pt-3 pl-4 pr-10 text-base text-gray-500 f-14 lh-16 font-montserrat",
            "focus:outline-none focus:ring-transparent rounded-md"
          )}
          ref={registerAux && registerAux.ref}
          onChange={(e) => {
            registerAux && registerAux.onChange(e); // method from hook form register
            onChangeCustom && onChangeCustom(e); // your method
            e.target.value === "" ? setShowLabel(false) : setShowLabel(true);
          }}
          disabled={disabled}
        >
          <option value="">
            {placeholder ? placeholder : "Select option"}
          </option>
          {arrayValues &&
            arrayValues.map((type, index) => (
              <option key={index} value={type.value}>
                {type.title}
              </option>
            ))}
        </select>
        {error && error.message && (
          <span className="flex items-center mt-3 text-alert-error font-montserrat">
            <div className="mr-1 w-4 h-3">
              <Icon src={Icons.exclamation} className="text-alert-error" />
            </div>
            <Typography type="caption" className="f-12">
              {error.message}
            </Typography>
          </span>
        )}
      </div>
    </>
  );
};
