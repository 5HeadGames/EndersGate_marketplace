import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import ChainSelect from "../chainSelect";
import { useSelector } from "react-redux";

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

  const { ethAddress: user } = useSelector((state: any) => state.layout.user);

  const [set, setSet] = React.useState(false);

  return (
    <>
      {/* Sidebar mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed h-[calc(100vh-56px)] top-[56px] w-screen flex z-40 md:hidden bg-overlay"
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
                              "group flex items-center px-3 pb-3 text-xl hover:opacity-90 rounded-md  relative text-primary font-[500]",
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
                      {profileItems.map((item, index) => {
                        return (
                          <>
                            {item.onClick ? (
                              <div
                                className={clsx(
                                  "group flex items-center px-3 pb-3 text-xl hover:opacity-90 rounded-md  relative text-primary font-[500]",
                                )}
                                onClick={() => {
                                  item.onClick();
                                  setSidebarOpen(false);
                                }}
                              >
                                <h3 className={clsx("text-xl")}>{item.name}</h3>
                              </div>
                            ) : (
                              <Fragment key={"nav-mobile-" + index}>
                                <Link
                                  href={item.link}
                                  key={"nav-desktop-" + index}
                                >
                                  <p
                                    className={clsx(
                                      "group flex items-center px-3 pb-3 text-xl hover:opacity-90 rounded-md  relative text-primary font-[500]",
                                      {
                                        "opacity-50":
                                          item.link !== router.asPath,
                                      },
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    {item.name}
                                  </p>
                                </Link>
                                <div className="divider mx-3 mt-4"></div>
                              </Fragment>
                            )}
                          </>
                        );
                      })}
                    </>
                  ) : (
                    <Fragment key={"nav-mobile"}>
                      <Link
                        href={
                          router.pathname !== "/login"
                            ? `/login?redirect=true&redirectAddress=${router.pathname}`
                            : router.asPath
                        }
                        key={"nav-desktop-"}
                      >
                        <p
                          className={clsx(
                            "group flex items-center px-3 pb-3 text-xl hover:opacity-90 rounded-md  relative text-primary font-[500]",
                            {
                              "opacity-50": user
                                ? "/profile"
                                : "/login" !== router.asPath,
                            },
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {"LOG IN"}
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
