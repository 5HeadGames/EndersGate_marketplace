import { Typography } from "@shared/components/common/typography";
import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import { CopyOutlined, LoginOutlined, SelectOutlined } from "@ant-design/icons";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { useToasts } from "react-toast-notifications";
import Styles from "./styles.module.scss";
import Link from "next/link";
import { getBalance } from "@shared/web3";
import { convertArrayCards } from "@shared/components/common/convertCards";
import Web3 from "web3";
import { useSelector } from "react-redux";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useWeb3React } from "@web3-react/core";
import Inventory from "../inventory/inventory";
import packs from "../../../packs.json";
import { Tooltip } from "@mui/material";

const ProfileIndexPage = () => {
  const [balance, setBalance] = React.useState("0");
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const { account: user } = useWeb3React();

  console.log(user);

  const loadEvents = async () => {
    // const relation = user.relation("events");
    // const query = relation.query();
    // const activities = await query.find({});
    // setActivities(
    //   activities
    //     .map((act) => ({
    //       createdAt: act.get("createdAt"),
    //       type: act.get("type"),
    //       metadata: JSON.parse(act.get("metadata")),
    //     }))
    //     .sort((a, b) => {
    //       return (
    //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //       );
    //     })
    //     .slice(0, activities.length > 5 ? 5 : activities.length)
    // );
  };

  React.useEffect(() => {
    handleSetBalance();
    loadEvents();
  }, [user]);

  const handleSetBalance = async () => {
    const balance = await getBalance(user);
    setBalance(balance);
  };

  const { addToast } = useToasts();

  const profileImage = Icons.logo;

  return (
    <div className="flex flex-col py-8">
      <div className="flex flex-col relative mb-40">
        <div className="w-full">
          <img
            src="/images/bg_landing.png"
            className="w-full border-b border-overlay-border"
            alt=""
          />
        </div>
        <div className="absolute bottom-[-120px] left-[120px] flex flex-col gap-2 items-center justify-center">
          <img
            className="md:w-40 w-32 rounded-full border-t border-overlay-border p-2 bg-overlay"
            src={profileImage}
            alt=""
          />{" "}
          <h2 className="mt-2 text-white font-bold md:text-2xl text-lg">
            {"EG Enthusiast"}
          </h2>{" "}
        </div>
      </div>
      <Inventory />
    </div>
  );
};

export const Activity = ({ date, type, metadata, pack }) => {
  const cards = convertArrayCards();
  console.log("metadata", metadata);
  return (
    <a
      href={`https://explorer.harmony.one/tx/${metadata.transactionHash}`}
      target="_blank"
      rel="noreferrer"
      className="flex justify-between cursor-pointer sm:gap-4 gap-2 text-primary items-primary sm:px-10"
    >
      <div className="flex gap-4">
        {type === "login" && (
          <div className="p-4 rounded-xl border border-overlay-border flex items-center relative w-20 h-20">
            <div className="text-xl h-6 w-6 flex items-center justify-center">
              <LoginOutlined />
            </div>
          </div>
        )}
        {type !== "login" && (
          <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-16 w-16">
            <img
              src={
                pack
                  ? packs[metadata?.tokenId]?.properties?.image?.value
                  : cards[metadata?.tokenId]?.properties.image?.value
              }
              className={`absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto min-w-[175%]`}
              alt=""
            />
          </div>
        )}

        <div className="flex items-center justify-center text-white lg:text-xl text-md font-bold">
          {type === "login" && "You loged in for first time"}
          {type === "buy" &&
            `You have bought ${metadata?.amount} ${
              cards[metadata?.tokenId].properties.name.value
            } at ${Web3.utils.fromWei(metadata?.bid)} ONE`}
          {type === "sell" &&
            `You have listed ${metadata?.amount} ${
              cards[metadata?.tokenId].properties.name.value
            } at ${Web3.utils.fromWei(metadata?.startingPrice)} ONE`}
          {type === "cancel" && "You have cancelled a sale"}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Tooltip title="View on explorer">
          <div className="hover:text-red-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </div>
        </Tooltip>
        <div className="flex flex-col items-center justify-center text-sm w-40 font-bold">
          <div>
            {new Date(date).getUTCHours()}:
            {new Date(date).getUTCMinutes() < 10
              ? `0${new Date(date).getUTCMinutes()}`
              : new Date(date).getUTCMinutes()}
          </div>
          <div>
            {new Date(date).getMonth() + 1}-{new Date(date).getDate()}-
            {new Date(date).getFullYear()}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProfileIndexPage;
