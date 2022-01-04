import * as React from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { Typography } from "../typography";
export type navElementsAuth = {
  navElementsLinks: any[];
  className?: string;
  icon: string;
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
              <div className={clsx("md:ml-12 ml-8 py-8 relative")}>
                <div className="flex items-center">
                  <img
                    src={icon}
                    className={clsx({ "opacity-50": !open }, "h-4 w-4 mr-2")}
                  />
                  <h3
                    className={clsx(
                      { "opacity-50": !open },
                      "text-base text-primary"
                    )}
                  >
                    {title}
                  </h3>
                </div>
                <div
                  className={clsx({
                    "absolute bottom-0 w-full bg-primary h-1.5 rounded-t-md":
                      open,
                  })}
                ></div>
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
            <Menu.Items className="w-max grid md:grid-cols-3 grid-cols-1 gap-4 p-6 origin-top-left absolute left-0 mt-2  rounded-md shadow-button bg-primary-disabled  focus:outline-none">
              {navElementsLinks.map((item, index) => {
                return (
                  <Menu.Item key={index}>
                    {() => (
                      <Link href={item.href}>
                        <a
                          href={item.href}
                          onClick={item?.onClick}
                          className={clsx(
                            "flex cursor-pointer items-start gap-x-2 px-4 py-4 f-14 text-normal text-dark-1 bg-overlay rounded-xl"
                          )}
                        >
                          <img
                            src={item.icon}
                            alt=""
                            className="p-2 bg-primary rounded-md"
                          />
                          <div className="flex flex-col ">
                            <Typography
                              type="subTitle"
                              className="text-primary font-bold"
                            >
                              {item.title}
                            </Typography>
                            <p className="font-bold text-sm text-white w-64">
                              {item.description}
                            </p>
                          </div>
                        </a>
                      </Link>
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
