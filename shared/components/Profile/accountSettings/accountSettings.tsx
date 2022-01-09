import {Button} from "@shared/components/common/button";
import {Typography} from "@shared/components/common/typography";
import {Icons} from "@shared/const/Icons";
import {useAuthState} from "react-firebase-hooks/auth";
import clsx from "clsx";
import React from "react";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import "shared/firebase";
import {useAppSelector, useAppDispatch} from "redux/store";
import {useForm} from "react-hook-form";
import {Input} from "@shared/components/common/form/input";
import {InputEmail} from "@shared/components/common/form/input-email";
import {InputPassword} from "@shared/components/common/form/input-password";
import {writeUser, uploadFile, getFileUrl} from "@shared/firebase";
import {onUpdateUser, onMessage, onLoginUser} from "@redux/actions";

const auth = getAuth();

const AccountSettingsComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const [image, setImage] = React.useState("");
  const [loadingForm, setLoading] = React.useState(false);
  const [authUser, loading, error] = useAuthState(auth);
  const [openEmailPassword, setOpenEmailPassword] = React.useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const userPath = `users/${user.address}`;

  console.log({authUser});

  const onLoadingImageSubmit = (load: unknown) => {
    console.log({load});
  };

  const onSuccessImageSubmit = (arg: {path: string}) => async () => {
    const fileUrl = await getFileUrl(arg);
    const writeData = {profile_picture: fileUrl};
    writeUser(userPath, writeData);
    dispatch(onUpdateUser(writeData));
  };

  const onErrorImageSubmit = (error: unknown) => {
    console.log({error});
  };

  const handleChangePicture = (e: React.ChangeEvent<any>) => {
    const file = e.target.files[0];
    const path = `${userPath}/${file.name}`;
    uploadFile({
      file,
      path,
      metadata: {name: file.name, size: file.size, type: file.type},
      onLoad: onLoadingImageSubmit,
      onError: onErrorImageSubmit,
      onSuccess: onSuccessImageSubmit({path}),
    });
    setImage("");
  };

  const handleSetField = (field: "name" | "userStatus") => (e: React.ChangeEvent<any>) => {
    writeUser(userPath, {[field]: e.target.value as string});
  };

  const onSubmit = async ({email, password}: {email: string; password: string}) => {
    setLoading(true);
    if (!authUser) onLoginUser({email, password, address: user.address})
    else {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      credential.user.updateEmail('newyou@domain.com')
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
        <Typography type="title" className="text-primary mb-4">
          {" "}
          PROFILE
        </Typography>
        <div className="flex md:flex-row flex-col items-start w-full md:gap-6">
          <div className="flex md:flex-col sm:flex-row flex-col mb-4 items-center">
            <div className="xl:h-40 xl:w-40 md:h-32 md:w-32 h-40 w-40 rounded-full relative">
              <img
                src={user.profile_picture !== "" ? user.profile_picture : Icons.logo}
                alt=""
              />
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
              defaultValue={user.name}
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
              defaultValue={user.userStatus}
              onBlur={handleSetField("userStatus")}
            />
          </div>
        </div>
        <div
          className={clsx("w-full flex flex-col items-center", !openEmailPassword && "hidden")}
        >
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
            {`${user.email ? "Change" : "Set"} email and password`}
          </Button>
        )}
      </form>
    </div>
  );
};

export default AccountSettingsComponent;
