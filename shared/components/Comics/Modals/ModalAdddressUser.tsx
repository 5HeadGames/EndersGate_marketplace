import React from "react";
import { Image } from "@chakra-ui/react";
import { XIcon } from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import { InputModal } from "@shared/components/common/form/inputModal";
import { useModal } from "@shared/hooks/modal";
import GooglePlaceAPI from "@shared/components/common/google-place-api";

export const useModalAddressUser = ({ onSubmit, noClose, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { Modal, isShow, hide, show } = useModal();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    setError,
    clearErrors,
  } = useForm();

  console.log(errors, "errors");

  const handleSubmitModal = (data: any) => {
    setIsLoading(true);
    try {
      onSubmit(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const ModalAddress = (
    <Modal isShow={isShow} noClose={noClose} withoutX>
      <div
        style={{ width: "90vw", maxWidth: "500px" }}
        className="relative bg-overlay flex flex-col items-center gap-4 jusify-center shadow-2xl rounded-2xl mt-36"
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
              onClose();
            }}
          />
        </div>

        <div className="h-32 w-full"></div>

        <form
          className="flex flex-col items-center justify-center relative rounded-full px-4 pb-8 gap-2"
          onSubmit={handleSubmit(handleSubmitModal)}
        >
          <h2 className="text-white text-center font-bold text-3xl text-red-alert">
            Enter your shipping address
          </h2>{" "}
          <p className="text-center text-white text-md py-4">
            Where do you want us to ship your physical comics to?
          </p>
          <div className="flex flex-col items-center justify-center gap-5 w-full">
            <InputModal
              type="text"
              title="Full name (First and Last name)"
              placeholder="John Doe"
              name="name"
              register={register}
              labelVisible
              error={errors.name}
              rules={{
                required: {
                  value: true,
                  message: "You have to put your name",
                },
              }}
            ></InputModal>
            <InputModal
              type="email"
              title="Email"
              placeholder="Your email address"
              name="email"
              register={register}
              labelVisible
              error={errors.email}
              rules={{
                required: {
                  value: true,
                  message: "You have to put your email address",
                },
              }}
            ></InputModal>
            <GooglePlaceAPI
              errors={errors.address}
              tokenGoogleAPI={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
              {...{
                register,
                rules: {
                  required: { value: true, message: "This field is required" },
                },
                setValue,
                className: "",
                setError,
                clearErrors,
              }}
            ></GooglePlaceAPI>

            <InputModal
              type="text"
              title="Delivery Instructions (optional)"
              placeholder="Short text"
              name="message"
              register={register}
              labelVisible
              error={errors.message}
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
