import { Typography } from "@shared/components/common/typography";
import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useMoralis } from "react-moralis";
import { Icons } from "@shared/const/Icons";
import { CopyOutlined, LoginOutlined, SelectOutlined } from "@ant-design/icons";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { useToasts } from "react-toast-notifications";
import Styles from "./styles.module.scss";
import Link from "next/link";
import { getBalance } from "@shared/web3";
import { convertArrayCards } from "@shared/components/common/convertCards";
import Web3 from "web3";
import { Button } from "@shared/components/common/button/button";
import Inventory from "../inventory/inventory";

const ProfileIndexPage = () => {
  const [balance, setBalance] = React.useState("0");
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const { user, isAuthenticated } = useMoralis();
  const router = useRouter();

  const loadEvents = async () => {
    const relation = user.relation("events");
    const query = relation.query();

    const activities = await query.find({});
    setActivities(
      activities
        .map((act) => ({
          createdAt: act.get("createdAt"),
          type: act.get("type"),
          metadata: JSON.parse(act.get("metadata")),
        }))
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
        .slice(0, activities.length > 5 ? 5 : activities.length),
    );
  };

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    handleSetBalance();
    loadEvents();
  }, [user]);

  const handleSetBalance = async () => {
    const balance = await getBalance(user?.get("ethAddress"));
    setBalance(balance);
  };

  const { addToast } = useToasts();

  const profileImage = user?.get("profileImage")
    ? user.get("profileImage").url()
    : Icons.logo;

  return (
    <div className="flex flex-col py-8">
      <div className="flex flex-col relative mb-28">
        <div className="w-full">
          <img
            src="/images/bg_landing.png"
            className="w-full border-b border-overlay-border"
            alt=""
          />
        </div>
        <img
          className="w-40 rounded-full border-t border-overlay-border p-2 bg-overlay absolute bottom-[-80px] left-[100px]"
          src={profileImage}
          alt=""
        />
      </div>
      <Inventory />
    </div>
  );
};

export const Activity = ({ date, type, metadata }) => {
  const cards = convertArrayCards();
  return (
    <a
      href={`https://explorer.harmony.one/tx/${metadata.transactionHash}`}
      target="_blank"
      rel="noreferrer"
      className="flex cursor-pointer sm:gap-4 gap-2 text-primary items-primary sm:px-10"
    >
      <div className="flex flex-col items-center justify-center text-sm">
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
      <div className="bg-overlay-border p-4 rounded-full flex items-center">
        {type === "login" && (
          <div className="text-xl h-6 w-6 flex items-center justify-center">
            <LoginOutlined />
          </div>
        )}
        {type !== "login" && (
          <img className="h-6 w-6" src={Icons.logo} alt="" />
        )}
      </div>

      <div className="flex items-center justify-center">
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
    </a>
  );
};

export default ProfileIndexPage;
