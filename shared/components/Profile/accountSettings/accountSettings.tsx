import {Button} from "@shared/components/common/button";
import {Icons} from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import {useMoralis, useMoralisFile, useMoralisCloudFunction} from "react-moralis";
import {useAppDispatch} from "redux/store";
import {useForm} from "react-hook-form";
import {Input} from "@shared/components/common/form/input";
import {InputEmail} from "@shared/components/common/form/input-email";
import {InputPassword} from "@shared/components/common/form/input-password";

const AccountSettingsComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const [image, setImage] = React.useState<File | null>(null);
  const [loadingForm, setLoading] = React.useState(false);
  const [successPassword, setSuccessPassword] = React.useState(false);
  const {user, setUserData, signup, Moralis} = useMoralis();
  const {saveFile} = useMoralisFile();
  const dispatch = useAppDispatch();

  const handleChangePicture = async (e: React.ChangeEvent<any>) => {
    try {
      const file = e.target.files[0];
      const moralisFile = await saveFile(file.name, file, {
        type: "image/png",
      });
      await setUserData({profileImage: moralisFile});
      setImage(file);
    } catch (error) {
      console.log({error});
    }
  };

  const handleSetField = (field: "name" | "userStatus") => async (e: React.ChangeEvent<any>) => {
    try {
      const value = e.target.value;
      await setUserData({[field]: value});
    } catch (error) {
      console.log({error});
    }
  };

  const onSubmit = async ({newEmail, newPassword}: {newEmail: string; newPassword: string}) => {
    try {
      if (!user.get("email")) {
        console.log("new email");
        const res = await signup(newEmail, newPassword, newEmail);
        await Moralis.Cloud.run("sendVerificationEmail", {
          email: newEmail,
          name: newEmail,
        });
        console.log({res});
      }
    } catch (err) {
      console.log({err});
    }
  };

  const sendPasswordReset = async () => {
    console.log("sent");
    const email = user?.get("email");
    await Moralis.User.requestPasswordReset(email);
    await Moralis.Cloud.run("sendResetPasswordEmail", {
      email,
      name: email,
    });
    setSuccessPassword(true);
  };

  return (
    <>
      {user && (
        <div className="flex flex-col w-full xl:px-24 md:px-6">
          <form
            className={clsx(
              "xl:p-16 md:p-4 sm:p-16 p-4 flex flex-col w-full justify-center items-center",
              "border border-overlay-border rounded-md mb-2 "
            )}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex md:flex-row flex-col items-start w-full md:gap-6">
              <div className="flex md:flex-col sm:flex-row flex-col mb-4 items-center">
                <div className="xl:h-40 xl:w-40 md:h-32 md:w-32 h-40 w-40 rounded-full relative">
                  <img
                    src={
                      user.get("profileImage")
                        ? user.get("profileImage").url()
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
                  value={image as any}
                  onChange={handleChangePicture}
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
                  error={errors.name}
                  isFill={!!watch("name")}
                  name="name"
                  title="User Name"
                  labelVisible
                  className="text-primary mt-2"
                  defaultValue={user?.get("name")}
                  onBlur={handleSetField("name")}
                />

                <Input
                  register={register}
                  error={errors.userStatus}
                  isFill={!!watch("userStatus")}
                  name="userStatus"
                  title="Status"
                  labelVisible
                  className="text-primary mt-2"
                  defaultValue={user?.get("userStatus")}
                  onBlur={handleSetField("userStatus")}
                />
              </div>
            </div>
            <div className={clsx("w-full flex flex-col items-center")}>
              {!user.get("email") ? (
                <>
                  <InputEmail
                    register={register}
                    error={errors.newEmail}
                    isFill={!!watch("newEmail")}
                    name="newEmail"
                    title={user?.get("email") ? "New email" : "Email"}
                    labelVisible
                    className="text-primary mt-2"
                  />
                  <InputPassword
                    register={register}
                    error={errors.newPassword}
                    isFill={!!watch("newPassword")}
                    name="newPassword"
                    title={user?.get("email") ? "New password" : "Password"}
                    labelVisible
                    className="text-primary mt-2"
                  />
                </>
              ) : (
                <Button
                  size="small"
                  className="mt-6 "
                  decoration="fillPrimary"
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
                className="mt-6 w-20"
                decoration="fillPrimary"
                disabled={loadingForm}
              >
                {loadingForm ? "..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AccountSettingsComponent;
