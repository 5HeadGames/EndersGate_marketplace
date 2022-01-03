import * as React from 'react';
import clsx from 'clsx';
import Styles from './styles.module.scss';

export interface LogoProps {
	src: string;
	description: string;
	href?: string;
	target?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
	src,
	href,
	description,
	target,
}) => {
	return href ? (
		target ? (
			<a
				className={clsx(Styles.reference)} 
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				title={description}
			>
				<img className={clsx(Styles.logo)} src={src} alt={description} />
			</a>
		) : (
			<a className={clsx(Styles.reference)} href={href} title={description}>
				<img className={clsx(Styles.logo)} src={src} alt={description} />
			</a>
		)
	) : (
		<img className={clsx(Styles.logo)} src={src} alt={description} />
	);
};
