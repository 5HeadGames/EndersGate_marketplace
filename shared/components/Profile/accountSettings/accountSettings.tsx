import { Button } from "@shared/components/common/button";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@shared/components/common/form/input";
import { InputEmail } from "@shared/components/common/form/input-email";
import { InputPassword } from "@shared/components/common/form/input-password";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { LoadingOutlined } from "@ant-design/icons";

const AccountSettingsComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [loadingForm, setLoading] = React.useState(false);
  const [successPassword, setSuccessPassword] = React.useState(false);
  const { account: user } = useWeb3React();

  const handleChangePicture = async (e: React.ChangeEvent<any>) => {};

  const handleSetField =
    (field: "name" | "userStatus") => async (e: React.ChangeEvent<any>) => {
      try {
      } catch (error) {
        console.log({ error });
      }
    };

  const onSubmit = async ({
    newEmail,
    newPassword,
  }: {
    newEmail: string;
    newPassword: string;
  }) => {};

  const sendPasswordReset = async () => {};

  return (
    <div className="flex w-full items-center justify-center relative">
      {user && (
        <div className="flex flex-col max-w-[1300px] items-center justify-center w-full xl:px-24 md:px-6 relative">
          <form
            className={clsx(
              "xl:p-16 md:p-4 sm:p-16 p-4 flex flex-col w-full justify-center items-center",
              "border border-overlay-border rounded-xl mb-16  bg-overlay",
            )}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex md:flex-row flex-col items-start w-full md:gap-6">
              <div className="flex md:flex-col sm:flex-row flex-col mb-4 items-center">
                <div className="xl:h-40 xl:w-40 md:h-32 md:w-32 h-40 w-40 rounded-full relative">
                  <img
                    src={Icons.logo}
                    className="rounded-full border border-overlay-border"
                    alt=""
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile_picture"
                  // value={image as any}
                  onChange={handleChangePicture}
                />
                <label
                  htmlFor="profile_picture"
                  className={clsx(
                    "bg-overlay border border-primary cursor-pointer whitespace-nowrap",
                    "text-primary px-4 py-2 text-md rounded-md  md:ml-0 md:mt-4 sm:mt-0 sm:ml-4 mt-4 hover:bg-primary hover:text-overlay transition-all duration-500 font-[450] text-white",
                  )}
                >
                  Change Picture
                </label>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex flex-col w-full ">
                  <Input
                    register={register}
                    error={errors.name}
                    isFill={!!watch("name")}
                    reset={reset}
                    name="name"
                    title="User Name"
                    labelVisible
                    className="text-primary mt-2"
                    classNameContainer="rounded-xl px-2"
                    // defaultValue={user}
                    onBlur={handleSetField("name")}
                  />

                  <Input
                    register={register}
                    error={errors.userStatus}
                    isFill={!!watch("userStatus")}
                    reset={reset}
                    name="userStatus"
                    title="Status"
                    classNameContainer="rounded-xl px-2"
                    labelVisible
                    className="text-primary mt-2"
                    onBlur={handleSetField("userStatus")}
                  />
                </div>
                <div className={clsx("w-full flex flex-col items-center")}>
                  {!user ? (
                    <>
                      <InputEmail
                        register={register}
                        error={errors.newEmail}
                        isFill={!!watch("newEmail")}
                        reset={reset}
                        classNameContainer="rounded-xl"
                        name="newEmail"
                        title={user ? "New email" : "Email"}
                        labelVisible
                        className="text-primary mt-2"
                      />
                      <InputPassword
                        register={register}
                        error={errors.newPassword}
                        isFill={!!watch("newPassword")}
                        reset={reset}
                        classNameContainer="rounded-xl"
                        name="newPassword"
                        title={user ? "New password" : "Password"}
                        labelVisible
                        className="text-primary mt-2"
                      />
                    </>
                  ) : (
                    <Button
                      size="small"
                      className="mt-6 rounded-md text-white hover:text-overlay"
                      decoration="line-white"
                      onClick={sendPasswordReset}
                    >
                      {successPassword
                        ? "We sent a link to your email"
                        : "Reset password"}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    size="small"
                    className="mt-6 w-20 text-overlay !bg-green-button hover:text-green-button hover:!bg-overlay !border-green-button rounded-xl"
                    decoration="fill"
                    disabled={loadingForm}
                  >
                    {loadingForm ? <LoadingOutlined /> : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsComponent;
