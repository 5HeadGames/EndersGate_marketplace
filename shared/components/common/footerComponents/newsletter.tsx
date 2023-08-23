import * as React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputEmail } from "../form/input-email";
import { Button } from "../button";

export const Newsletter = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center xl:py-10 py-6 gap-4 px-10 border-t border-overlay-border bg-overlay-3",
      )}
    >
      <img src="/icons/5HGNewsletter.svg" className="w-40 mb-6" alt="" />
      <p className="text-primary-disabled lg:text-left text-center">
        Join our mailing list to stay in the loop with our newest feature
        releases, NFT drops & more!
      </p>
      <form
        className="flex items-center justify-center gap-4 w-full"
        onSubmit={handleSubmit((data) => console.log(data))}
      >
        <InputEmail
          register={register}
          name="email"
          reset={reset}
          error={errors.email}
          placeholder="Enter your Gmail address"
          classNameContainer="rounded-xl py-3 px-2"
          className="md:w-1/2 w-full font-[500] text-[20px] "
        />
        <Button
          type="submit"
          decoration="line-white"
          className="rounded-xl bg-overlay-2 text-white hover:text-overlay text-[20px] border border-overlay-border py-3 px-10 whitespace-nowrap"
        >
          Sign up
        </Button>
      </form>
    </div>
  );
};
