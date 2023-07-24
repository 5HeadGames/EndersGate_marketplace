import { PlusIcon, XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import useMagicLink from "@shared/hooks/useMagicLink";

import React, { useCallback, useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { findSum } from "@shared/components/common/specialFields/SpecialFields";

export const useCartComicsModal = () => {
  const [isShow, setIsShow] = useState(false);
  const cancelButtonRef = useRef<HTMLDivElement>(null);

  const hide = () => {
    setIsShow(false);
  };

  const show = () => {
    setIsShow(true);
  };

  const Modal = useCallback(({ isShow, children, noClose }) => {
    return (
      <Transition.Root show={isShow} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 overflow-y-auto"
          style={{
            zIndex: 15000,
          }}
          initialFocus={cancelButtonRef}
          open={isShow}
          onClose={noClose ? () => {} : hide}
        >
          <div className="flex items-center justify-center pb-20 pt-4 min-h-screen text-center sm:block sm:p-0 bg-[#000000bb]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-transparent-45 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom text-left rounded-20 shadow-md transform transition-all sm:align-middle w-max sm:max-w-6xl">
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }, []);

  return { Modal, isShow, hide, show };
};
