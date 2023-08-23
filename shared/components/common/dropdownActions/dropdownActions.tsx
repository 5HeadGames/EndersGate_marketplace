import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { Typography } from "../typography";
import { Icons } from "@shared/const/Icons";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

export const DropdownActions: React.FC<any> = ({
  title,
  actions,
  className,
}) => {
  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => {
          return (
            <>
              <div>
                <Menu.Button className="inline-flex justify-center w-full font-normal bg-transparent focus:outline-none">
                  <div
                    className={clsx(
                      className,
                      "flex justify-center items-center cursor-pointer rounded-md border border-overlay-border bg-overlay-2 p-3 text-red-primary hover:text-orange-500",
                    )}
                  >
                    <Typography
                      type="subTitle"
                      className="mr-2 text-lg whitespace-nowrap"
                    >
                      {title}
                    </Typography>
                    {open ? <CaretUpOutlined /> : <CaretDownOutlined />}
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
                <Menu.Items className="absolute top-0 right-3 z-20 md:mt-7 origin-top-right bg-overlay divide-y shadow-lg rounded-[6px] focus:outline-none">
                  <div className="py-2">
                    {actions.map((item: any, i: number) => {
                      // const active = router.asPath === subItem.href;
                      return (
                        <Menu.Item key={`item-${i}`}>
                          {() => (
                            <div
                              className={clsx(
                                "flex justify-start items-center py-[10px] px-3 text-primary hover:text-orange-500",
                                "whitespace-nowrap",
                              )}
                              onClick={() => {
                                item.onClick();
                              }}
                            >
                              <button className={clsx(item.className)}>
                                {item.label}
                              </button>
                            </div>
                          )}
                        </Menu.Item>
                      );
                    })}
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
