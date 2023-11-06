import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import clsx from "clsx";
import { Typography } from "../typography";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

export const DropdownShop: React.FC<any> = ({
  classTitle,
  title,
  children,
  notification,
}) => {
  return (
    <div className="flex">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => {
          return (
            <>
              <div className="flex">
                <Menu.Button className="inline-flex justify-center w-full font-medium bg-transparent focus:outline-none">
                  <div className="relative sm:w-64 w-40">
                    <div className="absolute flex shrink-0 items-center justify-between w-full h-full px-4">
                      <h2 className="relative  sm:text-xl text-lg text-white">
                        NFT PACKS
                      </h2>
                      {open ? (
                        <CaretUpOutlined className="text-white" />
                      ) : (
                        <CaretDownOutlined className="text-white" />
                      )}
                    </div>
                    <img
                      src="./images/bgGold.png"
                      className="cursor-pointer"
                      alt=""
                    />
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
                <Menu.Items className="absolute top-6 right-3 z-20 md:mt-7 origin-top-right bg-overlay divide-y shadow-lg rounded-[6px] focus:outline-none">
                  <div>{children}</div>
                </Menu.Items>
              </Transition>
            </>
          );
        }}
      </Menu>
    </div>
  );
};
