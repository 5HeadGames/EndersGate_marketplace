import React from "react";
import {
  AppstoreOutlined,
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretUpOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

import NftCard from "shared/components/Marketplace/itemCard";
import FiltersBoard from "./filters/filters";
import { DropdownActions } from "../common/dropdownActions/dropdownActions";
import { Dropdown } from "../common/dropdown/dropdown";
import clsx from "clsx";
import { Typography } from "../common/typography";
import { getAddresses, getContract } from "@shared/web3";
import { onLoadSales } from "@redux/actions";
import { convertArrayCards } from "../common/convertCards";
import packs from "../../packs.json";
import { useAppDispatch, useAppSelector } from "@redux/store";
import Link from "next/link";
import Web3 from "web3";
import Styles from "./itemCard/styles.module.scss";
import { Icons } from "@shared/const/Icons";
import { AddressText } from "../common/specialFields/SpecialFields";
import TransactionsBoard from "../Dashboard/TransactionsBoard/TransactionsBoard";
import { useStats } from "@shared/hooks/useStats";
import { Newsletter } from "../common/footerComponents/newsletter";
import { JoinTheCommunity } from "../common/footerComponents/joinTheCommunity";
import { GetStarted } from "../common/footerComponents/getStarted";
import Partners from "../common/footerComponents/partners";
import { XIcon } from "@heroicons/react/solid";

const MarketplaceComponent = () => {
  const [currentOrder, setCurrentOrder] = React.useState("recently_listed");
  const [type, setType] = React.useState("trading_cards");
  const [cardType, setCardType] = React.useState("all");
  const [sales, setSales] = React.useState([]);
  const { nfts } = useAppSelector((state) => state);
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState<any>("");
  const [openFilters, setOpenFilters] = React.useState(true);

  const [columnSelected, setColumnSelected] = React.useState("forever");
  const [listedSelected, setListedSelected] = React.useState("trading_cards");
  const [soldSelected, setSoldSelected] = React.useState("trading_cards");
  const { search: searched } = useRouter().query;
  const cards = convertArrayCards();

  const { transactionsBoard } = useStats({
    nfts,
    listedSelected,
    soldSelected,
    columnSelected,
  });

  const orderMapper = {
    lowest_price: "Price: Low to High",
    highest_price: "Price: High to Low",
    recently_listed: "Recent to Older",
    older_listed: "Older to Recent",
  };

  React.useEffect(() => {
    getSales(currentOrder);
  }, [currentOrder]);

  React.useEffect(() => {
    if (searched) {
      setSearch(searched);
    }
  }, [searched]);

  const getSales = async (currentOrder: string) => {
    const { endersGate, pack } = getAddresses();
    const cardSalesCreated = [];
    const packSalesCreated = [];
    nfts.saleCreated.forEach((sale) => {
      if (sale.nft == endersGate) {
        cardSalesCreated.push(sale);
      } else if (sale.nft == pack) {
        packSalesCreated.push(sale);
      }
    });

    if (currentOrder === "recently_listed") {
      switch (type) {
        case "trading_cards":
          setSales(cardSalesCreated.reverse());
          break;
        case "packs":
          setSales(packSalesCreated.reverse());
          break;
        default:
          setSales(nfts.saleCreated.reverse());
          break;
      }
      // const salesCreated: any[] = [...cardSalesCreated];
      // setSales(salesCreated.reverse());
    } else if (currentOrder === "older_listed") {
      switch (type) {
        case "trading_cards":
          setSales(cardSalesCreated);
          break;
        case "packs":
          setSales(packSalesCreated);
          break;
        default:
          setSales(nfts.saleCreated);
          break;
      }
    } else if (currentOrder === "lowest_price") {
      switch (type) {
        case "trading_cards":
          setSales(
            cardSalesCreated.sort(
              (a, b) => parseFloat(a.price) - parseFloat(b.price),
            ),
          );
          break;
        case "packs":
          setSales(
            packSalesCreated.sort(
              (a, b) => parseFloat(a.price) - parseFloat(b.price),
            ),
          );
          break;
        default:
          setSales(nfts.saleCreated);
          break;
      }
    } else if (currentOrder === "highest_price") {
      switch (type) {
        case "trading_cards":
          setSales(
            cardSalesCreated.sort(
              (a, b) => parseFloat(b.price) - parseFloat(a.price),
            ),
          );
          break;
        case "packs":
          setSales(
            packSalesCreated.sort(
              (a, b) => parseFloat(b.price) - parseFloat(a.price),
            ),
          );
          break;
        default:
          setSales(nfts.saleCreated);
          break;
      }
    }
  };

  React.useEffect(() => {
    const cardSalesCreated = [];
    const packSalesCreated = [];
    const { endersGate, pack } = getAddresses();
    nfts.saleCreated.forEach((sale) => {
      if (sale.nft == endersGate) {
        cardSalesCreated.push(sale);
      } else if (sale.nft == pack) {
        packSalesCreated.push(sale);
      }
    });
    switch (type) {
      case "trading_cards":
        setSales(cardSalesCreated);
        break;
      case "packs":
        setSales(packSalesCreated);
        break;
      default:
        setSales(nfts.saleCreated);
        break;
    }
  }, [type, nfts]);

  const [filters, setFilters] = React.useState({
    avatar: [],
    cardRole: [],
    cardRace: [],
    cardElement: [],
  });

  const filterCards = (card) => {
    let passed = false;
    if (cardType === "all") {
      if (
        filters.avatar.length === 0 &&
        filters.cardRace.length === 0 &&
        filters.cardRole.length === 0 &&
        filters.cardElement.length === 0
      ) {
        return true;
      }
      if (filters.cardElement.length > 0) {
        if (
          filters.cardElement?.includes(
            card?.properties?.element?.value?.toLowerCase(),
          )
        ) {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.cardRace.length > 0) {
        if (
          filters.cardRace?.includes(
            card?.properties?.race?.value?.toLowerCase(),
          )
        ) {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.cardRole.length > 0) {
        if (
          filters.cardRole?.includes(
            card?.properties?.role?.value?.toLowerCase(),
          )
        ) {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.avatar.length > 0) {
        if (filters.avatar?.includes("avatars")) {
          if (card?.typeCard === "avatar") {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar?.includes("guardians")) {
          if (card?.properties?.isGuardian?.value === true) {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar?.includes("reaction cards")) {
          if (card.typeCard == "reaction") {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar?.includes("action cards")) {
          if (card.typeCard == "action") {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar?.includes("ghost cards")) {
          if (card?.name === "Shinobi Guardian") {
            passed = true;
          } else {
            return false;
          }
        }
      }
    } else {
      if (cardType === card.typeCard) {
        if (
          filters.avatar.length === 0 &&
          filters.cardRace.length === 0 &&
          filters.cardRole.length === 0 &&
          filters.cardElement.length === 0
        ) {
          return true;
        }
        if (filters.cardElement.length > 0) {
          if (
            filters.cardElement?.includes(
              card?.properties?.element?.value?.toLowerCase(),
            )
          ) {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.cardRace.length > 0) {
          if (
            filters.cardRace?.includes(
              card?.properties?.race?.value?.toLowerCase(),
            )
          ) {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.cardRole.length > 0) {
          if (
            filters.cardRole?.includes(
              card?.properties?.role?.value?.toLowerCase(),
            )
          ) {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar.length > 0) {
          if (filters.avatar?.includes("avatars")) {
            if (card?.properties?.isGuardian?.value === true) {
              passed = true;
            } else {
              return false;
            }
          }
          if (filters.avatar?.includes("guardians")) {
            if (card?.properties?.isGuardian?.value === true) {
              passed = true;
            } else {
              return false;
            }
          }
          if (filters.avatar?.includes("reaction cards")) {
            if (card.typeCard == "reaction") {
              passed = true;
            } else {
              return false;
            }
          }
          if (filters.avatar?.includes("action cards")) {
            if (card.typeCard == "reaction") {
              passed = true;
            } else {
              return false;
            }
          }
          if (filters.avatar?.includes("ghost cards")) {
            if (card?.name === "Shinobi Guardian") {
              passed = true;
            } else {
              return false;
            }
          }
        }
      }
    }
    if (search === "") {
      return passed;
    } else if (card?.name.toLowerCase().includes(search.toLowerCase())) {
      return passed;
    } else {
      return false;
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col min-h-screen pt-36 pb-10 gap-8 w-full">
        <div className="flex w-full lg:px-20 px-4">
          <TransactionsBoard
            totalSale={transactionsBoard.totalSale}
            totalVolume={transactionsBoard.totalVolume}
            cardsSold={transactionsBoard.cardsSold}
            packsSold={transactionsBoard.packsSold}
            columnSelected={columnSelected}
            setColumnSelected={setColumnSelected}
          />
        </div>
        <div className="w-full flex justify-between items-center sm:flex-row flex-col gap-10 lg:px-20 px-4">
          <div
            className="flex justify-center items-center cursor-pointer rounded-md border border-overlay-border bg-overlay-2 p-3 text-red-primary hover:text-orange-500"
            onClick={() => setOpenFilters((prev) => !prev)}
          >
            {openFilters ? <CaretLeftOutlined /> : <CaretDownOutlined />}
            <Typography type="subTitle" className="ml-2 text-lg">
              Filters
            </Typography>
          </div>
          <div className="border flex items-center text-lg justify-center border-overlay-border bg-overlay-2 rounded-xl w-full">
            <div className="text-white flex items-center w-full py-3 px-4 rounded-xl bg-overlay border-r border-overlay-border">
              <input
                type="text"
                className="text-white w-full bg-transparent focus:outline-none"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <div
                className="text-white cursor-pointer flex items-center"
                onClick={() => setSearch("")}
              >
                <XIcon color="#fff" width={"16px"} />
              </div>
            </div>
            <div className="text-white text-xl flex items-center justify-center px-2">
              <SearchOutlined />
            </div>
          </div>
          <div className="flex">
            <DropdownActions
              title={orderMapper[currentOrder]}
              actions={[
                {
                  label: "Price: Low to High",
                  onClick: () => setCurrentOrder("lowest_price"),
                },
                {
                  label: "Price: High to Low",
                  onClick: () => setCurrentOrder("highest_price"),
                },
                {
                  label: "Recent to Older",
                  onClick: () => setCurrentOrder("recently_listed"),
                },
                {
                  label: "Older to Recent",
                  onClick: () => setCurrentOrder("older_listed"),
                },
              ]}
            />
          </div>
        </div>
        <div className="w-full h-[1px] bg-overlay-border"></div>
        <div className="w-full flex xl:flex-row flex-col lg:px-20 px-4">
          <div
            className={clsx(
              { ["flex xl:w-auto w-full"]: openFilters },
              { ["hidden"]: !openFilters },
            )}
          >
            <FiltersBoard
              filters={filters}
              setFilters={setFilters}
              setCardType={setCardType}
              cardType={cardType}
              setPage={setPage}
              type={type}
              setType={setType}
            />
          </div>
          <div className="w-full xl:mt-0 mt-6 flex flex-col pb-10">
            <div>
              <div className="flex flex-wrap w-full justify-center items-center relative">
                {sales
                  ?.filter((sale, i) =>
                    type !== "packs"
                      ? filterCards(cards[sale.nftId])
                      : filterCards(packs[sale.nftId]),
                  )
                  .filter((sale) => {
                    return (
                      Math.floor(new Date().getTime() / 1000) <=
                      parseInt(sale?.duration) + parseInt(sale?.startedAt)
                    );
                  })
                  .filter((sale, i) => i < (page + 1) * 12 && i >= page * 12) >
                0 ? (
                  sales
                    ?.filter((sale, i) =>
                      type !== "packs"
                        ? filterCards(cards[sale.nftId])
                        : filterCards(packs[sale.nftId]),
                    )
                    .filter((sale) => {
                      return (
                        Math.floor(new Date().getTime() / 1000) <=
                        parseInt(sale?.duration) + parseInt(sale?.startedAt)
                      );
                    })
                    .filter((sale, i) => i < (page + 1) * 12 && i >= page * 12)
                    .map((a, id) => {
                      return type !== "packs" ? (
                        <NftCard
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
                                    Pack #
                                    {a.nftId !== undefined ? a.nftId : "12345"}
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
                                      {packs[a.nftId]?.properties?.name
                                        ?.value || "Enders Gate"}
                                    </span>
                                    <span
                                      className="text-[12px] text-gray-500 font-medium"
                                      style={{ lineHeight: "10px" }}
                                    >
                                      Owner:{" "}
                                      {<AddressText text={a.seller} /> ||
                                        "Owner"}
                                    </span>
                                  </div>
                                  <img
                                    src={Icons.logo}
                                    className="w-10 h-10"
                                    alt=""
                                  />
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
                                          {Web3.utils.fromWei(a.price, "ether")}{" "}
                                          ONE
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col text-md font-medium">
                                      <p>Highest Bid:</p>
                                      <span>
                                        {Web3.utils.fromWei(a.price, "ether")}{" "}
                                        ONE
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4 text-xl">
                    <img src={Icons.logoCard} className="w-40 h-40" alt="" />
                    There aren't sales for this search, try with other.
                  </div>
                )}
                {sales
                  ?.filter((sale, i) =>
                    type !== "packs"
                      ? filterCards(cards[sale.nftId])
                      : filterCards(packs[sale.nftId]),
                  )
                  .filter((sale) => {
                    return (
                      Math.floor(new Date().getTime() / 1000) <=
                      parseInt(sale?.duration) + parseInt(sale?.startedAt)
                    );
                  }).length > 12 && (
                  <div className="flex w-full items-center justify-center gap-2">
                    <div
                      className="rounded-full flex items-center bg-secondary text-white p-4 cursor-pointer"
                      onClick={() => {
                        if (page > 0) {
                          setPage((prev) => {
                            return prev - 1;
                          });
                        }
                      }}
                    >
                      <LeftOutlined></LeftOutlined>
                    </div>
                    <div className="p-3 px-5 flex items-center justify-center rounded-full bg-overlay border border-primary text-primary">
                      {page + 1}
                    </div>
                    <div
                      className="rounded-full flex items-center bg-secondary text-white p-4 cursor-pointer"
                      onClick={() => {
                        if (
                          page <
                          Math.floor(
                            (sales
                              .filter((sale, i) =>
                                type !== "packs"
                                  ? filterCards(cards[sale.nftId])
                                  : filterCards(packs[sale.nftId]),
                              )
                              .filter((sale) => {
                                return (
                                  Math.floor(new Date().getTime() / 1000) <=
                                  parseInt(sale?.duration) +
                                    parseInt(sale?.startedAt)
                                );
                              }).length -
                              1) /
                              12,
                          )
                        ) {
                          setPage((prev) => {
                            return prev + 1;
                          });
                        }
                      }}
                    >
                      <RightOutlined></RightOutlined>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default MarketplaceComponent;
