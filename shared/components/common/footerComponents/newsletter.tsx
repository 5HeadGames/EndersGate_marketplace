"use client";
"use client";
import * as React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputEmail } from "../form/input-email";
import { Button } from "../button";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { toast } from "react-hot-toast";

export const Newsletter = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const sendNewsletterSign = async (data) => {
    try {
      const db = getDatabase();
      const dbRef = ref(db);
      const txs = (await get(child(dbRef, `newsletter`))).exists()
        ? (await get(child(dbRef, `newsletter`))).val()
        : [];
      if (txs.length > 0) {
        const newArray = Object.keys(txs).map((item) => {
          return txs[item];
        });
        newArray.push(data);
        set(ref(db, "newsletter"), newArray);
      } else {
        txs.push(data);
        console.log(txs, "newsletter");
        set(ref(db, "newsletter"), txs);
      }
      toast.success("You've been added to our newsletter succesfully!");
    } catch (err) {
      toast.error("There was an error in your request. Please try again later");
    }
  };

  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center xl:py-10 py-6 gap-4 xl:px-10 px-4 border-t border-overlay-border bg-overlay-3",
      )}
    >
      <img src="/icons/5HGNewsletter.svg" className="w-40 mb-6" alt="" />
      <p className="text-primary-disabled lg:text-left text-center">
        Join our mailing list to stay in the loop with our newest feature
        releases, NFT drops & more!
      </p>
      <form
        className="flex sm:flex-row flex-col items-center justify-center gap-4 w-full"
        onSubmit={handleSubmit(sendNewsletterSign)}
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
          className="rounded-xl bg-overlay-2 text-white hover:!text-overlay text-[20px] border border-overlay-border py-3 px-10 whitespace-nowrap"
        >
          Sign up
        </Button>
      </form>
    </div>
  );
};
