import Link from 'next/link';
// import { Fragment } from 'react';
// import { Icon } from 'components/icon';
import { useRouter } from 'next/router';
// import { MenuIcon, XIcon } from '@heroicons/react/outline';
// import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Disclosure } from '@headlessui/react';
import { Icons, Images } from 'consts';
import clsx from 'clsx';
import { ButtonContent } from '../button/button';
import Styles from './styles.module.scss';
import { useUser } from 'hooks/user';
import { DropdownAuth } from '../dropdownAuth';
import { signOut } from 'next-auth/client';
// import { useUser } from 'hooks/user';

// function classNames(...classes: string[]) {
// 	return classes.filter(Boolean).join(' ');
// }

export const Navbar: React.FC = () => {
	const router = useRouter();

	const user = useUser();

	const navElements = [
		{
			name: 'Home',
			href: '/#header',
			handleSubMenu: false,
		},
		{
			name: 'Project Description',
			href: '/#project',
			handleSubMenu: false,
		},
		{
			name: 'Fractional Ownership',
			href: '/fractional_ownership',
			handleSubMenu: false,
		},
		{
			name: 'Gallery',
			href: '/#gallery',
			handleSubMenu: false,
		},
		{
			name: 'Availability',
			href: '/availability',
			handleSubMenu: false,
		},
		{
			name: 'Team',
			href: '/#team',
			handleSubMenu: false,
		},
		{
			name: 'Contact Us',
			href: '/#contactUs',
			handleSubMenu: false,
		},
		{
			name: 'LOG IN',
			primary: true,
			href: '/auth/signin',
			handleSubMenu: false,
		},
	];

	const navTabletElements = [
		{
			name: 'Home',
			href: '/#header',
			handleSubMenu: false,
		},
		{
			name: 'Project Description',
			href: '/#project',
			handleSubMenu: false,
		},
		{
			name: 'Fractional Ownership',
			href: '/fractional_ownership',
			handleSubMenu: false,
		},
		{
			name: 'Gallery',
			href: '/#gallery',
			handleSubMenu: false,
		},
		{
			name: 'Availability',
			href: '/availability',
			handleSubMenu: false,
		},
		{
			name: 'Team',
			href: '/#team',
			handleSubMenu: false,
		},
		{
			name: 'Contact Us',
			href: '/#contactUs',
			handleSubMenu: false,
		},
		{
			name: 'Login',
			primary: true,
			href: '/auth/signin',
			handleSubMenu: false,
		},
	];

	const navLoggedElements = [
		{
			name: 'Home',
			href: '/home',
			handleSubMenu: false,
		},
		{
			name: 'My Villas',
			href: '/myVillas',
			handleSubMenu: false,
		},
		{
			name: 'Availability',
			href: '/availability',
			handleSubMenu: false,
		},
	];

	const navElementsAuth = [
		{
			name: 'Profile',
			href: '/profile',
			icon: Icons.user,
		},
		{
			name: 'Log Out',
			href: '#',
			icon: Icons.logout,
			onClick: () => {
				signOut();
			},
		},
	];

	// interface NavElemntSubMenuProps {
	// 	name?: string;
	// 	href?: string;
	// }

	// interface NavElemntProps {
	// 	href: string;
	// 	hanldeSubMenu: boolean;
	// 	subMenu?: NavElemntSubMenuProps[];
	// 	active: boolean;
	// }

	return (
		<>
			<Disclosure as="nav" className="bg-white shadow z-20 sticky top-0">
				{({ open }) => (
					<>
						{user.token ? (
							<div
								className={clsx(
									'max-w-screen mx-auto relative',
									Styles.navbarContainer,
									{ [Styles.navbarContainerOpenLogged]: open }
								)}
							>
								<div
									className={clsx(
										'flex justify-between',
										{
											'sm:h-[80px] h-[112px] sm:pt-0 pt-8': !open,
										},
										{
											'h-auto': open,
										}
									)}
								>
									<div
										className={clsx(
											{ [Styles.logoContainerOpen]: open },
											'flex flex-1'
										)}
									>
										<Link href="/">
											<div
												className={clsx(
													'flex-shrink-0 flex items-center cursor-pointer',
													Styles.logoPadding
												)}
											>
												<img
													className={clsx(
														Styles.logoLogged,
														'block w-full py-2',
														{
															[Styles.openLogoLogged]: open,
														}
													)}
													src={Images.logo}
													alt="Logo"
												/>
											</div>
										</Link>
										<div
											className={clsx(
												'hidden sm:ml-6 sm:flex flex-auto justify-end items-center',
												Styles.gapItems
											)}
										>
											{/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
											{/* <a
											href="#"
											className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
										>
											Dashboard
											*/}
											<>
												{navLoggedElements.map((item, index) => {
													return (
														<Link key={index} href={item.href}>
															<a
																className={clsx(
																	'border-transparent whitespace-nowrap inline-flex items-center px-1 pt-1 border-b-2 f-14',
																	{
																		'text-dark hover:border-gray-300 hover:text-gray-700 ':
																			router.pathname !== item.href,
																	}
																)}
															>
																{item.name}
															</a>
														</Link>
													);
												})}
												<DropdownAuth
													navElementsAuth={navElementsAuth}
													className="ml-9"
													img_profile={user.user?.avatar.imageUri}
												/>
											</>
										</div>
									</div>
									<div className="hidden sm:ml-6 xl:flex sm:items-center">
										{/* Notifications */}
										{/* <button
										type="button"
										className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										<span className="sr-only">View notifications</span>
										<BellIcon className="h-6 w-6" aria-hidden="true" />
									</button> */}
										{/* Fin Notifications */}

										{/* Profile dropdown */}
										{/* <Menu as="div" className="ml-3 relative">
										<div>
											<Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
												<span className="sr-only">Open user menu</span>
												<img
													className="h-8 w-8 rounded-full"
													src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													alt=""
												/>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															Your Profile
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															Settings
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															Sign out
														</a>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu> */}
										{/*Fin Profile dropdown */}
									</div>
									<div
										className={clsx(
											' flex items-center sm:hidden',
											{
												'absolute right-0 top-0 bottom-0 h-full': open,
											},
											{ '-mr-2': !open }
										)}
									>
										{/* Mobile menu button */}
										<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
											<span className="sr-only">Open main menu</span>
											{open ? (
												<img
													src={Icons.menuXClose}
													className="h-10 w-10"
													alt="close Icon"
												/>
											) : (
												<img
													src={Icons.menuMobile}
													className="h-10 w-10"
													alt="menu Icon"
												/>
											)}
										</Disclosure.Button>
									</div>
								</div>
							</div>
						) : (
							<div
								className={clsx(
									'max-w-screen mx-auto relative',
									Styles.navbarContainer,
									{ [Styles.navbarContainerOpen]: open }
								)}
							>
								<div
									className={clsx(
										Styles.nav,
										'flex justify-between',
										{
											'sm:h-[80px] h-[112px] sm:pt-0 pt-8': !open,
										},
										{
											'h-auto': open,
										}
									)}
								>
									<div
										className={clsx('flex flex-1', {
											[Styles.logoContainerOpen]: open,
										})}
									>
										<Link href="/">
											<div
												className={clsx(
													'flex-shrink-0 flex items-center cursor-pointer',
													Styles.logoPadding
												)}
											>
												<img
													className={clsx(
														Styles.logo,
														'block w-full py-2 lg:max-w-[86px] max-w-[72px]',
														{ [Styles.openLogo]: open }
													)}
													src={Images.logo}
													alt="Logo"
												/>
											</div>
										</Link>
										<div
											className={clsx(
												'hidden sm:ml-6 xl:flex flex-auto justify-end items-center',
												Styles.gapItems
											)}
										>
											{/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
											{/* <a
											href="#"
											className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
										>
											Dashboard
										</a> */}
											<>
												{navElements.map((item, index) => {
													return (
														<Link key={index} href={item.href}>
															<a
																className={clsx(
																	'border-transparent whitespace-nowrap inline-flex items-center px-1 pt-1 border-b-2 f-14',
																	{
																		'text-primary font-semibold': item?.primary,
																	},
																	{
																		'text-dark hover:border-gray-300 hover:text-gray-700 ':
																			!item?.primary &&
																			router.pathname !== item.href,
																	}
																)}
															>
																{item.name}
															</a>
														</Link>
													);
												})}

												<ButtonContent
													href="/auth/register"
													decoration="fill"
													label="REGISTER"
													className="f-14"
													size="small"
												/>
											</>
										</div>
									</div>
									<div className="hidden sm:ml-6 xl:flex sm:items-center">
										{/* Notifications */}
										{/* <button
										type="button"
										className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										<span className="sr-only">View notifications</span>
										<BellIcon className="h-6 w-6" aria-hidden="true" />
									</button> */}
										{/* Fin Notifications */}

										{/* Profile dropdown */}
										{/* <Menu as="div" className="ml-3 relative">
										<div>
											<Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
												<span className="sr-only">Open user menu</span>
												<img
													className="h-8 w-8 rounded-full"
													src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													alt=""
												/>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															Your Profile
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															Settings
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															Sign out
														</a>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu> */}
										{/*Fin Profile dropdown */}
									</div>
									<div
										className={clsx(
											' flex items-center xl:hidden',
											{
												[Styles.XOpen]: open,
											},
											{ '-mr-2': !open }
										)}
									>
										{/* Mobile menu button */}
										<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:border-none">
											<span className="sr-only">Open main menu</span>
											{open ? (
												<img
													src={Icons.menuXClose}
													className="h-10 w-10"
													alt="close Icon"
												/>
											) : (
												<img
													src={Icons.menuMobile}
													className="h-10 w-10"
													alt="menu Icon"
												/>
											)}
										</Disclosure.Button>
									</div>
								</div>
							</div>
						)}
						{user.token ? (
							<Disclosure.Panel
								className={clsx(
									Styles.mobileMenuLogged,
									'sm:hidden overflow-y-scroll'
								)}
							>
								<div
									className={clsx(
										Styles.navbarContainer,
										'pt-2 pb-3 space-y-1'
									)}
								>
									{/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
									{/* <a
									href="#"
									className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
								>
									Dashboard
								</a> */}

									<>
										{navLoggedElements.map((item, index) => {
											return (
												<Link key={index} href={item.href}>
													<a
														className={clsx(
															'border-transparent font-extralight block items-center f-36  pr-4 py-8  text-base border-b-2',

															'text-dark hover:border-gray-300 hover:text-gray-700'
														)}
													>
														{item.name}
													</a>
												</Link>
											);
										})}
										{navElementsAuth.map((item, index) => {
											return (
												<Link key={index} href={item.href}>
													<a
														className={clsx(
															'border-transparent font-extralight block items-center f-36 pr-4 py-8 border-l-4 text-base border-b-2',

															'text-dark hover:border-gray-300 hover:text-gray-700'
														)}
														onClick={item.onClick}
													>
														{item.name}
													</a>
												</Link>
											);
										})}
									</>
								</div>
							</Disclosure.Panel>
						) : (
							<Disclosure.Panel
								className={clsx(
									Styles.mobileMenu,
									'xl:hidden overflow-y-scroll'
								)}
							>
								<div
									className={clsx(
										Styles.navbarContainer,
										'pt-2 pb-3 space-y-1'
									)}
								>
									{/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
									{/* <a
									href="#"
									className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
								>
									Dashboard
								</a> */}

									<>
										{navTabletElements.map((item, index) => {
											return (
												<Link key={index} href={item.href}>
													<a
														className={clsx(
															'border-transparent font-extralight block items-center f-36 pr-4 py-8 text-base border-b-2',
															{
																'text-primary': item?.primary,
															},
															{
																'text-dark hover:border-gray-300 hover:text-gray-700 ':
																	!item?.primary,
															}
														)}
													>
														{item.name}
													</a>
												</Link>
											);
										})}
										<div className="">
											<ButtonContent
												href="#"
												decoration="fill"
												size="medium"
												label="Register"
												className="f-14"
											/>
										</div>
									</>
								</div>
							</Disclosure.Panel>
						)}
					</>
				)}
			</Disclosure>
		</>
	);
};
