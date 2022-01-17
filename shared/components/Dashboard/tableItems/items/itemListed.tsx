import {Typography} from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import {Icons} from "@shared/const/Icons";
import { TransactionText } from "@shared/components/common/specialFields/SpecialFields";
import Link from "next/link";

interface Props {
  id: string;
  icon: string;
  label: string;
  value: number;
  value2: number;
  breed_count: number;
  price: { eth: number; dollars: number };
  timeAgo: string;
}

const ItemListed: React.FunctionComponent<Props> = (props) => {
  const { icon, label, value, value2, id, breed_count, price, timeAgo } = props;
  console.log(props);

  return (
    <tr className="border-b-2 border-overlay-border">
      <td className="py-4 pl-4">
        <div className="flex gap-x-2">
          <img src={icon} className="h-10 w-10" alt="" />
          <div className="flex flex-col items-center gap-4">
            <Typography type="span" className="bg-white text-dark px-4 py-1">
              #<TransactionText text={id} />
            </Typography>
            <Typography type="caption" className="text-gray-200">
              Breed Count: {breed_count}
            </Typography>
          </div>
        </div>
      </td>

      <td className="py-4">
        <div className="flex flex-col items-center">
          <img src={Icons.earth} className="h-6 w-6" alt="" />
          <Typography type="caption" className="text-white font-bold mt-1">
            EARTH
          </Typography>
        </div>
      </td>
      <td className="py-4">
        <div className="flex flex-col items-center">
          <img src={Icons.heart} className="h-6 w-6" alt="" />
          <Typography type="caption" className="text-white font-bold mt-1">
            200
          </Typography>
        </div>
      </td>
      <td className="py-4">
        <div className="flex flex-col items-center">
          <img src={Icons.dagger} className="h-6 w-6" alt="" />
          <Typography type="caption" className="text-white font-bold mt-1">
            500
          </Typography>
        </div>
      </td>
      <td className="py-4">
        <div className="flex flex-col items-center">
          <img src={Icons.logo} className="h-6 w-6" alt="" />
          <Typography type="caption" className="text-white font-bold mt-1">
            600
          </Typography>
        </div>
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
        <Link href="/NFTDetail">
          <a href="/NFTDetail" className="flex justify-center shrink-0">
            <img src={Icons.arrowLeft} className="w-5" alt="" />
          </a>
        </Link>
      </td>
    </tr>
  );
};

export default ItemListed;
