import {Button} from "@shared/components/common/button";
import {Icons} from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import {useMoralis, useMoralisFile} from "react-moralis";
import {useAppSelector, useAppDispatch} from "redux/store";
import {useForm} from "react-hook-form";
import {Input} from "@shared/components/common/form/input";
import {InputEmail} from "@shared/components/common/form/input-email";
import {InputPassword} from "@shared/components/common/form/input-password";
import {onMessage, onLoginUser, onUpdateUserCredentials} from "@redux/actions";

const AccountSettingsComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const [image, setImage] = React.useState("");
  const [loadingForm, setLoading] = React.useState(false);
  const [openEmailPassword, setOpenEmailPassword] = React.useState(false);
  const {user} = useMoralis();
  const {saveFile} = useMoralisFile();
  const dispatch = useAppDispatch();

  const handleChangePicture = async (e: React.ChangeEvent<any>) => {
    try {
      const file = e.target.files[0];
      const moralisFile = await saveFile(file.name, file, {
        type: "image/png",
      });
      user.set("profilePicture", file);
      await user.save();
    } catch (error) {
      console.log({error});
    }
  };

  const handleSetField = (field: "name" | "userStatus") => (e: React.ChangeEvent<any>) => {};

  const onSubmit = async ({
    oldEmail,
    newEmail,
    oldPassword,
    newPassword,
  }: {
    oldEmail: string;
    newEmail: string;
    oldPassword: string;
    newPassword: string;
  }) => {
    setLoading(true);
    try {
    } catch (err) {
      console.log({err});
      setLoading(false);
      return;
    }
    setLoading(false);
    dispatch(onMessage("Changes submitted!"));
    setTimeout(dispatch, 2000, onMessage(""));
  };

  return (
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
              <img src={user?.profile_picture !== "" ? user?.profile_picture : Icons.logo} alt="" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile_picture"
              value={image}
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
              defaultValue={user?.name}
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
              defaultValue={user?.userStatus}
              onBlur={handleSetField("userStatus")}
            />
          </div>
        </div>
        <div className={clsx("w-full flex flex-col items-center", !openEmailPassword && "hidden")}>
          {user?.email && (
            <>
              <InputEmail
                register={register}
                error={errors.oldEmail}
                isFill={!!watch("oldEmail")}
                name="oldEmail"
                title="Old email"
                labelVisible
                className="text-primary mt-2"
                defaultValue={user?.email}
              />
              <InputPassword
                register={register}
                error={errors.oldPassword}
                isFill={!!watch("oldPassword")}
                name="oldPassword"
                title="Old password"
                labelVisible
                className="text-primary mt-2"
              />
              <div className="w-full bg-primary mt-5 mb-2 rounded" style={{height: "1px"}}></div>
            </>
          )}
          <InputEmail
            register={register}
            error={errors.newEmail}
            isFill={!!watch("newEmail")}
            name="newEmail"
            title={user?.email ? "New email" : "Email"}
            labelVisible
            className="text-primary mt-2"
          />
          <InputPassword
            register={register}
            error={errors.newPassword}
            isFill={!!watch("newPassword")}
            name="newPassword"
            title={user?.email ? "New password" : "Password"}
            labelVisible
            className="text-primary mt-2"
          />
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
        {!openEmailPassword && (
          <Button
            size="medium"
            decoration="line-primary"
            type="button"
            onClick={() => setOpenEmailPassword(!openEmailPassword)}
          >
            {`${user?.email ? "Change" : "Set"} email and password`}
          </Button>
        )}
      </form>
    </div>
  );
};

export default AccountSettingsComponent;
