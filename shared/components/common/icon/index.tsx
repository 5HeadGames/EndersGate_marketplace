import * as React from 'react';

export interface IconProps {
	src: string;
	description: string;
	href?: string;
	target?: boolean;
}

export const Icon: React.FC<IconProps> = ({
	src,
	href,
	description,
	target,
}) => {
	return href ? (
		target ? (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				title={description}
			>
				<img src={src} alt={description} />
			</a>
		) : (
			<a href={href} title={description}>
				<img src={src} alt={description} />
			</a>
		)
	) : (
		<img src={src} alt={description} />
	);
};
