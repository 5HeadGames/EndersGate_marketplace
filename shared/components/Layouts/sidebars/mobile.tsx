import React, {Fragment, useRef} from "react";
import {Dialog, Transition} from "@headlessui/react";
import clsx from "clsx";
import {XIcon} from "@heroicons/react/outline";
import Link from "next/link";
import {useMoralis} from "react-moralis";

import {useRouter} from "next/router";
import {Icons} from "@shared/const/Icons";
import {Button} from "@shared/components/common/button/button";
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
  const { user } = useMoralis();
  const address = user?.get("ethAddress") || "";

  const navItems = [
    {
      name: "Menu",
      link: "/menu",
      menu: true,
      icon: <AppstoreFilled />,
      items: [
        {
          title: "Enders Gate Website",
          description:
            "Sell your game items to anyone, anywhere, they're finally yours",
          externalLink: "https://www.endersgate.one/",
          icon: <ShopOutlined />,
        },
        {
          title: "Enders Gate Discord",
          description: "Join to our Discord Server!",
          href: "https://discord.com/invite/nHNkWdE99h",
          icon: <ShopOutlined />,
        },
        {
          title: "Enders Gate Twitter",
          description: "Follow us in Twitter!",
          externalLink: "https://twitter.com/EndersGate",
          icon: <TwitterOutlined />,
        },
        {
          title: "Harmony Block Explorer",
          description: "Explore all the transactions in the harmony blockchain",
          externalLink: "https://explorer.harmony.one/",
          icon: <WalletOutlined />,
        },
        {
          title: "Harmony Bridge",
          description:
            "Trusted chrome wallet extension, store your digital currency and NFTs",
          externalLink: "https://bridge.harmony.one/busd",
          icon: <WalletOutlined />,
        },
      ],
    },
    { name: "Dashboard", link: "/dashboard", icon: <AreaChartOutlined /> },
    { name: "Marketplace", link: "/marketplace", icon: <ShopOutlined /> },
    {
      link: "/profile/inventory",
      name: "Inventory",
      icon: <GoldenFilled />,
    },
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
                            <div className="mr-4 flex-shrink-0 flex items-start text-primary text-xl">
                              {item.icon}
                            </div>
                            {item.name}
                          </p>

                          <div className="flex-shrink-0 text-primary flex items-center text-xl">
                            {!collapse[index] ? (
                              <RightOutlined />
                            ) : (
                              <DownOutlined />
                            )}
                          </div>
                        </div>
                        <div className={clsx({ ["hidden"]: !collapse[index] })}>
                          {item?.items?.map((subItem) => {
                            return (
                              // <Link key={subItem.title} href={subItem.href}>
                              <a
                                className={clsx(
                                  "flex items-center px-3 py-4  text-base my-1 relative text-primary",
                                  {
                                    "opacity-50":
                                      subItem.href !== router.asPath,
                                  }
                                )}
                                href={subItem.href}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <div className="mr-4 flex-shrink-0 flex items-start text-primary text-2xl">
                                  {subItem.icon}
                                </div>

                                {subItem.title}
                              </a>
                              // </Link>
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
                            <div className="mr-4 flex-shrink-0 flex items-start text-primary text-2xl">
                              {item.icon}
                            </div>
                            {item.name}
                          </p>
                        </Link>
                        <div className="divider mx-3 mt-4"></div>
                      </Fragment>
                    );
                  })}
                  {address !== "" ? (
                    <ProfileDataAndActions
                    // name={"AN-Drew207"}
                    // email="andrescontrerasoviedo740@gmail.com"
                    // photo=""
                    />
                  ) : (
                    <div className="mb-4">
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
