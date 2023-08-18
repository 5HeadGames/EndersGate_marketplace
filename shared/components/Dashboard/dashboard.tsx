import React from "react";

import { useAppDispatch, useAppSelector } from "@redux/store";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";
import { getAddressesMatic, getContract } from "@shared/web3";
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
import { Button } from "../common/button/button";
import NFTCardSlider from "../Marketplace/itemCard/cardSliderMain";
import { SliderMain } from "./sliderMain";
import { Zoom, Navigation } from "swiper";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

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

  const { pack } = getAddressesMatic();

  const [sales, setSales] = React.useState(recentlySold);
  const [salesDefault, setSalesDefault] = React.useState(recentlyListedCards);
  const [salesType, setSalesType] = React.useState("Recently Listed");

  React.useEffect(() => {
    if (salesType === "Recently Sold") {
      setSales(recentlySold);
    } else {
      setSales(recentlyListed);
    }
  }, [recentlyListed, recentlySold, salesType]);

  React.useEffect(() => {
    setSalesDefault(recentlyListedCards.filter((row, i) => i < 4));
  }, [recentlyListedCards]);

  return (
    <>
      <div className="min-h-screen relative flex flex-col">
        <div className="max-w-[100vw] overflow-hidden min-h-[100vh] bg-overlay relative flex items-center">
          <img
            src="/images/bg_landing.svg"
            className={`absolute 2xl:min-w-[165vw] lg:min-w-[250vw] min-w-[350vw] lg:max-h-[85vh] top-0 banner border-b border-overlay-border`}
            alt=""
          />
          <div className="flex flex-col pt-24 w-full items-center lg:min-h-screen relative gap-4 border-b border-overlay-border xl:px-32 lg:px-24 md:px-16 xs:px-8 text-white">
            <div className="max-w-[1000px] xl:px-10 w-full flex justify-center relative lg:min-h-[350px]">
              <div className="flex flex-col lg:items-start items-center gap-8 lg:pr-[250px] w-full lg:pl-0 sm:pl-16 sm:pr-16 pl-2 pr-2">
                <h1 className="lg:text-3xl text-3xl flex flex-col font-bold w-full lg:text-left text-center">
                  Discover, collect, buy or sell Endersgate NFTs
                </h1>
                <p className="lg:text-2xl text-lg font-[450] text-primary-disabled w-[360px] lg:text-left text-center">
                  The Enders Gate Marketplace is <br />
                  <span className="text-red-primary font-bold">5</span>
                  <span className="text-white font-bold">HEADGAMES</span>{" "}
                  Studio's dedicated NFT marketplace.
                </p>
                <div className="flex flex-col gap-1">
                  <Link href={"/marketplace"}>
                    <Button
                      // type="submit"
                      decoration="line-white"
                      className="rounded-xl bg-overlay text-primary-disabled hover:text-white hover:!bg-overlay-2 transition duration-500 text-[20px] border hover:border-overlay border-overlay-border py-3 px-10"
                    >
                      Explore
                    </Button>
                  </Link>
                  <a
                    href="https://www.endersgate.one/legal#marketplace"
                    className="text-sm text-red-primary"
                  >
                    {"> "}Learn more about EG Marketplace
                  </a>
                </div>
              </div>
              <div className="lg:block hidden w-[485px] items-end justify-end absolute right-0">
                <SliderMain
                  cards={cards}
                  salesDefault={salesDefault}
                ></SliderMain>
              </div>
            </div>
            <div className="max-w-[1200px] w-full flex flex-col gap-4 items-center min-h-[400px] pb-10">
              <h2 className="font-bold text-white text-xl w-full text-center">
                Enders Gate Drops
              </h2>
              <div className="w-full flex justify-center">
                <Swiper
                  slidesPerView={2}
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={(swiper) => console.log(swiper)}
                  zoom={true}
                  navigation={{
                    enabled: true,
                    // nextEl: ".swiper-button-next",
                    // prevEl: ".swiper-button-prev",
                  }}
                  initialSlide={0}
                  modules={[Zoom, Navigation]}
                  className="mySwiper w-full"
                  spaceBetween={10}
                  breakpoints={{
                    700: {
                      slidesPerView: 2,
                      centeredSlides: false,
                    },
                    100: {
                      slidesPerView: 1,
                      centeredSlides: true,
                    },
                  }}
                >
                  <SwiperSlide
                    className="xl:block !w-full hidden"
                    style={{ width: "100%!important", marginRight: "0px" }}
                  >
                    <div className="!w-full flex items-center justify-center gap-2">
                      {[
                        {
                          name: "Gen 0 Pack Drop",
                          description:
                            "Enjoy +230 Unique hand drawn playing cards.",
                          image: "/images/gen0_pack.png",
                          link: "https://www.endersgate.gg/shop",
                        },
                        // {
                        //   name: "EG NFT Comics",
                        //   description:
                        //     "Collect the lore & enjoy original stories.",
                        //   image: "/images/comic_pack.png",
                        // },
                      ]?.map(({ name, description, image, link }: any) => {
                        return (
                          // <SwiperSlide>
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center justify-center h-[400px] sm:max-w-[350px] overflow-hidden shrink-0"
                          >
                            {/* <div className="px-4"> */}
                            <div className="bg-secondary rounded-xl border border-overlay-border h-[390px] sm:max-w-[350px] flex items-end overflow-hidden w-full">
                              <img
                                src={image}
                                className="absolute sm:max-w-[350px] w-full h-[390px]"
                                alt=""
                              />
                              <div className="p-4 flex items-center justify-center relative sm:min-w-[400px] max-w-[350px] w-full rounded-xl bg-secondary border border-secondary gap-2">
                                <img
                                  src={Icons.logo}
                                  className="w-12 h-12"
                                  alt=""
                                />
                                <div className="w-full flex flex-col">
                                  <h2 className="font-bold text-white text-xl">
                                    {name}
                                  </h2>
                                  <p
                                    className="text-primary-disabled text-md w-[75%]"
                                    style={{ lineHeight: "16px" }}
                                  >
                                    {description}
                                  </p>
                                </div>
                              </div>
                              {/* </div> */}
                            </div>
                          </a>
                          // </SwiperSlide>
                        );
                      })}
                    </div>
                  </SwiperSlide>
                  {[
                    {
                      name: "Gen 0 Pack Drop",
                      description:
                        "Enjoy +230 Unique hand drawn playing cards.",
                      image: "/images/gen0_pack.png",
                      link: "https://www.endersgate.gg/shop",
                    },
                    // {
                    //   name: "EG NFT Comics",
                    //   description: "Collect the lore & enjoy original stories.",
                    //   image: "/images/comic_pack.png",
                    //   link: "https://www.endersgate.gg/shop",
                    // },
                  ]?.map(({ name, description, image, link }: any) => {
                    return (
                      <SwiperSlide className="xl:hidden flex">
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col items-center justify-center h-[450px] max-w-[400px] overflow-hidden"
                        >
                          <div className="bg-secondary rounded-xl border border-overlay-border h-[440px] max-w-[400px] flex items-end overflow-hidden w-full">
                            <img
                              src={image}
                              className="absolute max-w-[400px] w-full h-[440px]"
                              alt=""
                            />
                            <div className="p-4 flex items-center justify-center relative max-w-[400px] w-full rounded-xl bg-secondary border border-secondary gap-2">
                              <img
                                src={Icons.logo}
                                className="w-12 h-12"
                                alt=""
                              />
                              <div className="w-full flex flex-col">
                                <h2 className="font-bold text-white text-xl">
                                  {name}
                                </h2>
                                <p
                                  className="text-primary-disabled text-md w-[75%]"
                                  style={{ lineHeight: "16px" }}
                                >
                                  {description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col lg:px-16 min-h-screen bg-overlay px-2 pb-6">
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
          <div className="flex flex-wrap w-full justify-center items-center relative md:px-40">
            {sales.map((sale, id) => {
              return (
                <NFTCard
                  classes={{ root: "m-4 cursor-pointer" }}
                  icon={
                    sale.nft === pack
                      ? packs[sale.nftId]?.properties?.image?.value
                      : cards[sale.nftId]?.properties?.image?.value
                  }
                  name={
                    sale.nft === pack
                      ? packs[sale.nftId]?.properties?.name?.value
                      : cards[sale.nftId]?.properties?.name?.value
                  }
                  byId={false}
                  sale={sale}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-center">
            <Link href={"/marketplace"}>
              <p className="p-3 px-6 font-[450] hover:bg-overlay-2 hover:text-primary hover:transition-all ease-in-out delay-150  bg-overlay border border-overlay-border text-overlay-border rounded-md cursor-pointer">
                Browse More
              </p>
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
