/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import clsx from 'clsx';
import styles from './textarea.module.scss';
import { Typography } from '../../typography';
import { InputProps } from "@shared/interfaces/common"; 
import { ETIME } from 'constants';

export const Textarea: React.FC<
	InputProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({
	name,
	title,
	customPlaceholder,
	isFill,
	optional = false,
	NoterrorMessage,
	onChangeCustom,
	register,
	rules,
	rightImg,
	leftImg,
	rightClick,
	leftClick,
	error,
	defaultChars = 0,
	rows,
	cols,
	maxLength = 0,
	className,
	...props
}) => {
	const [chars, setChars] = React.useState<number>(defaultChars);
	const registerAux = register(name, rules);

	React.useEffect(() => {
		setChars(defaultChars);
	}, [defaultChars]);

	const countCharacters = (e: any) => {
		const text = e.target.value.length;
		setChars(text);
		// if (text >= maxLength) {
		// 	e.target.value = e.target.value.substring(0, maxLength - 1);
		// }
	};

	return (
		<div className={clsx('relative flex flex-col w-full', className)}>
			<div className={clsx(styles.input)}>
				{/* <Typography type="label">
					{title}
					{optional && (
						<Typography type="label" className={'text-gray-200'}>
							{` (Optional)`}
						</Typography>
					)}
				</Typography> */}
				<textarea
					id={name}
					name={name}
					placeholder={customPlaceholder || title}
					autoComplete="off"
					// rows={10}
					onKeyUp={countCharacters}
					className={clsx(
						className,
						{
							'border-alert-error focus:border-alert-error placeholder-alert-error focus:ring-transparent':
								error,
						},
						{
							'text-alert-error ': error,
						},
						{ 'px-4': !leftImg && !rightImg },
						{ 'pl-14 pr-4': leftImg },
						{ 'pr-8': rightImg },
						{ 'bg-transparent border-primary': isFill },
						{ 'bg-transparent border-primary': !error },

						//Styles normal input
						{
							'bg-gray-opacity-10 outline-none ring-offset-transparent ring-opacity-0 border-gray-opacity-10 ring-transparent':
								!isFill && !error,
						},
						!!isFill && styles.inputDateWithValue,
						'placeholder-gray-500 py-2 w-full text-gray-500 font-montserrat border f-14  rounded-lg',
						{
							'border-gray-500': !error && !isFill,
						},
						'disabled:placeholder-gray-200 disabled:cursor-not-allowed disabled:text-gray-500',
						{
							'focus:outline-none focus:bg-gray-opacity-10 focus:ring-offset-transparent focus:ring-opacity-0 focus:border-gray-opacity-10 focus:ring-transparent':
								!error,
						}
					)}
					ref={registerAux && registerAux.ref}
					onChange={(e) => {
						registerAux && registerAux.onChange(e); // method from hook form register
						onChangeCustom && onChangeCustom(e); // your method
					}}
					{...props}
				/>

				<div className="flex flex-row justify-between items-center m-0 text-gray-800">
					<div className="flex-1">
						{!NoterrorMessage && error && error.message && (
							<Typography
								type="caption"
								className="font-semibold text-alert-error"
							>
								{error.message}
							</Typography>
						)}{' '}
					</div>
					{/*	<div
						className={clsx('flex-1 text-right', {
							'text-alert-error': error && error.message,
						})}
					>{`${chars}/${maxLength}`}</div>*/}
				</div>

				{/* {!NoterrorMessage && error && error.message && (
					<div className="w-full flex justify-end mt-3 h-4">
						<Typography
							type="caption"
							className="font-semibold text-alert-error"
						>
							{error.message}
						</Typography>
					</div>
				)} */}
				{leftImg && (
					<div
						onClick={leftClick}
						className="absolute left-7 top-[42px] w-4 h-3"
					>
						{leftImg}
					</div>
				)}
				{rightImg && (
					<div
						onClick={rightClick}
						className="absolute right-4 top-[42px] w-4 h-3"
					>
						{rightImg}
					</div>
				)}
			</div>
		</div>
	);
};
