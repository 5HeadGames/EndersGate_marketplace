import {Button} from "@shared/components/common/button";
import {Typography} from "@shared/components/common/typography";
import {Icons} from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import "shared/firebase";
import {
  CheckCircleOutlined,
  FormOutlined,
  GoldenFilled,
  GoldFilled,
  GoldOutlined,
  IdcardOutlined,
  LogoutOutlined,
  SettingFilled,
  SettingOutlined,
} from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "redux/store";
import { onLogout, onMessage } from "redux/actions";
import { useModal } from "@shared/hooks/modal";
import { useForm } from "react-hook-form";
import { Input } from "@shared/components/common/form/input";
import Inventory2Icon from "@mui/icons-material/Inventory2";

type ButtonsTypes = { logout: boolean };

const ProfileDataAndActions = ({ name, photo, email }) => {
  const [disabled, setDisabled] = React.useState<ButtonsTypes>({
    logout: false,
  });
  const { Modal, isShow, show, hide } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const disableButton = (option: ButtonsTypes) => {
    setDisabled((prev) => ({ ...prev, ...option }));
  };

  const handleSignOut = async () => {
    console.log("handleSignOut");
    disableButton({ logout: true });
    const isLoggedOut = await dispatch(onLogout(user));
    disableButton({ logout: false });
    if (isLoggedOut) {
      dispatch(onMessage("Logged out successfully!"));
      setTimeout(dispatch, 2000, onMessage(""));
    }
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
          <form action="" className="flex flex-col items-center w-full">
            <input
              type="file"
              accept="image/*"
              id="profile_picture"
              className="hidden"
            />
            <div className="flex md:flex-row flex-col items-center mb-4">
              <div className="h-24 w-24 rounded-full relative">
                <img
                  src={
                    user.profile_picture !== ""
                      ? user.profile_picture
                      : Icons.logo
                  }
                  alt=""
                />
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
              name="nickname"
              placeholder="Nickname"
              value={user.name}
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
        <img
          src={user.profile_picture || Icons.logo}
          className="h-16 w-16 rounded-full"
          alt=""
        />
        <Typography
          type="title"
          className="text-primary flex items-center mt-2"
        >
          {user.name}
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
          {user.email}
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
