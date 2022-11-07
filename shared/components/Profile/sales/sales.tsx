import { Button } from "@shared/components/common/button";
import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import Web3 from "web3";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "redux/store";
import Styles from "./styles.module.scss";
import packs from "../../../packs.json";
import { getAddresses } from "@shared/web3";

import { useModal } from "@shared/hooks/modal";
import { onCancelSale, onLoadSales, onGetAssets } from "@redux/actions";
import { convertArrayCards } from "@shared/components/common/convertCards";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useWeb3React } from "@web3-react/core";

const Sales = () => {
  const nfts = useAppSelector((state) => state.nfts);
  const { account: user, provider } = useWeb3React();

  const [cancelId, setCancelId] = React.useState({ id: -1, pack: false });
  const { Modal, show, hide, isShow } = useModal();
  const dispatch = useAppDispatch();

  const cards = convertArrayCards();

  const [sales, setSales] = React.useState([]);
  const addresses = getAddresses();

  const cancelSale = async () => {
    await dispatch(
      onCancelSale({
        tokenId: cancelId.id,
        provider: provider.provider,
        user: user,
        nftContract: cancelId.pack ? addresses.pack : addresses.endersGate,
      }),
    );
    dispatch(onLoadSales());
    dispatch(onGetAssets(user));
    hide();
  };

  React.useEffect(() => {
    const arrayPacks = [];
    console.log(nfts.saleCreated);
    nfts.saleCreated.forEach((sale, index) => {
      console.log(sale.seller === user, sale.seller, user);
      if (sale.seller.toLowerCase() === user.toLowerCase()) {
        if (sale.status !== 3) {
          arrayPacks.push(sale);
        }
      }
    });
    console.log(arrayPacks);

    setSales(arrayPacks);
  }, [nfts, user]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full items-center">
        <Typography type="title" className="text-white">
          My Sales
        </Typography>
      </div>
      <hr className="w-full my-4" />
      <Modal isShow={isShow} withoutX>
        <div className="flex flex-col gap-4 bg-overlay p-4 w-64">
          <Typography
            type="subTitle"
            className="text-white text-center font-bold"
          >
            Do you want to delete this sale?
          </Typography>
          <div className="flex justify-center items-center gap-4">
            <Button
              decoration="fill"
              size="small"
              onClick={() => {
                hide();
              }}
            >
              Cancel
            </Button>
            <Button
              // decoration="fill"
              size="small"
              className="degradated border-0"
              onClick={() => {
                cancelSale();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <div
        className={clsx(
          "flex mb-10  justify-center",
          {
            [`${Styles.gray} flex-col items-center gap-6 h-72`]:
              sales.length == 0,
          },
          {
            ["gap-2 flex-wrap gap-2"]: sales.length != 0,
          },
        )}
      >
        {sales.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max ">
              <tbody>
                {sales.map((sale) => {
                  const pack = sale.nftId === addresses.pack;
                  return (
                    <tr className="border-b-2 border-primary-disabled">
                      {sale && (
                        <>
                          <td className="py-4 pl-4">
                            <div className="flex items-center gap-x-2">
                              <img
                                src={
                                  pack
                                    ? packs[sale.nftId]?.properties?.image
                                        ?.value
                                    : cards[sale.nftId]?.properties.image?.value
                                }
                                className={"h-12 w-8"}
                                alt=""
                              />
                              <div className="flex flex-col items-center gap-4">
                                <Typography
                                  type="span"
                                  className="text-gray-200"
                                >
                                  Sale #{sale.id}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col items-center">
                              <Typography
                                type="caption"
                                className="text-white text-center font-bold mt-1"
                              >
                                Type
                              </Typography>
                              <Typography
                                type="caption"
                                className="text-white mt-1"
                              >
                                {cards[sale.nftId]?.properties.type?.value}
                              </Typography>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col items-end pr-2">
                              <Typography className="text-white" type="label">
                                {Web3.utils.fromWei(sale.price, "ether")} ONE
                              </Typography>
                            </div>
                          </td>

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
                                {sale.amount}
                              </Typography>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col items-center just">
                              <Button
                                decoration="fill"
                                size="small"
                                onClick={() => {
                                  setCancelId({
                                    id: sale.id,
                                    pack: sale.nft === addresses.pack,
                                  });
                                  show();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>

                          <td className="bg-secondary  cursor-pointer py-4 text-center w-8">
                            <Link href={`/NFTDetailSale/${sale.id}`}>
                              <a
                                href={`/NFTDetailSale/${sale.id}`}
                                className="flex justify-center shrink-0"
                              >
                                <img
                                  src={Icons.arrowLeft}
                                  className="w-5"
                                  alt=""
                                />
                              </a>
                            </Link>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <img src={Icons.logo} className="h-40 w-40" alt="" />
            <Typography
              type="subTitle"
              className={clsx(Styles.title, "text-primary")}
            >
              You don't have any item yet
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

export default Sales;
