import React from "react";
import { useRouter } from "next/router";
import { Icons } from "@shared/const/Icons";
import { CopyOutlined, EditOutlined, LoginOutlined } from "@ant-design/icons";
import { convertArrayCards } from "@shared/components/common/convertCards";
import Web3 from "web3";
import { useSelector } from "react-redux";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useWeb3React } from "@web3-react/core";
import packs from "../../../packs.json";
import { Tooltip } from "@mui/material";
import { Button } from "@shared/components/common/button/button";
import { authStillValid } from "@shared/components/utils";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { XIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import { Input } from "@shared/components/common/form/input";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { toast } from "react-hot-toast";
import { useUser } from "@shared/context/useUser";
import clsx from "clsx";
import Link from "next/link";

const ProfileLayout = ({ children }) => {
  const {
    user: { ethAddress: user, providerName },
  } = useUser();
  const { showWallet } = useMagicLink();
  const { account } = useWeb3React();
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [editable, setEditable] = React.useState(false);
  const [userName, setUserName] = React.useState("EG Enthusiast");
  const db = getDatabase();

  React.useEffect(() => {
    if (!account && !user && !authStillValid()) {
      router.push("/login?redirect=true&redirectAddress=/profile");
    }
  }, [account, user]);

  const profileImage = Icons.profile;

  const handleUserForm = (data: any) => {
    set(ref(db, "profile/" + user), data)
      .then(() => {
        toast.success("Your Alias has been changed successfully!");
        setUserName(data.username);
        setEditable(false);
      })
      .catch((e) => {
        toast.error("An error has ocurred, please try again");

        console.log(e);
      });
  };

  React.useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `profile/${user}`))
      .then((userData) => {
        if (userData.exists()) {
          setUserName(userData.val().username);
        } else {
          setUserName("EG Enthusiast");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  const profileItems = [
    { name: "Inventory", link: "/profile" },
    {
      name: "Activity",
      link: "/profile/activity",
    },
    {
      name: "My Sales",
      link: "/profile/sales",
    },
    {
      name: "My Rents",
      link: "/profile/rents",
    },
    {
      name: "Swap",
      link: "/profile/swap",
    },
  ];

  return (
    <div className="flex flex-col py-8">
      <div className="flex flex-col relative mb-20">
        <div className="w-full">
          <img
            src="/images/inventory/banner.svg"
            className="w-full border-b border-overlay-border"
            alt=""
          />
        </div>
        <div className="absolute sm:bottom-[-80px] bottom-[-110px]  sm:left-[120px] left-0 sm:right-auto right-0 mx-auto flex flex-col gap-2 items-center justify-center">
          <div className="flex sm:flex-row flex-col gap-2 items-center">
            <img
              className="md:w-40 w-32 rounded-full border-t border-overlay-border p-2 bg-overlay"
              src={profileImage}
              alt=""
            />{" "}
            <div className="flex sm:flex-row flex-col sm:items-end items-start justify-center sm:pt-10">
              <div className="flex flex-col justify-center items-center">
                {!editable ? (
                  <h2 className="text-white font-bold text-xl flex justify-start items-center gap-2 w-52 overflow-hidden">
                    <EditOutlined
                      className="cursor-pointer text-sm"
                      onClick={() => {
                        setEditable(true);
                      }}
                    />{" "}
                    {userName}
                  </h2>
                ) : (
                  <form
                    onSubmit={handleSubmit(handleUserForm)}
                    className="flex gap-1 items-center justify-center text-white font-bold mt-2 w-60 pr-4"
                  >
                    <XIcon
                      className="cursor-pointer w-6"
                      onClick={() => {
                        setEditable(false);
                      }}
                    />{" "}
                    <Input
                      register={register}
                      name="username"
                      type="text"
                      withoutX
                      classNameContainer="text-[10px] bg-overlay rounded-xl border border-overlay-border px-2"
                      placeholder={userName}
                    />
                    <Button
                      type="submit"
                      className="text-[10px] px-2 py-1 bg-green-button rounded-xl !border-black !text-black hover:!bg-overlay hover:!text-green-button hover:!border-green-button transition-all duration-500"
                    >
                      Save
                    </Button>
                  </form>
                )}
              </div>
              <h2 className="text-primary-disabled font-[500] md:text-[14px] text-[12px] flex items-center gap-2">
                <AddressText text={user} />{" "}
                <CopyOutlined
                  onClick={() => {
                    navigator.clipboard.writeText(user);
                    toast.success("Copied successfully!");
                  }}
                />
              </h2>
              {providerName === "magic" && (
                <Button
                  type="submit"
                  decoration="line-white"
                  className="rounded-xl bg-overlay-2 text-white hover:text-overlay text-[12px] border border-overlay-border py-2 px-4 whitespace-nowrap"
                  onClick={() => showWallet()}
                >
                  Show Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:px-32 px-16">
        <div className="flex gap-4 w-full px-8 py-2">
          {profileItems.map(({ link, name }) => {
            return (
              <Link href={link}>
                <p
                  className={clsx(
                    { "text-white": link === router.asPath },
                    { "text-overlay-border": link !== router.asPath },
                    "text-lg px-4 font-bold cursor-pointer",
                  )}
                >
                  {name}
                </p>
              </Link>
            );
          })}
        </div>
        <img
          src="/images/inventory/border_menu.png"
          className="w-full"
          alt=""
        />
      </div>
      {children}
    </div>
  );
};

export const Activity = ({ date, type, metadata, pack }) => {
  const cards = convertArrayCards();
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
                  : cards[metadata?.tokenId]?.image
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

export default ProfileLayout;
