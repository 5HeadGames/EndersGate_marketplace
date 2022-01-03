import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";

const ItemListed = ({ icon, label, value, value2 }) => {
  return (
    <div className="flex items-center">
      <img src={icon} className="h-16 w-16" alt="" />
      <div className="pl-4">
        <Typography className="text-primary" type="label">
          {label}
        </Typography>
        <Typography type="subTitle" className="text-white">
          {value} {value2}
        </Typography>
      </div>
    </div>
  );
};

export default ItemListed;
