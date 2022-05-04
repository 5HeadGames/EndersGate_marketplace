import * as React from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { Typography } from "../typography";
import Styles from "./styles.module.scss";
export type navElementsAuth = {
  navElementsLinks: any[];
  className?: string;
  icon: any;
};
export const DropdownMenu: React.FC<
  navElementsAuth & React.InputHTMLAttributes<HTMLInputElement>
> = ({ title, icon, navElementsLinks, className }) => {
  return (
    <Menu as="div" className={clsx(" relative ", className)}>
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-none">
              <span className="sr-only">Open user menu</span>
              <div
                className={clsx("md:px-6 px-4 py-6 relative", {
                  [`bg-primary text-white`]: open,
                })}
              >
                <div
                  className={clsx(
                    { "opacity-50 text-primary": !open },
                    "flex items-center  gap-2"
                  )}
                >
                  <div className="flex items-center text-2xl">{icon}</div>
                  <h3 className={clsx("text-base")}>{title}</h3>
                </div>
              </div>
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
            <Menu.Items className="w-max grid xl:grid-cols-3 md:grid-cols-2  gap-4 p-6 origin-top-left absolute left-0 mt-2  rounded-md shadow-button degradated  focus:outline-none">
              {navElementsLinks.map((item, index) => {
                return (
                  <Menu.Item key={index}>
                    {() => (
                      <a
                        href={item.externalLink}
                        onClick={item?.onClick}
                        className={clsx(
                          "flex cursor-pointer items-start gap-x-2 px-4 py-4 f-14 text-normal text-dark-1 bg-overlay rounded-md"
                        )}
                      >
                        <div className="p-2 degradated rounded-md md:flex hidden text-white text-2xl">
                          {item.icon}
                        </div>
                        <div className="flex flex-col ">
                          <Typography
                            type="subTitle"
                            className="text-primary font-bold"
                          >
                            {item.title}
                          </Typography>
                          <p className="font-bold text-sm text-white w-64 md:flex hidden">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
