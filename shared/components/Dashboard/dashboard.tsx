import React from "react";

import { useAppDispatch, useAppSelector } from "@redux/store";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";
import { getAddresses, getContract } from "@shared/web3";
import cardsJson from "../../../cards.json";
import { TimeConverter } from "../common/unixDateConverter/unixConverter";
import Web3 from "web3";
import packs from "../../packs.json";
import Styles from "../Marketplace/itemCard/styles.module.scss";
import { useStats } from "@shared/hooks/useStats";
import NFTCard from "../Marketplace/itemCard";
import Link from "next/link";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import { AddressText } from "../common/specialFields/SpecialFields";
import { convertArrayCards } from "../common/convertCards";
import { Dropdown } from "../common/dropdown/dropdown";
import { Newsletter } from "../common/footerComponents/newsletter";
import { JoinTheCommunity } from "../common/footerComponents/joinTheCommunity";
import { GetStarted } from "../common/footerComponents/getStarted";
import Partners from "../common/footerComponents/partners";

const DashboardComponent = () => {
  const [columnSelected, setColumnSelected] = React.useState("last_7d");
  const [listedSelected, setListedSelected] = React.useState("trading_cards");
  const [soldSelected, setSoldSelected] = React.useState("trading_cards");
  const { nfts } = useAppSelector((state) => state);
  const cards = convertArrayCards();

  const { recentlyListed, recentlySold } = useStats({
    nfts,
    listedSelected,
    soldSelected,
    columnSelected,
  });

  const { recentlyListed: recentlyListedCards } = useStats({
    nfts,
    listedSelected: "trading_cards",
    soldSelected: "trading_cards",
    columnSelected,
  });

  const { pack } = getAddresses();

  const [sales, setSales] = React.useState(recentlySold);
  const [salesDefault, setSalesDefault] = React.useState(recentlyListedCards);
  const [salesType, setSalesType] = React.useState("Recently Sold");

  React.useEffect(() => {
    if (salesType === "Recently Sold") {
      setSales(recentlySold);
    } else {
      setSales(recentlyListed);
    }
  }, [recentlyListed, recentlySold, salesType]);

  React.useEffect(() => {
    setSalesDefault(recentlyListedCards);
  }, [recentlyListedCards]);

  const [counter, setCounter] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCount) => {
        return prevCount < 60 ? prevCount + 1 : 0;
      }); // <-- Change this line!
    }, 1500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div className="min-h-screen relative flex flex-col">
        <div className="max-w-[100vw] overflow-hidden h-[100vh] bg-overlay relative flex items-center">
          <img
            src="/images/bg_landing.svg"
            className={`absolute min-w-[165vw] max-h-[85vh] top-0 banner border-b border-overlay-border`}
            alt=""
          />
          <div className="flex flex-col pt-36 w-full items-center h-screen relative gap-2 border-b border-overlay-border xl:px-32 lg:px-24 md:px-16 px-8 text-white">
            <div className="max-w-[1200px] w-full flex justify-between">
              <div className="flex flex-col gap-8 md:w-1/2">
                <h1 className="text-5xl flex flex-col font-bold">
                  Discover, collect, buy or sell <br /> Endersgate NFTs
                </h1>
                <p className="text-2xl font-[450]  text-primary-disabled w-[360px]">
                  The Enders Gate Marketplace is <br />
                  <span className="text-red-primary font-bold">5</span>
                  <span className="text-white font-bold">HEADGAMES</span>{" "}
                  Studio's dedicated NFT marketplace.
                </p>
              </div>
              <div className="xl:w-1/2 flex items-end justify-end">
                {salesDefault.map((a, id) => {
                  return (
                    id === 0 && (
                      <NFTCard
                        classes={{ root: "m-4 cursor-pointer" }}
                        id={a.nftId}
                        transactionId={a.id}
                        seller={a.seller}
                        icon={cards[a.nftId].properties.image.value}
                        name={cards[a.nftId].properties.name.value}
                        byId={false}
                        price={a.price}
                      />
                    )
                  );
                })}
              </div>
            </div>
            <h1 className="max-w-[1200px] w-full">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
              officia aperiam voluptatum eius, ipsum sequi? Praesentium,
              perspiciatis itaque iusto deleniti vero laboriosam quibusdam
              assumenda. Quas, omnis doloribus. Perspiciatis, blanditiis vel.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
              repellendus voluptatem totam ad repudiandae assumenda itaque hic,
              quo quae laborum est sit fugit eum minus optio, alias amet, aut
              quibusdam?
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col md:px-16 min-h-screen bg-overlay px-4 pb-6">
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex items-center justify-center w-full text-xl text-primary gap-1 font-bold">
            Browse{" "}
            <Dropdown
              classTitle={"text-red-primary hover:text-orange-500"}
              title={salesType}
            >
              <div className="flex flex-col rounded-md border border-overlay-border">
                {["Recently Listed", "Recently Sold"].map((item) => (
                  <div
                    className="p-4 text-center font-bold hover:text-orange-500 text-primary whitespace-nowrap cursor-pointer"
                    onClick={() => setSalesType(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Dropdown>
          </div>
          <div className="flex flex-wrap w-full justify-center items-center relative">
            {sales.map((a, id) => {
              return a.nft.toLowerCase() !== pack.toLowerCase() ? (
                <NFTCard
                  classes={{ root: "m-4 cursor-pointer" }}
                  id={a.nftId}
                  transactionId={a.id}
                  seller={a.seller}
                  icon={cards[a.nftId].properties.image.value}
                  name={cards[a.nftId].properties.name.value}
                  byId={false}
                  price={a.price}
                />
              ) : (
                <Link href={`/NFTDetailSale/${a.id}`}>
                  <div
                    className={clsx(
                      "rounded-xl flex flex-col text-gray-100 w-96 bg-secondary cursor-pointer relative overflow-hidden border border-gray-500 m-4 cursor-pointer",
                      Styles.cardHover,
                    )}
                  >
                    <img
                      src={packs[a.nftId]?.properties?.image?.value}
                      className="absolute top-[-40%] bottom-0 left-[-5%] right-0 margin-auto opacity-50 min-w-[110%]"
                      alt=""
                    />
                    <div className="flex flex-col relative">
                      <div className="w-full flex flex-col text-xs gap-1">
                        <div className="w-full text-lg flex justify-between rounded-xl p-2 bg-secondary">
                          <span>
                            Pack #{a.nftId !== undefined ? a.nftId : "12345"}
                          </span>
                          {<span>#{a.id}</span>}
                        </div>
                      </div>
                      <div className="w-full h-72 flex justify-center items-center my-6">
                        <img
                          src={
                            packs[a.nftId]?.properties?.image?.value ||
                            Icons.logo
                          }
                          className={
                            packs[a.nftId]?.properties?.image?.value
                              ? "h-64"
                              : "h-24"
                          }
                        />
                      </div>
                      <div className="flex flex-col rounded-xl bg-secondary w-full px-4 pb-3 relative">
                        <div className="flex text-lg font-bold text-left py-2 ">
                          <div className="w-40 relative">
                            <img
                              src="icons/card_logo.svg"
                              className="w-40 absolute top-[-60px]"
                              alt=""
                            />
                          </div>
                          <div className="w-full flex flex-col">
                            <span className="uppercase text-white text-lg">
                              {packs[a.nftId]?.properties?.name?.value ||
                                "Enders Gate"}
                            </span>
                            <span
                              className="text-[12px] text-gray-500 font-medium"
                              style={{ lineHeight: "10px" }}
                            >
                              Owner:{" "}
                              {<AddressText text={a.seller} /> || "Owner"}
                            </span>
                          </div>
                          <img src={Icons.logo} className="w-10 h-10" alt="" />
                        </div>
                        {a.price && (
                          <div
                            className="flex justify-between text-md text-white "
                            style={{ lineHeight: "18px" }}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src="/icons/HARMONY.svg"
                                className="h-8 w-8"
                                alt=""
                              />
                              <div className="flex flex-col text-md font-medium">
                                <p>Price:</p>
                                <span>
                                  {Web3.utils.fromWei(a.price, "ether")} ONE
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col text-md font-medium">
                              <p>Highest Bid:</p>
                              <span>
                                {Web3.utils.fromWei(a.price, "ether")} ONE
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center justify-center">
            <Link href={"/marketplace"}>
              <div className="p-3 px-6 hover:bg-overlay-2 hover:text-primary hover:transition-all ease-in-out delay-150  bg-overlay border border-overlay-border text-overlay-border rounded-md cursor-pointer">
                Browse More
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <Newsletter />
        <JoinTheCommunity />
        <GetStarted />
        <Partners />
      </div>
    </>
  );
};

export default DashboardComponent;
