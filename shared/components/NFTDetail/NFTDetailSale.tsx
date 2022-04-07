import React from "react";
import {
  FireFilled,
  HeartFilled,
  LeftOutlined,
  LoadingOutlined,
  MenuOutlined,
  StarFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Web3 from "web3";

import { useAppDispatch, useAppSelector } from "redux/store";
import { getUserPath } from "shared/firebase";
import {
  onApproveERC1155,
  onSellERC1155,
  onBuyERC1155,
  onUpdateFirebaseUser,
  onLoadSales,
  onLoadSale,
} from "@redux/actions";
import { Button } from "../common/button/button";
import { Icons } from "@shared/const/Icons";
import {
  AddressText,
  TransactionText,
} from "../common/specialFields/SpecialFields";
import { getAddresses, getContract } from "@shared/web3";
import { Typography } from "../common/typography";
import cards from "../../cards.json";
import { TimeConverter } from "../common/unixDateConverter/unixConverter";

const { marketplace } = getAddresses();

const NFTDetailSaleComponent: React.FC<any> = ({ id, inventory }) => {
  const user = useAppSelector((state) => state.user);
  // const NFTs = useAppSelector((state) => state.nfts);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userPath = getUserPath(user);

  const [sale, setSale] = React.useState<any>();

  React.useEffect(() => {
    if (id) {
      getSale();
    }
  }, [id]);

  const getSale = async () => {
    const sale = await dispatch(onLoadSale(id));
    console.log(sale.payload);
    setSale(sale.payload);
  };

  const buyNft = async () => {
    console.log("user", user);
    if (user.address === "") {
      router.push("/login");
    }
    await dispatch(
      onBuyERC1155({
        walletType: user.walletType,
        tx: { from: user.address, bid: "5", tokenId: id },
      })
    );
    await dispatch(
      onUpdateFirebaseUser({
        userPath,
        updateData: {
          activity: [
            ...user.activity,
            {
              type: "buy",
              createdAt: new Date().toISOString(),
              nft: {
                tokenId: id,
              },
            },
          ],
        },
      })
    );
  };

  return (
    <>
      {id !== undefined && sale !== undefined ? (
        <div className="min-h-screen w-full flex flex-col xl:px-20 md:px-10 sm:px-6 pt-32 pb-20">
          <div className="flex sm:flex-row flex-col sm:justify-between  w-full">
            <div className="flex flex-col gap-2">
              <div
                className="cursor-pointer text-white flex font-bold items-center gap-1"
                onClick={() => router.back()}
              >
                <LeftOutlined />
                Back
              </div>
              <Typography type="title" className="text-primary">
                Card #{sale?.nftId}
              </Typography>
              <Typography type="title" className="text-primary">
                Transaction #{id}
              </Typography>
            </div>
            <div className="flex gap-2 items-center sm:mt-0 mt-4 sm:justify-end justify-between">
              <div className="flex flex-col items-end">
                <div className="text-primary font-bold flex items-center gap-2">
                  <MenuOutlined />
                  <Typography type="title">
                    {Web3.utils.fromWei(sale.price, "ether")}
                  </Typography>
                  <Typography type="subTitle" className="text-white">
                    $116.15
                  </Typography>
                </div>

                <Typography type="subTitle" className="text-white">
                  Amount Available: {sale.amount}
                </Typography>
              </div>

              <Button
                decoration="fillPrimary"
                className="degradated hover:text-white border-none"
                size="small"
                onClick={buyNft}
              >
                <img src={Icons.harmony} className="h-6 w-6" alt="" /> Buy now
              </Button>
            </div>
          </div>
          <div className="w-full flex md:flex-row flex-col mt-10">
            <div className="flex relative justify-center md:w-1/2 xl:px-24">
              <div className="sm:sticky sm:top-32 h-min w-72">
                <img
                  src={cards.All[id].properties.image?.value || Icons.logo}
                  className="w-72"
                  alt=""
                />
              </div>
            </div>
            <div className="flex flex-col md:w-1/2">
              <div className="flex flex-col">
                <Typography type="title" className="text-primary font-bold">
                  About NFT
                </Typography>
                <div className="flex flex-col gap-4 px-10 py-6 border border-primary rounded-xl mt-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        NAME
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        {cards.All[id].properties.name?.value}
                      </Typography>
                    </div>
                    {cards.All[id].properties.type?.value && (
                      <div className="flex flex-col">
                        <Typography
                          type="subTitle"
                          className="text-white font-bold"
                        >
                          TYPE
                        </Typography>
                        <Typography
                          type="subTitle"
                          className="text-primary opacity-75"
                        >
                          {cards.All[id].properties.type?.value}
                        </Typography>
                      </div>
                    )}
                    {cards.All[id].properties.rarity?.value && (
                      <div className="flex flex-col">
                        <Typography
                          type="subTitle"
                          className="text-white font-bold"
                        >
                          RARITY
                        </Typography>
                        <Typography
                          type="subTitle"
                          className="text-primary opacity-75"
                        >
                          {cards.All[id].properties.rarity?.value}
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        DESCRIPTION
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        {cards.All[id].properties.description?.value}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col pt-6">
                <Typography type="title" className="text-primary font-bold">
                  Sale Details
                </Typography>
                <div className="flex flex-col gap-4 px-10 py-6 border border-primary rounded-xl mt-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        OWNER
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        <AddressText text={sale.seller}></AddressText>
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        AMOUNT OF CARDS AVAILABLE
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        {sale.amount}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        FINISH AT
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        <TimeConverter
                          UNIX_timestamp={
                            parseInt(sale.duration) + parseInt(sale.startedAt)
                          }
                        ></TimeConverter>
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        STATUS
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        {sale.status == 0
                          ? "Active"
                          : sale.status == 1
                          ? "Sold"
                          : "Cancelled"}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-screen bg-overlay flex items-center justify-center text-3xl text-primary">
          <LoadingOutlined />
        </div>
      )}
    </>
  );
};

export default NFTDetailSaleComponent;
