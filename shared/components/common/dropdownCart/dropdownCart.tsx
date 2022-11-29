import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { XCircleIcon, XIcon } from "@heroicons/react/solid";

export const DropdownCart: React.FC<any> = ({
  // title = '',
  // isLoading = false,
  children,
  setSideBar,
  sidebarOpen = false,
  initialFocus = null,
}) => {
  const [set, setSet] = React.useState(false);

  return (
    <>
      {/* Sidebar mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed w-screen h-[calc(100vh-56px)] top-[56px] right-0 md:flex z-40 hidden bg-overlay-opacity"
          open={sidebarOpen}
          onClose={() => setSideBar(false)}
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
            <Dialog.Overlay className="fixed top-[56px] inset-0 z-0 right-0  blur-xl w-screen h-[calc(100vh-56px)] bg-overlay-opacity" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative flex-1 flex items-end flex-col w-min  bg-overlay-opacity overflow-auto">
              <div className="flex flex-col bg-overlay min-h-[calc(100vh-56px)] h-max shrink-0 p-10 pb-24">
                <div className="flex justify-end py-2 text-white w-full">
                  <XIcon
                    color="white"
                    className="cursor-pointer"
                    width={20}
                    onClick={() => setSideBar(false)}
                  ></XIcon>
                </div>
                <div className="flex flex-col items-center justify-center w-min px-4">
                  {children}
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};
