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
  const { pack: packsAddress, endersGate } = getAddresses();

  const cancelSale = async () => {
    await dispatch(
      onCancelSale({
        tokenId: cancelId.id,
        provider: provider.provider,
        user: user,
        nftContract: cancelId.pack ? packsAddress : endersGate,
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
    <div className="flex flex-col w-full min-h-screen pt-28 gap-4 md:px-20 px-8">
      <div className="flex w-full items-center">
        <h1 className="text-white text-4xl font-bold text-center w-full">
          My Sales
        </h1>
      </div>
      <Modal isShow={isShow} withoutX>
        <div className="flex flex-col gap-8 bg-overlay p-8 py-16 w-96 border border-overlay-border rounded-xl">
          <Typography
            type="subTitle"
            className="text-white text-center text-xl font-bold"
          >
            Do you want to delete this sale?
          </Typography>
          <div className="flex justify-center items-center gap-4">
            <Button
              decoration="line-white"
              className="hover:text-overlay text-white rounded-xl"
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
              className="hover:text-red-primary !hover:border-red-primary text-overlay bg-red-primary rounded-xl"
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
          "flex mb-10 items-center  justify-center",
          {
            [`${Styles.gray} flex-col items-center gap-6 h-full min-h-[400px]`]:
              sales.length == 0,
          },
          {
            ["gap-2 flex-wrap gap-2"]: sales.length != 0,
          },
        )}
      >
        {sales.length > 0 ? (
          <div className="w-full overflow-x-auto border border-overlay-border rounded-xl py-4">
            <table className="w-full min-w-max">
              <thead className="text-white font-bold">
                <th className="text-center px-10">NFT</th>
                <th className="text-center px-10">SALE ID</th>
                <th className="text-center px-10">ROLE</th>
                <th className="text-center px-10">PRICE</th>
                <th className="text-center px-10">AMOUNT</th>
                <th className="text-center px-10"></th>
                <th className="text-center"></th>
              </thead>
              <tbody>
                {sales.map((sale, i) => {
                  const pack = sale.nftId == packsAddress;
                  return (
                    <tr
                      className={clsx({
                        ["border-b border-overlay-border"]:
                          i < sales.length - 1,
                      })}
                    >
                      {sale && (
                        <>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center gap-y-2 w-full">
                              <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-20 w-20">
                                <img
                                  src={
                                    pack
                                      ? packs[sale.nftId]?.properties?.image
                                          ?.value
                                      : cards[sale.nftId]?.properties.image
                                          ?.value
                                  }
                                  className={`absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto min-w-[175%]`}
                                  alt=""
                                />
                              </div>
                              <div className="flex flex-col items-center gap-4">
                                <h2 className="text-primary-disabled text-xl font-bold">
                                  {pack
                                    ? packs[sale.nftId]?.properties?.name?.value
                                    : cards[sale.nftId]?.properties.name?.value}
                                </h2>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center">
                              <h2 className="text-white text-lg font-bold">
                                #{sale.id}
                              </h2>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center">
                              <h2 className="text-white text-lg font-bold">
                                {cards[sale.nftId]?.properties.role?.value
                                  ? cards[sale.nftId]?.properties.role?.value
                                  : cards[sale.nftId]?.properties.isGuardian
                                      ?.value
                                  ? "Guardian"
                                  : ""}
                              </h2>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center pr-2">
                              <h2 className="text-white text-lg font-bold">
                                {parseInt(sale.price) / 10 ** 6} USD
                              </h2>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center just">
                              <h2 className="text-white text-lg font-bold">
                                {sale.amount}
                              </h2>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center just">
                              <Button
                                decoration="line-white"
                                className="text-white hover:text-overlay rounded-xl"
                                size="small"
                                onClick={() => {
                                  setCancelId({
                                    id: sale.id,
                                    pack: sale.nft === pack,
                                  });
                                  show();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>

                          <td className="py-4">
                            <Link href={`/NFTDetailSale/${sale.id}`}>
                              <div className="flex flex-col items-center just">
                                <Button
                                  decoration="fill"
                                  className="text-overlay hover:text-white rounded-xl"
                                  size="small"
                                >
                                  Go to Sale
                                </Button>
                              </div>
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
