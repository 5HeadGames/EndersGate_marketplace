import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { XIcon } from "@heroicons/react/outline";
import Link from "next/link";
// import Image from 'next/image';
import { useRouter } from "next/router";
import { Icons } from "@shared/const/Icons";
import { Typography } from "@shared/components/common/typography";
import { Button } from "@shared/components/common/button/button";

interface LayoutDashboardProps {
  title?: string;
  isLoading?: boolean;
  sidebarOpen?: boolean;
  setSidebarOpen?: any;
  initialFocus?: any;
}
export const SidebarMobile: React.FC<LayoutDashboardProps> = ({
  // title = '',
  // isLoading = false,
  // children,
  sidebarOpen = false,
  setSidebarOpen = {},
  initialFocus = null,
}) => {
  const router = useRouter();

  const navItems = [
    {
      name: "Menu",
      link: "/menu",
      menu: true,
      icon: Icons.menu,
      items: [
        {
          title: "Marketplace",
          description:
            "Sell your game items to anyone, anywhere, they're finally yours",
          href: "/marketplace",
          icon: Icons.marketplace,
        },
        {
          title: "Marketplace",
          description:
            "Sell your game items to anyone, anywhere, they're finally yours",
          href: "/marketplace",
          icon: Icons.marketplace,
        },
        {
          title: "Marketplace",
          description:
            "Sell your game items to anyone, anywhere, they're finally yours",
          href: "/marketplace",
          icon: Icons.marketplace,
        },
        {
          title: "Marketplace",
          description:
            "Sell your game items to anyone, anywhere, they're finally yours",
          href: "/marketplace",
          icon: Icons.marketplace,
        },
        {
          title: "Marketplace",
          description:
            "Sell your game items to anyone, anywhere, they're finally yours",
          href: "/marketplace",
          icon: Icons.marketplace,
        },
        {
          title: "Marketplace",
          description:
            "Sell your game items to anyone, anywhere, they're finally yours",
          href: "/marketplace",
          icon: Icons.marketplace,
        },
      ],
    },
    { name: "Dashboard", link: "/dashboard", icon: Icons.dashboard },
    { name: "Marketplace", link: "/marketplace", icon: Icons.marketplace },
  ];

  const [collapse, setCollapse] = React.useState(
    new Array(navItems.length).fill(false)
  );

  return (
    <>
      {/* Sidebar mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed h-screen top-0 flex z-40 md:hidden bg-overlay"
          open={sidebarOpen}
          onClose={setSidebarOpen}
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
            <Dialog.Overlay className="fixed inset-0 z-0 blur-xl bg-transparent-color-gray-200" />
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
            <div className="bg-overlay relative flex-1 flex flex-col max-w-xs w-full w-64">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon
                      className="w-full p-1 text-white bg-secondary rounded-full"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link href="/">
                    <a
                      className={clsx(
                        "cursor-pointer flex items-center justify-center"
                      )}
                    >
                      <img className="w-40" src={Icons.logo} alt="" />
                    </a>
                  </Link>
                </div>
                <nav className="mt-5 flex-1 px-7">
                  {navItems.map((item, index) => {
                    return item.menu ? (
                      <Fragment key={"nav-modile-" + index}>
                        <div
                          className={clsx(
                            {
                              "opacity-50": item.link !== router.asPath,
                            },
                            "flex justify-between items-center"
                          )}
                          onClick={() =>
                            setCollapse((prev) => {
                              let newCollapse = [];
                              prev.forEach((previus, id) => {
                                if (index !== id) {
                                  newCollapse.push(previus);
                                } else {
                                  newCollapse.push(!previus);
                                }
                              });
                              return newCollapse;
                            })
                          }
                        >
                          <p
                            className={clsx(
                              "group flex items-center px-3 py-4 hover:opacity-90 text-base rounded-md  relative text-primary"
                            )}
                          >
                            <img
                              src={item.icon}
                              className="mr-4 flex-shrink-0 h-6 w-6 text-white"
                              aria-hidden="true"
                              alt=""
                            />
                            {item.name}
                          </p>
                          <img
                            src={
                              !collapse[index]
                                ? Icons.chevronRight
                                : Icons.chevronDown
                            }
                            className="mr-4 flex-shrink-0 h-6 w-6 text-white"
                            aria-hidden="true"
                            alt=""
                          />
                        </div>
                        <div className={clsx({ ["hidden"]: !collapse[index] })}>
                          {item?.items?.map((subItem) => {
                            return (
                              <Link key={subItem.title} href={subItem.href}>
                                <a
                                  className={clsx(
                                    "flex items-center px-3 py-4  text-base rounded-md  relative text-primary",
                                    {
                                      "opacity-50":
                                        subItem.href !== router.asPath,
                                    }
                                  )}
                                  href="#"
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <img
                                    src={subItem.icon}
                                    className="mr-4 flex-shrink-0 h-6 w-6 text-white"
                                    aria-hidden="true"
                                    alt=""
                                  />
                                  {subItem.title}
                                </a>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="divider mx-3 mt-4"></div>
                      </Fragment>
                    ) : (
                      <Fragment key={"nav-mobile-" + index}>
                        <Link href={item.link} key={"nav-desktop-" + index}>
                          <p
                            className={clsx(
                              "group flex items-center px-3 py-4  hover:opacity-90 text-base rounded-md  relative text-primary",
                              {
                                "opacity-50": item.link !== router.asPath,
                              }
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <img
                              src={item.icon}
                              className="mr-4 flex-shrink-0 h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                            {item.name}
                          </p>
                        </Link>
                        <div className="divider mx-3 mt-4"></div>
                      </Fragment>
                    );
                  })}
                  <div>
                    <Button
                      decoration="fill"
                      size="small"
                      onClick={() => {
                        setSidebarOpen(false);
                        router.push("/login");
                      }}
                    >
                      Log In
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};
