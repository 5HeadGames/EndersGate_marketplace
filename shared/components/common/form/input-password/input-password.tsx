import * as React from 'react';
import {Input} from "../input";

import {Icons} from "@shared/const/Icons";
import {InputProps} from "@shared/interfaces/common";
// import { Icon } from 'components/icon';

export const InputPassword: React.FC<
	InputProps &
	React.InputHTMLAttributes<HTMLInputElement> & {
		validate?: boolean;
	}
> = ({rules, validate = true, ...props}) => {
	const [isVisible, setIsVisible] = React.useState(false);

	const handleClick = () => {
		setIsVisible(!isVisible);
	};

	// const img = isVisible ? (
	// 	<Icon src={Icons.eye} fillPath className="text-gray-900 cursor-pointer" />
	// ) : (
	// 	<Icon src={Icons.eye} fillPath className="text-gray-800 cursor-pointer" />
	// );

	const finalRules = React.useMemo(() => {
    if (validate) {
      return {
        ...rules,
        validate: (value: string) =>
          !value.match(
            new RegExp("querty|password|admin|test|administrator|123456", "i")
          ) ||
          `qwerty | password | admin | test | administrator | 123456 is not valid`,
        // pattern: {
        // 	value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&'.*])[^ ]{0,}$/g,
        // 	message: 'Password not valid.',
        // },
      };
    }
    return {
      ...rules,
    };
  }, [rules, validate]);

  return (
    <>
      <Input
        type={isVisible ? "text" : "password"}
        rules={finalRules}
        rightImg={isVisible ? Icons.eyeShow : Icons.eyeHide}
        rightClick={() => handleClick()}
        {...props}
      ></Input>
    </>
  );
};
