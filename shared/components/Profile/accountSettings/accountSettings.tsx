import { Button } from "@shared/components/common/button";
import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import "shared/firebase";
import { useAppSelector } from "redux/store";
import { useModal } from "@shared/hooks/modal";
import { XIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import { Input } from "@shared/components/common/form/input";
import { InputEmail } from "@shared/components/common/form/input-email";
import { Textarea } from "@shared/components/common/form/texareaV2";
import { InputPassword } from "@shared/components/common/form/input-password";

const AccountSettingsComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const user = useAppSelector((state) => state.user);
  return (
    <div className="flex flex-col w-full xl:px-24 md:px-6">
      <form
        className={clsx(
          "xl:p-16 md:p-4 sm:p-16 p-4 flex flex-col w-full justify-center items-center",
          "border border-overlay-border rounded-md mb-2 "
        )}
      >
        <div className="flex md:flex-row flex-col items-center w-full md:gap-6">
          <div className="flex md:flex-col sm:flex-row flex-col items-center mb-4">
            <div className="xl:h-40 xl:w-40 md:h-32 md:w-32 h-40 w-40 rounded-full relative">
              <img
                src={
                  user.profile_picture !== ""
                    ? user.profile_picture
                    : Icons.logo
                }
                alt=""
              />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile_picture"
            />
            <label
              htmlFor="profile_picture"
              className={clsx(
                "bg-overlay border border-primary cursor-pointer whitespace-nowrap",
                "text-primary px-4 py-2 text-md rounded-md  md:ml-0 md:mt-4 sm:mt-0 sm:ml-4 mt-4"
              )}
            >
              Change Picture
            </label>
          </div>
          <div className="flex flex-col w-full ">
            <Input
              register={register}
              error={errors.nickname}
              isFill={!!watch("nickname")}
              name="nickname"
              title="Name"
              labelVisible
              className="text-primary mt-2"
              defaultValue={user.name}
            />

            <InputEmail
              register={register}
              error={errors.email}
              isFill={!!watch("email")}
              name="email"
              title="Email"
              labelVisible
              className="text-primary mt-2"
              defaultValue={user.email}
            />
            <InputPassword
              register={register}
              error={errors.password}
              isFill={!!watch("password")}
              name="password"
              title="Password"
              labelVisible
              className="text-primary mt-2"
            />
          </div>
        </div>
        <div className="w-full">
          <Input
            register={register}
            error={errors.status}
            isFill={!!watch("status")}
            name="status"
            title="Status"
            labelVisible
            className="text-primary mt-2"
            defaultValue={user.userStatus}
          />
        </div>
        <Button
          type="submit"
          size="small"
          className="mt-6"
          decoration="fillPrimary"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AccountSettingsComponent;
