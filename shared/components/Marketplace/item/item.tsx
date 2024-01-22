"use client";
import { Typography } from "@shared/components/common/typography";
import React from "react";
import { Icons } from "@shared/const/Icons";
import {
  AddressText,
  TransactionText,
} from "@shared/components/common/specialFields/SpecialFields";

const ItemDashboard = ({ transaction }) => {
  const { icon, id, breed_count, buyer, seller, price, timeAgo } = transaction;

  return (
    <div className="flex flex-col bg-primary-disabled">
      <div className="py-4 pl-4">
        <div className="flex gap-x-2">
          <div className="flex flex-col items-center gap-4">
            <Typography type="span" className="bg-white text-dark px-4 py-1">
              # <TransactionText text={id} />
            </Typography>
            <Typography type="caption" className="text-gray-200">
              Breed Count: {breed_count}
            </Typography>
          </div>
          <img src={icon} className="h-24 w-24" alt="" />
        </div>
      </div>
    </div>
  );
};

export const BuyerSeller = ({ nickname, address, typeOfPerson }) => {
  return (
    <div className="flex flex-col w-min">
      <Typography type="span" className="text-primary w-min">
        {typeOfPerson}
      </Typography>
      <Typography type="span" className="text-white w-min">
        {nickname}
      </Typography>
      <Typography type="span" className="text-gray-200 w-min">
        <AddressText text={address} />
      </Typography>
    </div>
  );
};

export default ItemDashboard;
