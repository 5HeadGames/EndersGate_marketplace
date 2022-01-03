import clsx from 'clsx';
import { Images } from 'consts';
import Link from 'next/link';
import * as React from 'react';
import Styles from './styles.module.scss';

const Footer = () => {
	const footerLinks = [
		{
			name: 'Home',
			href: '/#header',
		},
		{
			name: 'Project Description',
			href: '/#project',
		},
		{
			name: 'Fractional Ownership',
			href: '/fractional_ownership',
		},
		{
			name: 'Gallery',
			href: '/#gallery',
		},
		{
			name: 'Availability',
			href: '/availability',
		},
		{
			name: 'Team',
			href: '/#team',
		},
		{
			name: 'Contact Us',
			href: '/#contactUs',
		},
	];
	return (
		<footer className={clsx(Styles.footer)} id="footer">
			<div className={clsx(Styles.containerLogo)}>
				<img className={clsx(Styles.logo)} src={Images.logoFooter} />
			</div>

			<div className={clsx(Styles.containerFooter)}>
				<div className={clsx(Styles.navFooter)}>
					{footerLinks.map((item, index) => {
						return (
							<Link href={item.href}>
								<h4
									key={index}
									className={clsx('cursor-pointer', Styles.footerLink)}
								>
									{item.name}
								</h4>
							</Link>
						);
					})}
				</div>

				<p className={clsx(Styles.rights)}>Copyright © 2021</p>
			</div>
		</footer>
	);
};

export default Footer;
