import {Button} from "@shared/components/common/button";
import {Typography} from "@shared/components/common/typography";
import {Icons} from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import "shared/firebase";
import {CheckCircleOutlined} from '@ant-design/icons'
import {useAppSelector} from "redux/store";
import {useModal} from "@shared/hooks/modal";
import {XIcon} from "@heroicons/react/solid";
import {useForm} from "react-hook-form";
import {Input} from "@shared/components/common/form/input";

const links = [
  {href: "/profile", title: "Account", icon: Icons.id},
  {
    href: "/profile/inventory",
    title: "Inventory",
    icon: Icons.inventory,
  },
  {
    href: "/profile/activity",
    title: "Activity",
    icon: <CheckCircleOutlined />,
  },
  {
    href: "/profile/accountSettings",
    title: "Account Settings",
    icon: Icons.settings,
  },
];

const ProfileDataAndActions = ({name, photo, email}) => {
  const {Modal, isShow, show, hide} = useModal();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const user = useAppSelector((state) => state.user);
  return (
    <div className="flex flex-col w-full">
      <Modal isShow={isShow}>
        <div className="flex flex-col items-center p-6">
          <form action="" className="flex flex-col items-center w-full">
            <input type="file" accept="image/*" id="profile_picture" className="hidden" />
            <div className="flex md:flex-row flex-col items-center mb-4">
              <div className="h-24 w-24 rounded-full relative">
                <img
                  src={user.profile_picture !== "" ? user.profile_picture : Icons.logo}
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
            <Button decoration="fillPrimary" size="small" type="submit" className="mt-4">
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
        <Typography type="title" className="text-primary flex items-center mt-2">
          {user.name}
        </Typography>
        <div
          onClick={() => {
            show();
          }}
          className="cursor-pointer"
        >
          <img src={Icons.edit} className="h-4 w-4" alt="edit" />
        </div>
        <Typography type="span" className="text-white md:text-xs text-caption">
          {user.email}
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        {links.map((link, index) => {
          return (
            <Button
              decoration="fill"
              key={"profile-option-" + index}
              href={link.href}
              className="p-3 flex justify-start items-start w-full"
              label={link.title}
              icon={link.icon}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProfileDataAndActions;
