import * as React from 'react';
import clsx from 'clsx';
import styles from './input-check.module.scss';
import { Typography } from '../../typography';
import { Icon } from "../../icon";
import { Icons } from "@shared/const/Icons";
import { InputProps } from "@shared/interfaces/common";

export const InputCheck: React.FC<
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ name, register, rules, error, children, className, ...props }) => {
  return (
    <div className={clsx(className, "flex items-start justify-start w-full")}>
      <div className={clsx(styles.content, "flex items-start justify-start")}>
        <input
          className={clsx(styles.checkbox)}
          type="checkbox"
          id={name}
          name={name}
          {...register(name, rules)}
          {...props}
        />
        <label htmlFor={name}></label>
      </div>

      <Typography type="span" className={"ml-2"}>
        <label
          htmlFor={name}
          className={clsx(
            { "cursor-not-allowed": props.disabled },
            { "cursor-pointer": !props.disabled },
            styles.text
          )}
        >
          {children}
        </label>
      </Typography>
      {error && error.message && (
        <span className="flex ml-5 mt-3 text-alert-error font-montserrat">
          <Icon src={Icons.exclamation} className="mr-5 text-alert-error" />{" "}
          <Typography type="label">{error.message}</Typography>
        </span>
      )}
    </div>
  );
};
