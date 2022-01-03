import * as React from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Icon } from 'components/icon';
import { Images } from 'consts';
import { Spinner } from '../spinner/spinner';
import { useUser } from 'hooks/user';
export type navElementsAuth = {
	navElementsAuth: any[];
	className?: string;
	img_profile: string;
};
export const DropdownAuth: React.FC<
	navElementsAuth & React.InputHTMLAttributes<HTMLInputElement>
> = ({ navElementsAuth, className }) => {
	const { user } = useUser();
	return (
		<Menu as="div" className={clsx(' relative ', className)}>
			<div>
				<Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-none focus:ring-white">
					<span className="sr-only">Open user menu</span>
					{user !== undefined ? (
						<img
							src={
								user?.avatar?.imageUri ? user?.avatar?.imageUri : Images.profile
							}
							alt=""
							className="w-16 h-16 rounded-full"
							key="loginImg"
						/>
					) : (
						<Spinner type="loadingButton"></Spinner>
					)}
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="w-max origin-top-right absolute right-0 mt-2  rounded-md shadow-button py-1 bg-white  focus:outline-none">
					{navElementsAuth.map((item, index) => {
						return (
							<Menu.Item key={index}>
								{() => (
									<a
										href={item.href}
										onClick={item?.onClick}
										className={clsx(
											'flex flew-row items-center gap-x-2 px-4 py-4 f-14 text-normal text-dark-1'
										)}
									>
										<Icon
											src={item.icon}
											originalSize
											className={'h-auto w-[18px]'}
										/>
										{item.name}
									</a>
								)}
							</Menu.Item>
						);
					})}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};
