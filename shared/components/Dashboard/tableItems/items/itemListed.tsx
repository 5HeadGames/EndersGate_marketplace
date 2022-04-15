import {Typography} from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import {Icons} from "@shared/const/Icons";
import {
  AddressText,
  TransactionText,
} from "@shared/components/common/specialFields/SpecialFields";
import Link from "next/link";
import {useAppDispatch} from "@redux/store";
import cards from "../../../../cards.json";
import packs from "../../../../packs.json";
import Web3 from "web3";
import {loadSale} from "@shared/web3";

interface Props {
  id: string;
  type: string;
  seller?: string;
  buyer?: string;
  amount?: string;
  pack?: boolean;
}

const ItemListed: React.FunctionComponent<Props> = (props) => {
  const {id, type, seller, buyer, amount, pack} = props;

  const [sale, setSale] = React.useState<any>();

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (id) {
      getSale();
    }
  }, [id]);

  const getSale = async () => {
    const sale = await loadSale(id);
    console.log("sales", sale.payload);
    setSale(sale.payload);
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
                    : cards.All[sale.nftId].properties.image?.value
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
                {type === "Recently Listed" ? "SELLER" : "BUYER"}
              </Typography>
              <Typography type="caption" className="text-white mt-1">
                <AddressText text={type === "Recently Listed" ? seller : buyer}></AddressText>
              </Typography>
            </div>
          </td>
          <td className="py-4">
            {!pack && (
              <div className="flex flex-col items-center">
                <Typography type="caption" className="text-white text-center font-bold mt-1">
                  Type
                </Typography>
                <Typography type="caption" className="text-white mt-1">
                  {cards.All[sale.nftId].properties.type?.value}
                </Typography>
              </div>
            )}
          </td>
          <td className="py-4">
            <div className="flex flex-col items-end pr-2">
              <Typography className="text-white" type="label">
                {Web3.utils.fromWei(sale.price, "ether")} ONE
              </Typography>
            </div>
          </td>
          {type !== "Recently Listed" && (
            <td className="py-4">
              <div className="flex flex-col items-center just">
                <Typography type="caption" className="text-white text-center font-bold mt-1">
                  NFT Amount
                </Typography>
                <Typography type="caption" className="text-white font-bold mt-1">
                  {amount}
                </Typography>
              </div>{" "}
            </td>
          )}
          <td className="bg-secondary  cursor-pointer py-4 text-center w-8">
            <Link href={`/NFTDetailSale/${id}`}>
              <a href={`/NFTDetailSale/${id}`} className="flex justify-center shrink-0">
                <img src={Icons.arrowLeft} className="w-5" alt="" />
              </a>
            </Link>
          </td>
        </>
      )}
    </tr>
  );
};

export default ItemListed;
