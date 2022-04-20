import React from "react";
import clsx from "clsx";
import {
  CheckCircleOutlined,
  FormOutlined,
  FundViewOutlined,
  GoldenFilled,
  IdcardOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { useMoralis, useMoralisFile } from "react-moralis";

import { Button } from "@shared/components/common/button";
import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import { useModal } from "@shared/hooks/modal";
import { Input } from "@shared/components/common/form/input";

type ButtonsTypes = { logout: boolean; userData: boolean };

const ProfileDataAndActions = () => {
  const [disabled, setDisabled] = React.useState<ButtonsTypes>({
    logout: false,
    userData: false,
  });
  const [image, setImage] = React.useState<File | null>(null);
  const { Modal, isShow, show, hide } = useModal();
  const { register, handleSubmit } = useForm();
  const { logout, user, setUserData } = useMoralis();
  const { saveFile } = useMoralisFile();
  const profileImage = user?.get("profileImage")
    ? user.get("profileImage").url()
    : Icons.logo;

  const handleDisabled = (field: keyof ButtonsTypes) => (value: boolean) => {
    setDisabled((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (values: any) => {
    const toggleForm = handleDisabled("userData");
    let moralisFile = null;
    toggleForm(true);
    if (image) {
      moralisFile = await saveFile(image.name, image, {
        type: "image/png",
      });
    }
    await setUserData(
      moralisFile
        ? { profileImage: moralisFile, name: values.name }
        : { name: values.name }
    );
    toggleForm(false);
  };

  const handleSignOut = async () => {
    const toggleLogout = handleDisabled("logout");
    toggleLogout(true);
    logout();
    toggleLogout(false);
  };

  const links = [
    { href: "/profile", label: "Account", icon: <IdcardOutlined /> },
    {
      href: "/profile/inventory",
      label: "Inventory",
      icon: <GoldenFilled />,
    },
    {
      href: "/profile/activity",
      label: "Activity",
      icon: <CheckCircleOutlined />,
    },
    {
      href: "/profile/accountSettings",
      label: "Account Settings",
      icon: <SettingOutlined />,
    },
    {
      href: "/profile/mySales",
      label: "My Sales",
      icon: <FundViewOutlined />,
    },
    {
      label: "Logout",
      decoration: "line-primary",
      onClick: handleSignOut,
      icon: <LogoutOutlined />,
      disabled: disabled.logout,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <Modal isShow={isShow}>
        <div className="flex flex-col items-center p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="flex flex-col items-center w-full"
          >
            <input
              onChange={(e: React.ChangeEvent<any>) =>
                setImage(e.target.files[0])
              }
              type="file"
              accept="image/*"
              id="profile_picture"
              className="hidden"
            />
            <div className="flex md:flex-row flex-col items-center mb-4">
              <div className="h-24 w-24 rounded-full relative">
                <img src={profileImage} alt="" />
              </div>
              <label
                htmlFor="profile_picture"
                className={clsx(
                  "bg-overlay border border-primary cursor-pointer",
                  "text-primary px-4 py-2 text-md rounded-md md:ml-4 md:mt-0 mt-4"
                )}
              >
                Change Picture
              </label>
            </div>
            <Input
              register={register}
              name="name"
              placeholder="Nickname"
              defaultValue={user?.get("name")}
            />
            <Button
              decoration="fillPrimary"
              size="small"
              type="submit"
              className="mt-4"
            >
              Save
            </Button>
          </form>
        </div>
      </Modal>
      <div
        className={clsx(
          "p-4 flex flex-col w-full justify-center items-center",
          "border border-overlay-border rounded-md mb-2"
        )}
      >
        <img src={profileImage} className="h-16 w-16 rounded-full" alt="" />
        <Typography
          type="title"
          className="text-primary flex items-center mt-2"
        >
          {user?.get("name")}
        </Typography>
        <div
          onClick={() => {
            show();
          }}
          className="cursor-pointer h-4 w-4 text-primary"
        >
          <FormOutlined />
        </div>
        <Typography type="span" className="text-white md:text-xs text-caption">
          {user?.get("email") || ""}
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        {links.map((link, index) => {
          return (
            <Button
              {...link}
              decoration={link.decoration || ("fill" as any)}
              key={"profile-option-" + index}
              className="p-3 flex justify-start items-start w-full"
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProfileDataAndActions;
