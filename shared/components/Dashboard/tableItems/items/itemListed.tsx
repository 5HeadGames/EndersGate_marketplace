"use client";
import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import {
  AddressText,
  nFormatter,
  TransactionText,
  Type,
} from "@shared/components/common/specialFields/SpecialFields";
import Link from "next/link";
import { useAppDispatch } from "@redux/store";

import packs from "../../../../packs.json";
import Web3 from "web3";
import { loadSale } from "@shared/web3";
import { convertArrayCards } from "../../../common/convertCards";
import { useBlockchain } from "@shared/context/useBlockchain";

interface Props {
  id: string;
  type: string;
  seller?: string;
  buyer?: string;
  amount?: string;
  pack?: boolean;
}

const cards = convertArrayCards();

const ItemListed: React.FunctionComponent<Props> = (props) => {
  const { id, type, seller, amount, pack } = props;

  const [sale, setSale] = React.useState<any>();

  const { blockchain } = useBlockchain();

  React.useEffect(() => {
    if (id !== undefined) {
      getSale();
    }
  }, [id]);

  const getSale = async () => {
    const sale = await loadSale({ id, blockchain });
    setSale(sale);
  };

  return (
    <tr className="border-b-2 border-primary-disabled">
      {sale && (
        <>
          <td className="py-4 pl-4">
            <div className="flex items-center gap-x-2">
              <img
                src={
                  pack
                    ? packs[sale.nftId]?.properties?.image?.value
                    : cards[sale.nftId]?.image
                }
                className={"h-12 w-8"}
                alt=""
              />
              <div className="flex flex-col items-center gap-4">
                <Typography type="span" className="text-gray-200">
                  Sale #{id}
                </Typography>
              </div>
            </div>
          </td>
          <td className="py-4">
            <div className="flex flex-col items-center">
              <Typography type="caption" className="text-white font-bold mt-1">
                {pack
                  ? packs[sale.nftId]?.properties?.name?.value.toUpperCase()
                  : cards[sale.nftId]?.properties?.name?.value.toUpperCase()}
              </Typography>
            </div>
          </td>

          <td className="py-4">
            <div className="flex flex-col items-center">
              <Typography type="caption" className="text-white font-bold mt-1">
                {"SELLER"}
              </Typography>
              <Typography type="caption" className="text-white mt-1">
                <AddressText text={seller}></AddressText>
              </Typography>
            </div>
          </td>
          <td className="py-4">
            {!pack && (
              <div className="flex flex-col items-center">
                <Typography
                  type="caption"
                  className="text-white text-center font-bold mt-1"
                >
                  Type
                </Typography>
                <Typography type="caption" className="text-white mt-1">
                  <Type id={sale?.nftId}></Type>
                </Typography>
              </div>
            )}
          </td>
          <td className="py-4">
            <div className="flex flex-col items-end pr-2">
              <Typography className="text-white" type="label">
                {nFormatter(parseInt(sale.price) / 10 ** 6)} ONE
              </Typography>
            </div>
          </td>
          {/* {type !== "Recently Listed" && (
            <td className="py-4">
              <div className="flex flex-col items-center just">
                <Typography
                  type="caption"
                  className="text-white text-center font-bold mt-1"
                >
                  NFT Amount
                </Typography>
                <Typography
                  type="caption"
                  className="text-white font-bold mt-1"
                >
                  {amount}
                </Typography>
              </div>{" "}
            </td>
          )} */}
          <td className="bg-secondary  cursor-pointer py-4 text-center w-8">
            <Link
              className="bg-secondary  cursor-pointer py-4 text-center w-8"
              href={`/sale/${id}`}
            >
              <img src={Icons.arrowLeft} className="w-5" alt="" />
            </Link>
          </td>
        </>
      )}
    </tr>
  );
};

export default ItemListed;
