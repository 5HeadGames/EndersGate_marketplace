import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";

export const AddressText = ({ text }) => {
  return <>{"(" + text.substring(0, 4) + "..." + text.substring(20) + ")"}</>;
};

export const TransactionText = ({ text }) => {
  return <>{text.substring(0, 7) + "..." + text.substring(40)}</>;
};

