import { Button } from "@shared/components/common/button";
import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import "shared/firebase";

const links = [
  { href: "/profile", title: "Account", icon: Icons.id },
  { href: "#", title: "Inventory", icon: Icons.inventory },
  { href: "#", title: "Account Settings", icon: Icons.settings },
];

const ProfileDataAndActions = ({ name, photo, email }) => {
  return (
    <div className="flex flex-col w-full">
      <div
        className={clsx(
          "p-4 flex flex-col w-full justify-center items-center",
          "border border-overlay-border rounded-md mb-2"
        )}
      >
        <img
          src={photo || Icons.logo}
          className="h-16 w-16 rounded-full"
          alt=""
        />
        <Typography type="title" className="text-primary">
          {name}
        </Typography>
        <Typography type="span" className="text-white">
          {email}
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
