import React from "react";
import { Image } from "@chakra-ui/react";
import { XIcon } from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import { InputModal } from "@shared/components/common/form/inputModal";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useModal } from "@shared/hooks/modal";

export const useModalAddressUser = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { Modal, isShow, hide, show } = useModal();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm();

  const auth = getAuth();

  const db = getDatabase();

  React.useEffect(() => {
    show();
  }, []);

  const handleSubmitModal = (data: any) => {
    setIsLoading(true);
    console.log(data);
    try {
      onSubmit();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const ModalAddress = (
    <Modal isShow={isShow} NoClose withoutX>
      <div
        style={{ width: "90vw", maxWidth: "500px" }}
        className="relative bg-overlay flex flex-col items-center gap-4 jusify-center shadow-2xl rounded-2xl mt-16"
      >
        <Image
          src="/images/comicsbg.png"
          className="w-full opacity-25 absolute top-0"
          alt=""
        />
        <Image
          src="/images/comics.svg"
          className="w-[275px] absolute top-[-100px]"
          width={"275px"}
          top={"-100px"}
          alt=""
        />
        <div className="absolute h-full w-full rounded-2xl bg-gradient-to-b from-transparent to-overlay px-2 from-0% to-30% "></div>
        <div className="absolute top-2 right-2 flex justify-end w-full py-2">
          <XIcon
            className="text-white w-5 cursor-pointer p-[2px] rounded-full bg-overlay border border-white"
            onClick={() => {
              hide();
            }}
          />
        </div>

        <div className="h-32 w-full"></div>

        <form
          className="flex flex-col items-center justify-center relative rounded-full px-4 pb-8 gap-2"
          onSubmit={handleSubmit(handleSubmitModal)}
        >
          <h2 className="text-white text-center font-bold text-2xl text-red-alert">
            Waitlist for <br /> issues #1 & #2 of Humans VS Ogres
          </h2>{" "}
          <p className="text-center text-white text-sm py-4">
            To ensure a fair distribution process, we have created this Form for
            you to request access to the whitelist. Please fill out the form
            below with accurate information:
          </p>
          <p className="text-green-button font-bold text-lg">SIGN UP BELOW!</p>
          <div className="flex flex-col items-center justify-center gap-5 w-full">
            <InputModal
              type="text"
              title="Full name (First and Last name)"
              placeholder="John Doe"
              name="name"
              register={register}
              labelVisible
            ></InputModal>
            <InputModal
              type="email"
              title="Email"
              placeholder="Your email address"
              name="email"
              register={register}
              labelVisible
            ></InputModal>
            <InputModal
              type="address"
              title="Address"
              placeholder="Your Address"
              name="address"
              register={register}
              labelVisible
            ></InputModal>
            <InputModal
              type="text"
              title="Delivery Instructions (optional)"
              placeholder="Short text"
              name="message"
              register={register}
              labelVisible
            ></InputModal>
          </div>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full px-6 py-2 mt-6 flex justify-center items-center rounded-full hover:border-green-button hover:bg-overlay hover:text-green-button border border-transparent-color-gray-200 cursor-pointer bg-green-button font-bold text-overlay transition-all duration-500"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );

  return { ModalAddress, show, hide };
};
