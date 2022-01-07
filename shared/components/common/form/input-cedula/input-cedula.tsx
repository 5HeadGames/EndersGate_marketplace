import * as React from 'react';
import { InputProps } from "@shared/interfaces/common";
import { InputList } from "../input-list";
import { OptionType } from "@shared/interfaces";
import { Input } from "../input/input";

export interface InputListProps {
	options: OptionType[];
	myDefaultValue?: string;
	handleChange: (value: string) => void;
	selectRegister: any;
	selectRules: any;
	selectError: any;
	selectIsFill: boolean;
}

export const InputCedula: React.FC<
	InputListProps & InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
	options,
	myDefaultValue,
	handleChange,
	// value,
	selectRegister,
	selectRules,
	selectError,
	selectIsFill,
	...props
}) => {
	const InputSelect = React.useCallback(() => {
		return (
			<InputList
				disabled={props.disabled}
				myDefaultValue={myDefaultValue}
				name="documentIdentity"
				title="documentIdentity"
				className="mb-4"
				options={options}
				register={selectRegister}
				rules={selectRules}
				error={selectError}
				isFill={selectIsFill}
				handleChange={handleChange}
			/>
		);
	}, [props.disabled]);

	return (
		<>
			<div className="relative container-cedula w-full">
				<Input type="text" InputSelect={InputSelect} {...props}></Input>
				<div className="select absolute top-0 h-full"></div>
			</div>
		</>
	);
};
