import React, { Fragment } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { navigation } from 'consts/navigation';
import { Icons } from 'consts/icons';
import { Images } from 'consts';
import Styles from './styles.module.scss';
// import { MailsApiService } from 'api/mails/mails';
// import { useQuery } from 'react-query';

// interface LayoutDashboardProps {
// 	children?: any;
// }

export const SidebarDesktop: React.FC = () => {
	// const { data: mails, refetch } = useQuery<any>(
	// 	[`GET_MAILS_FALSE`],

	// 	() => MailsApiService.getMails('unchecked', 0),
	// 	{
	// 		keepPreviousData: true,
	// 	}
	// );
	// React.useEffect(() => {
	// 	setInterval(() => {
	// 		refetch();
	// 	}, 10000);
	// }, []);
	const [openMenu, setOpenMenu] = React.useState(false);
	const router = useRouter();
	const activeGPage = router.pathname === '/dashboard/settings/generalPages';
	const activeFAQ = router.pathname === '/dashboard/settings/FAQ';
	React.useEffect(() => {
		if (
			router.pathname === '/dashboard/settings/generalPages' ||
			router.pathname === '/dashboard/settings/FAQ'
		) {
			setOpenMenu(true);
		}
	}, [router]);
	return (
		<>
			{/*  Sidebar desktop */}
			<div
				className={clsx(
					Styles.sideBarDesktop,
					'hidden md:flex md:flex-shrink-0 bg-secondary'
				)}
			>
				<div className="flex flex-col flex-auto">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex flex-col h-0 flex-1">
						<div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto scroll-custom">
							<div className="flex justify-center flex-shrink-0 w-full">
								<Link href="/dashboard">
									<a
										className={clsx(
											'cursor-pointer flex items-center justify-center'
										)}
									>
										<img
											className="max-w-[244px]"
											src={Images.logoSidebar}
											alt=""
										/>
									</a>
								</Link>
							</div>
							<nav className="mt-12 flex-1">
								{navigation.map((item) => {
									return (
										<Fragment key={'nav-desktop-' + item.id}>
											{/* <p className="text-white f-18 font-semibold px-3 pt-7">
												{item.label}
											</p> */}
											{item.subNavigation.map((subItem) => {
												const active = router.pathname === subItem.href;
												// const notification =
												// 	!active &&
												// 	subItem.name === 'mails' &&
												// 	mails !== undefined &&
												// 	mails.payload.length !== 0;
												return (
													<Link key={subItem.name} href={subItem.href}>
														<a
															className={clsx(
																active
																	? 'bg-active text-white font-bold opacity-100 '
																	: 'text-white hover:bg-active font-light  opacity-70',
																// notification ? 'opacity-80' : '',
																'group flex items-center pl-12 py-9 hover:opacity-90 text-base f-18 relative'
															)}
														>
															{/* <div
																className={clsx(
																	{
																		// ['hidden']: !notification,
																	},
																	'h-4 w-4 text-xs bg-white flex justify-center items-center',
																	'text-primary absolute rounded-full bottom-0 left-0 font-bold'
																)}
															>
																{/* {mails !== undefined
																	? mails.payload.length > 9
																		? '+9'
																		: mails.payload.length
																	: ''} *
															</div> */}
															<img
																src={subItem.icon}
																className="mr-4 flex-shrink-0 h-6 w-6 text-white"
																aria-hidden="true"
															/>
															{subItem.label}
														</a>
													</Link>
												);
											})}
											<div
												className={clsx(
													'text-white hover:bg-active font-light opacity-70',
													// notification ? 'opacity-80' : '',
													'group cursor-pointer flex items-center justify-between pl-12 pr-4 py-9 hover:opacity-90 text-base f-18 relative'
												)}
												onClick={() => {
													setOpenMenu((open) => !open);
												}}
											>
												<div className="flex flex-row">
													<img
														src={Icons.settings}
														className="mr-4 flex-shrink-0 h-6 w-6 text-white"
														aria-hidden="true"
													/>
													Site settings
												</div>
												<img
													src={Icons.arrowSettings}
													style={{ transform: openMenu ? 'rotate(90deg)' : '' }}
													alt=""
												/>
											</div>
											<div
												className={clsx(
													{ 'flex flex-col': openMenu },
													{ ['hidden']: !openMenu }
												)}
											>
												<Link href="/dashboard/settings/generalPages">
													<a
														className={clsx(
															activeGPage
																? 'bg-active text-white font-bold opacity-100 '
																: 'text-white hover:bg-active font-light  opacity-70',
															// notification ? 'opacity-80' : '',
															'group flex items-center pl-20 py-9 hover:opacity-90  text-base f-18 relative'
														)}
													>
														General pages
													</a>
												</Link>
												<Link href="/dashboard/settings/FAQ">
													<a
														className={clsx(
															activeFAQ
																? 'bg-active text-white font-bold opacity-100 '
																: 'text-white hover:bg-active font-light  opacity-70',
															// notification ? 'opacity-80' : '',
															'group flex items-center pl-20 py-9 hover:opacity-90 text-base f-18 relative'
														)}
													>
														FAQ
													</a>
												</Link>
											</div>
											<div className="divider mx-3 mt-7"></div>
										</Fragment>
									);
								})}
							</nav>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
