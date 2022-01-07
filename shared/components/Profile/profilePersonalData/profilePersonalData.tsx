import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import "shared/firebase";

const ProfileData = ({ name, photo, email }) => {
  return (
    <div
      className={clsx(
        "p-4 flex flex-col w-full justify-center items-center",
        "border border-overlay-border rounded-md"
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
  );
};

export default ProfileData;
