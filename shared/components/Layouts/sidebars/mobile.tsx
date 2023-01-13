import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { XIcon } from "@heroicons/react/outline";
import Link from "next/link";
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
  ShoppingCartOutlined,
  TwitterOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useWeb3React } from "@web3-react/core";
import { NavbarItem } from "..";
import { Dropdown } from "../../common/dropdown/dropdown";

interface LayoutDashboardProps {
  title?: string;
  isLoading?: boolean;
  sidebarOpen?: boolean;
  setSidebarOpen?: any;
  initialFocus?: any;
  navItems?: any;
  cart: any;
  setCartOpen: any;
  cartOpen: any;
  providerName: string;
  profileItems: any;
}
export const SidebarMobile: React.FC<LayoutDashboardProps> = ({
  // title = '',
  // isLoading = false,
  // children,
  setCartOpen,
  cart,
  navItems,
  sidebarOpen = false,
  cartOpen,
  setSidebarOpen = {},
  initialFocus = null,
  providerName,
  profileItems,
}) => {
  const router = useRouter();
  // const { user } = useMoralis();

  const { account: user } = useWeb3React();

  const address = user || "";
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
                  {user ? (
                    <>
                      {/* <div
                        className={clsx(
                          "flex items-center px-3 pb-3 text-xl hover:opacity-90 text-base rounded-md  relative text-primary font-[500]",
                        )}
                        onClick={() => {
                          setSidebarOpen(false);
                          setCartOpen(true);
                        }}
                      >
                        {cart.length > 0 && (
                          <div className="absolute top-[-4px] right-[-8px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-[9px] bg-red-primary">
                            {cart.length}
                          </div>
                        )}
                        <span className="opacity-50">MY CART</span>
                      </div> */}

                      <Dropdown
                        classTitle={
                          "text-white opacity-50 hover:opacity-100 font-bold pl-3"
                        }
                        title={"MY ACCOUNT"}
                      >
                        <div className="flex flex-col items-center px-4 border border-overlay-border rounded-xl">
                          {profileItems.map((item, index) => {
                            console.log(
                              providerName,
                              item.name === "LOG OUT" &&
                                providerName === "magic",
                            );
                            return (
                              <>
                                {item.onClick ? (
                                  <div
                                    className={clsx(
                                      "gap-2 py-2 flex items-center text-white opacity-50 hover:opacity-100 cursor-pointer",
                                    )}
                                    onClick={item.onClick}
                                  >
                                    <h3 className={clsx("text-md font-bold")}>
                                      {item.name}
                                    </h3>
                                  </div>
                                ) : (
                                  <NavbarItem
                                    key={index}
                                    name={item.name}
                                    link={item.link}
                                    route={router.asPath}
                                  />
                                )}
                              </>
                            );
                          })}
                        </div>
                      </Dropdown>
                    </>
                  ) : (
                    <Fragment key={"nav-mobile"}>
                      <Link
                        href={user ? "/profile" : "/login"}
                        key={"nav-desktop-"}
                      >
                        <p
                          className={clsx(
                            "group flex items-center px-3 pb-3 text-xl  hover:opacity-90 text-base rounded-md  relative text-primary font-[500]",
                            {
                              "opacity-50": user
                                ? "/profile"
                                : "/login" !== router.asPath,
                            },
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {user ? "MY ACCOUNT" : "LOG IN"}
                        </p>
                      </Link>
                    </Fragment>
                  )}
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};
