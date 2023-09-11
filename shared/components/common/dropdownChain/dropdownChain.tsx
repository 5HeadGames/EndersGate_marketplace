import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import clsx from "clsx";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Image, Text, Tooltip } from "@chakra-ui/react";
import { useBlockchain } from "@shared/context/useBlockchain";

export const DropdownChain: React.FC<any> = () => {
  const { blockchain, updateBlockchain } = useBlockchain();

  const handleSelect = (value) => {
    updateBlockchain(value);
  };

  const blockchains = [
    {
      name: "ETHEREUM",
      value: "eth",
      image: "/images/eth.png",
    },
    {
      name: "MATIC",
      value: "matic",
      image: "/images/matic.png",
    },
    {
      name: "FINDORA GSC",
      value: "findora",
      image: "/images/findora.png",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => {
          return (
            <>
              <div className="flex justify-center items-center">
                <Menu.Button className="inline-flex justify-center items-center w-full font-medium bg-transparent focus:outline-none">
                  <Tooltip label="Select Blockchain">
                    <div
                      className={clsx(
                        "flex justify-center items-center cursor-pointer rounded-xl gap-1",
                        "text-white ",
                      )}
                    >
                      <Image
                        src={`/images/${blockchain}.png`}
                        className="w-6"
                      ></Image>

                      {open ? (
                        <CaretUpOutlined className="opacity-50 hover:opacity-100" />
                      ) : (
                        <CaretDownOutlined className="opacity-50 hover:opacity-100" />
                      )}
                    </div>
                  </Tooltip>
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
                <Menu.Items className="absolute top-0 right-3 z-20 md:mt-7 origin-top-right bg-overlay divide-y shadow-lg rounded-xl focus:outline-none">
                  <div>
                    <div className="flex flex-col items-center justify-center border border-overlay-border rounded-xl overflow-hidden">
                      {blockchains.map(({ name, value, image }) => {
                        return (
                          <div
                            className="flex !shrink-0 items-center gap-2 p-2 w-48 hover:bg-overlay-2 !px-6 cursor-pointer"
                            onClick={() => handleSelect(value)}
                          >
                            <Image
                              boxSize="1.5rem"
                              borderRadius="full"
                              src={image}
                              alt="logo1"
                            />
                            <Text className="text-white whitespace-nowrap shrink-0">
                              {name}
                            </Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          );
        }}
      </Menu>
    </div>
  );
};
