import { Typography } from "@shared/components/common/typography";
import React from "react";
import { Icons } from "@shared/const/Icons";
import AddressText from "@shared/components/common/specialFields/SpecialFields";

const ItemSold = ({ transaction }) => {
  const { icon, id, breed_count, buyer, seller, price, timeAgo } = transaction;
  return (
    <tr className="border-b-2 border-overlay-border">
      <td className="py-4 pl-4">
        <div className="flex gap-x-2">
          <img src={icon} className="h-10 w-10" alt="" />
          <div className="flex flex-col items-center gap-4">
            <Typography type="span" className="bg-white text-dark px-4 py-1">
              #{id}
            </Typography>
            <Typography type="caption" className="text-gray-200">
              Breed Count: {breed_count}
            </Typography>
          </div>
        </div>
      </td>
      <td className="py-4">
        <BuyerSeller
          nickname={buyer.nickname}
          address={buyer.address}
          typeOfPerson="BUYER"
        />
      </td>
      <td className="py-4">
        <BuyerSeller
          nickname={seller.nickname}
          address={seller.address}
          typeOfPerson="SELLER"
        />
      </td>
      <td className="py-4">
        <div className="flex flex-col items-end pr-2">
          <Typography className="text-white" type="label">
            {price.eth}
          </Typography>
          <Typography className="text-white font-bold" type="span">
            ${price.dollars}
          </Typography>
          <Typography className="text-white font-bold" type="span">
            {timeAgo}
          </Typography>
        </div>
      </td>
      <td className="bg-primary-disabled cursor-pointer py-4 text-center w-8">
        <div className="flex justify-center shrink-0">
          <img src={Icons.arrowLeft} className="w-5" alt="" />
        </div>
      </td>
    </tr>
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

export default ItemSold;
