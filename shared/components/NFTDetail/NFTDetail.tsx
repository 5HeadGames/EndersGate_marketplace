import React from "react";
import {
  FireFilled,
  HeartFilled,
  LeftOutlined,
  MenuOutlined,
  StarFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "redux/store";
import {getUserPath} from 'shared/firebase'
import {onApproveERC1155, onSellERC1155, onBuyERC1155, onUpdateFirebaseUser, onGetListed} from "@redux/actions";
import {Button} from "../common/button/button";
import {Icons} from "@shared/const/Icons";
import {AddressText, TransactionText} from "../common/specialFields/SpecialFields";
import {getAddresses} from '@shared/web3'
import {Typography} from "../common/typography";

const {marketplace} = getAddresses();

const NFTDetailComponent = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userPath = getUserPath(user)

  const sellNft = async () => {
    await dispatch(
      onApproveERC1155({
        walletType: user.walletType,
        tx: {to: marketplace, from: user.address},
      })
    );
    await dispatch(
      onSellERC1155({
        walletType: user.walletType,
        tx: {from: user.address, startingPrice: "1", tokenId: 3},
      })
    );
    await dispatch(
      onUpdateFirebaseUser({
        userPath,
        updateData: {
          activity: [
            ...user.activity,
            {
              type: "sell",
              createdAt: new Date().toISOString(),
              nft: {
                tokenId: 3,
              },
            },
          ],
        },
      })
    );
    await dispatch(onGetListed())
  };

  const buyNft = async () => {
    await dispatch(
      onBuyERC1155({
        walletType: user.walletType,
        tx: {from: user.address, bid: '5', tokenId: 2},
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
                tokenId: 2,
              },
            },
          ],
        },
      })
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col xl:px-20 md:px-10 sm:px-6 pt-32">
      <div className="flex sm:flex-row flex-col sm:justify-between  w-full">
        <div className="flex flex-col gap-2">
          <div
            className="cursor-pointer text-white flex font-bold items-center gap-1"
            onClick={() => router.back()}
          >
            <LeftOutlined />
            Back
          </div>
          <Typography type="span" className="bg-white text-dark px-4 py-1">
            #
            <TransactionText
              text={"16545646486486489781156566544864864615468486471"}
            />
          </Typography>
          <Typography type="title" className="text-primary">
            Card #
            <TransactionText
              text={"16545646486486489781156566544864864615468486471"}
            />
          </Typography>
        </div>
        <div className="flex gap-2 items-start sm:mt-0 mt-4 sm:justify-end justify-between">
          <div className="flex flex-col items-end">
            <div className="text-primary font-bold flex items-center gap-2">
              <MenuOutlined />
              <Typography type="title">0.035</Typography>
            </div>
            <Typography type="subTitle" className="text-white">
              $116.15
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
          <Button
            decoration="fillPrimary"
            className="degradated hover:text-white border-none"
            size="small"
            onClick={sellNft}
          >
            <img
              src={Icons.harmony}
              className="h-6 w-6 rounded-full mr-2"
              alt=""
            />{" "}
            Sell now
          </Button>
        </div>
      </div>
      <div className="w-full flex md:flex-row flex-col mt-10">
        <div className="flex relative justify-center md:w-1/2 xl:px-24">
          <div className="sm:sticky sm:top-32 h-min w-72">
            <img src={Icons.logo} className="w-72" alt="" />
          </div>
        </div>
        <div className="flex flex-col md:w-1/2">
          <div className="flex flex-col">
            <Typography type="title" className="text-primary font-bold">
              About
            </Typography>
            <div className="flex flex-col gap-4 px-10 py-6 border border-primary rounded-xl mt-4">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <Typography
                    type="smallTitle"
                    className="text-white font-bold"
                  >
                    CLASS
                  </Typography>
                  <Typography
                    type="smallTitle"
                    className="text-primary opacity-75"
                  >
                    Earth
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <Typography
                    type="smallTitle"
                    className="text-white font-bold"
                  >
                    BREED COUNT
                  </Typography>
                  <Typography
                    type="smallTitle"
                    className="text-primary opacity-75"
                  >
                    0/7
                  </Typography>
                </div>
              </div>
              <div>
                {" "}
                <div className="flex flex-col">
                  <Typography
                    type="smallTitle"
                    className="text-white font-bold"
                  >
                    OWNER
                  </Typography>
                  <Typography
                    type="smallTitle"
                    className="text-primary opacity-75"
                  >
                    Maria
                    <Typography type="span" className="text-gray-500 pl-2">
                      <AddressText text="one1hhe8ztms7cz2pmxwdm6js9mhna9u9ah6t255q9" />
                    </Typography>
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <Typography type="title" className="text-primary font-bold">
              Stats
            </Typography>
            <div className="grid sm:grid-cols-4 grid-cols-2 items-center px-10 py-6 border border-primary rounded-xl mt-4">
              <div className="flex flex-col">
                <Typography type="smallTitle" className="text-white font-bold">
                  HEALTH
                </Typography>
                <div className="flex items-center font-bold text-primary gap-1">
                  <HeartFilled />
                  45
                </div>
              </div>
              <div className="flex flex-col">
                <Typography type="smallTitle" className="text-white font-bold">
                  SPEED
                </Typography>
                <div className="flex items-center font-bold text-primary gap-1">
                  <ThunderboltFilled />
                  50
                </div>
              </div>
              <div className="flex flex-col">
                <Typography type="smallTitle" className="text-white font-bold">
                  SKILL
                </Typography>
                <div className="flex items-center font-bold text-primary gap-1">
                  <StarFilled />
                  31
                </div>
              </div>
              <div className="flex flex-col">
                <Typography type="smallTitle" className="text-white font-bold">
                  MORALE
                </Typography>
                <div className="flex items-center font-bold text-primary gap-1">
                  <FireFilled />
                  36
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailComponent;
