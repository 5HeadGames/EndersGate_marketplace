import * as React from 'react';
import clsx from 'clsx';
import Styles from './styles.module.scss';
// import styled, { css } from 'styled-components';

export interface BannerProps {
	title: string;
	responsive?: any;
	withButton?: boolean;
	backgroundImg: string;
	href?: string;
	textButton?: string;
	target?: boolean;
}
// const generateCSS = ({ responsive, backgroundImg }: any) => {
// 	let styles = '';
// 	styles += `background-image: url(${backgroundImg});`;
// 	if (responsive) {
// 		for (let i = 0; i < responsive.length; i++) {
// 			styles += `
// 		             @media (max-width:${responsive[i].breakpoint}px){
// 		                background-image: url(${responsive[i].img});
// 		             }
// 		           `;
// 		}
// 	}

// 	return css`
// 		${styles}
// 	`;
// };
// const ContainerSection = styled.div<any>`
// 	${generateCSS}
// `;
export const Banner: React.FC<BannerProps> = ({
	title,
	withButton,
	// backgroundImg,
	// responsive,
	href,
	target,
	textButton,
}) => {
	return (
		// <ContainerSection responsive={responsive} backgroundImg={backgroundImg}>
		<section className={clsx('bannerSection', Styles.bannerSection)}>
			<div className={clsx('containerInfo', Styles.containerInfo)}>
				<h2 className={clsx('title', Styles.title)}>{title}</h2>
				{withButton &&
					(target ? (
						<a
							className={clsx('ownerBtn', Styles.ownerBtn)}
							href={href}
							target="_blank"
						>
							{textButton}
						</a>
					) : (
						<a className={clsx('ownerBtn', Styles.ownerBtn)} href={href}>
							{textButton}
						</a>
					))}
			</div>
		</section>
		/* </ContainerSection> */
	);
};
