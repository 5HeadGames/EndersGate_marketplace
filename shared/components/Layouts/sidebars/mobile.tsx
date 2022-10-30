import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useMoralis } from "react-moralis";

import { useRouter } from "next/router";
import { Icons } from "@shared/const/Icons";
import { Button } from "@shared/components/common/button/button";
import ProfileDataAndActions from "@shared/components/Profile/profilePersonalData/profilePersonalData";
import {
  AppstoreFilled,
  AreaChartOutlined,
  DownOutlined,
  GoldenFilled,
  RightOutlined,
  ShopOutlined,
  TwitterOutlined,
  WalletOutlined,
} from "@ant-design/icons";

interface LayoutDashboardProps {
  title?: string;
  isLoading?: boolean;
  sidebarOpen?: boolean;
  setSidebarOpen?: any;
  initialFocus?: any;
  navItems?: any;
}
export const SidebarMobile: React.FC<LayoutDashboardProps> = ({
  // title = '',
  // isLoading = false,
  // children,
  navItems,
  sidebarOpen = false,
  setSidebarOpen = {},
  initialFocus = null,
}) => {
  const router = useRouter();
  const { user } = useMoralis();
  const address = user?.get("ethAddress") || "";
  const [set, setSet] = React.useState(false);

  return (
    <>
      {/* Sidebar mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed h-[calc(100vh-56px)] top-[56px] w-screen top-0 flex z-40 md:hidden bg-overlay"
          open={sidebarOpen}
          onClose={setSet as any}
          initialFocus={initialFocus}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed top-[56px] inset-0 z-0 blur-xl w-screen h-[calc(100vh-56px)]" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="bg-secondary relative flex-1 flex flex-col w-screen">
              <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
                <nav className="flex-1 px-7">
                  {navItems.map((item, index) => {
                    return (
                      <Fragment key={"nav-mobile-" + index}>
                        <Link href={item.link} key={"nav-desktop-" + index}>
                          <p
                            className={clsx(
                              "group flex items-center px-3 pb-3 text-xl  hover:opacity-90 text-base rounded-md  relative text-primary font-[500]",
                              {
                                "opacity-50": item.link !== router.asPath,
                              },
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {item.name}
                          </p>
                        </Link>
                        <div className="divider mx-3 mt-4"></div>
                      </Fragment>
                    );
                  })}
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};
