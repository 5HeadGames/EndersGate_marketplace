import Link from 'next/link';
import * as React from 'react';
// import { Icon } from 'components/icon';
import { useRouter } from 'next/router';
import { Disclosure } from '@headlessui/react';
import { Images } from 'consts';
import clsx from 'clsx';
// import { ButtonContent } from '../button/button';
import Styles from './styles.module.scss';

export const SideBar = () => {
	const router = useRouter();

	const sideElements = [
		{
			name: 'Personal info',
			href: '/profile',
			handleSubMenu: false,
		},
		{
			name: 'Security',
			href: '/profile/security',
			handleSubMenu: false,
		},
		{
			name: 'Payment methods',
			href: '/profile/paymentMethods',
			handleSubMenu: false,
		},
	];

	return (
		<>
			{/* <Disclosure as="div" className="sidebarContainer h-screen bg-gray d-flex flex-column"> */}
			<Disclosure as="div" className={clsx(Styles.sidebarContainer)}>
				{() => (
					<>
						<div className={clsx(Styles.containerItems)}>
							{sideElements.map((item, index) => {
								return (
									<Link key={index} href={item.href}>
										<h3
											className={clsx(
												Styles.sidebarItem,
												' sm:whitespace-nowrap cursor-pointer f-14 text-white',
												{
													'font-bold bg-gray-500': router.pathname == item.href,
												}
											)}
										>
											{item.name}
										</h3>
									</Link>
								);
							})}
						</div>

						<img
							className={clsx(Styles.imgLogo)}
							src={Images.logoSidebar}
							alt="Logo"
						/>
					</>
				)}
			</Disclosure>
		</>
	);
};
