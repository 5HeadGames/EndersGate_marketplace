import * as React from 'react';
import clsx from 'clsx';
import Styles from './styles.module.scss';

export interface PhaseProps {
	name: string;
	photo: string;
	href?: string;
	left?: boolean;
}

export const Phase: React.FC<PhaseProps> = ({ name, photo, href, left }) => {
	return (
		<a className={clsx(Styles.phase)} href={href}>
			<img className={clsx(Styles.phaseBg)} src={photo} />
			<div
				className={clsx(
					{ [Styles.right]: !left },
					{ 'left-0': left },
					Styles.containerInfo
				)}
			>
				<p className={clsx(Styles.title)}>{name}</p>
			</div>
		</a>
	);
};
