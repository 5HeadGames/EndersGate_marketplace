import * as React from 'react';
import { Input } from "../input";
import { InputProps } from "@shared/interfaces/common"; 

export const InputText: React.FC<
	InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ ...props }) => {
	return (
		<>
			<Input type="text" {...props}></Input>
		</>
	);
};
