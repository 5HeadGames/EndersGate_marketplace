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

  const sendNewsletterSign = async (data: any) => {
    try {
      const db = getDatabase();
      const dbRef = ref(db);
      console.log(
        db,
        "db",
        (await get(child(dbRef, `newsletter`))).exists(),
        "exists",
        (await get(child(dbRef, `newsletter`))).val(),
      );
      const emails: any = (await get(child(dbRef, `newsletter`))).exists()
        ? (await get(child(dbRef, `newsletter`))).val()
        : [];
      console.log(emails, data.email, "emails");
      if (!emails.map((email) => email.email).includes(data.email)) {
        if (emails?.length > 0) {
          const newArray = Object.keys(emails).map((item) => {
            return emails[item];
          });
          newArray.push(data);
          set(ref(db, "newsletter"), newArray);
        } else {
          emails.push(data);
          console.log(emails, "newsletter");
          set(ref(db, "newsletter"), [data]);
        }
        toast.success("You've been added to our newsletter succesfully!");
      } else {
        toast.error("You've email was already added to our newsletter!");
      }
    } catch (err) {
      console.log("error:", err);
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
          type={"email"}
          reset={reset}
          error={errors.email}
          placeholder="Enter your Gmail address"
          classNameContainer="rounded-xl py-3 px-4"
          className="md:w-1/2 w-full font-[500] text-[16px] "
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
