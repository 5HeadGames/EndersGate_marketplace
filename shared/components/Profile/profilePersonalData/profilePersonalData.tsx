import { Typography } from "@shared/components/common/typography";
import clsx from "clsx";
import React from "react";
import "shared/firebase";

const ProfileData = ({ name, photo, email }) => {
  return (
    <div
      className={clsx(
        "p-2 flex flex-col w-full justify-center items-center",
        "border border-overlay-border"
      )}
    >
      <img src={photo} className="h-6 w-6" alt="" />
      <Typography type="title" className="text-primary">
        {name}
      </Typography>
      <Typography type="caption" className="text-primary-disabled">
        {email}
      </Typography>
    </div>
  );
};

export default ProfileData;
