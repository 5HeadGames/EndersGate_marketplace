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
import { getAddressesMatic, getContract, isPack } from "@shared/web3";
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
import { OpenseaApiService } from "@shared/api/opensea/openseaServices";
import { filterCards, filterPacks } from "@shared/utils/filtersCards";

const MarketplaceComponent = () => {
  const [currentOrder, setCurrentOrder] = React.useState("recently_listed");
  const [type, setType] = React.useState("");
  const [cardType, setCardType] = React.useState("all");
  const [sales, setSales] = React.useState([]);
  const { nfts } = useAppSelector((state) => state);
  const [page, setPage] = React.useState(0);
  const [priceSettings, setPriceSettings] = React.useState({
    minPrice: 0,
    maxPrice: 0,
  });
  const [search, setSearch] = React.useState<any>("");
  const [openFilters, setOpenFilters] = React.useState(true);

  const [columnSelected, setColumnSelected] = React.useState("forever");
  const [listingType, setListingType] = React.useState("sale");
  const { search: searched } = useRouter().query;
  const cards = convertArrayCards();

  const { transactionsBoard } = useStats({
    nfts,
    listedSelected: "trading_cards",
    soldSelected: "trading_cards",
    columnSelected,
  });

  const orderMapper = {
    lowest_price: "Price: Low to High",
    highest_price: "Price: High to Low",
    recently_listed: "Recent to Older",
    older_listed: "Older to Recent",
  };

  React.useEffect(() => {
    if (nfts) {
      getSales(currentOrder);
    }
  }, [currentOrder, type, nfts]);

  React.useEffect(() => {
    if (searched) {
      setSearch(searched);
    }
  }, [searched]);

  const getSales = async (currentOrder: string) => {
    const { endersGate, pack } = getAddressesMatic();
    let cardSalesCreated: any = [],
      packSalesCreated: any = [],
      nftsCreated: any = [];
    try {
      const [cardsOpensea, packsOpensea] = await Promise.all([
        OpenseaApiService.getCardsOpensea(),
        OpenseaApiService.getPacksOpensea(),
      ]);
      cardSalesCreated = cardsOpensea.data.listings
        .filter((i) => i.chain === "matic")
        .map((i, id) => {
          return {
            id: id + 1 + nfts?.saleCreated?.length,
            duration:
              parseInt(i.protocol_data.parameters.endTime) -
              parseInt(i.protocol_data.parameters.startTime),
            nft: i.protocol_data.parameters.offer[0].token,
            nftId: parseInt(
              i.protocol_data.parameters.offer[0].identifierOrCriteria,
            ),
            price:
              i.price.current.decimals === 18
                ? Web3.utils.fromWei(i.price.current.value, "ether")
                : i.price.current.value / i.price.current.decimals,
            currency: i.price.current.currency,
            seller: i.protocol_data.parameters.offerer,
            startedAt: i.protocol_data.parameters.startTime,
            status: "0",
            type: "opensea",
          };
        });
      packSalesCreated = packsOpensea.data.listings
        .filter((i) => i.chain === "matic")
        .map((i, id) => {
          return {
            id: id + 1 + cardSalesCreated.length + nfts?.saleCreated?.length,
            duration:
              parseInt(i.protocol_data.parameters.endTime) -
              parseInt(i.protocol_data.parameters.startTime),
            nft: i.protocol_data.parameters.offer[0].token,
            nftId: parseInt(
              i.protocol_data.parameters.offer[0].identifierOrCriteria,
            ),
            price:
              i.price.current.decimals === 18
                ? Web3.utils.fromWei(i.price.current.value, "ether")
                : i.price.current.value / i.price.current.decimals,
            currency: i.price.current.currency,
            seller: i.protocol_data.parameters.offerer,
            startedAt: i.protocol_data.parameters.startTime,
            status: "0",
            type: "opensea",
          };
        });
      nftsCreated = [...cardSalesCreated, ...packSalesCreated];
    } catch (e) {
      console.log(e);
    }

    nfts?.saleCreated?.forEach((sale) => {
      nftsCreated.push(sale);
      if (sale.nft === endersGate) {
        cardSalesCreated.push(sale);
      } else if (sale.nft === pack) {
        packSalesCreated.push(sale);
      }
    });

    if (currentOrder === "recently_listed") {
      switch (type) {
        case "trading_cards":
          setSales(
            cardSalesCreated?.sort(
              (a, b) => parseFloat(b.startedAt) - parseFloat(a.startedAt),
            ),
          );
          break;
        case "packs":
          setSales(
            packSalesCreated?.sort(
              (a, b) => parseFloat(b.startedAt) - parseFloat(a.startedAt),
            ),
          );
          break;
        default:
          setSales(
            nftsCreated?.sort(
              (a, b) => parseFloat(b.startedAt) - parseFloat(a.startedAt),
            ),
          );
          break;
      }
      // const salesCreated: any[] = [...cardSalesCreated];
      // setSales(salesCreated.reverse());
    } else if (currentOrder === "older_listed") {
      switch (type) {
        case "trading_cards":
          // setSales(cardSalesCreated);
          setSales(
            cardSalesCreated.sort(
              (a, b) => parseFloat(a.startedAt) - parseFloat(b.startedAt),
            ),
          );
          break;
        case "packs":
          setSales(
            packSalesCreated.sort(
              (a, b) => parseFloat(a.startedAt) - parseFloat(b.startedAt),
            ),
          );
          break;
        default:
          setSales(
            nftsCreated.sort(
              (a, b) => parseFloat(a.startedAt) - parseFloat(b.startedAt),
            ),
          );
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
          setSales(
            nftsCreated.sort(
              (a, b) => parseFloat(a.price) - parseFloat(b.price),
            ),
          );
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
          setSales(
            nftsCreated.sort(
              (a, b) => parseFloat(b.price) - parseFloat(a.price),
            ),
          );
          break;
      }
    }
  };

  const [filters, setFilters] = React.useState({
    avatar: [],
    cardRarity: [],
    cardRole: [],
    cardRace: [],
    cardElement: [],
    packRarity: [],
  });

  const salesFiltered = sales
    .filter((sale) => {
      return (
        (sale.rent && listingType === "rent") ||
        (!sale.rent && listingType === "sale")
      );
    })
    .filter((sale, i) => {
      return !isPack(sale.nft)
        ? filterCards({
            card: cards[sale.nftId],
            filters,
            search,
            type,
            cardType,
          })
        : filterPacks({
            pack: packs[sale.nftId],
            filters,
            search,
            type,
          });
    });

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
                  setPage(0);
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
              setPriceSettings={setPriceSettings}
              listingType={listingType}
              setListingType={setListingType}
            />
          </div>
          <div className="w-full xl:mt-0 mt-6 flex flex-col pb-10">
            <div>
              <div className="flex flex-wrap w-full justify-center items-center relative ">
                {salesFiltered.filter(
                  (sale, i) => i < (page + 1) * 12 && i >= page * 12,
                ).length > 0 ? (
                  salesFiltered
                    .filter((sale) => {
                      const price = sale.price / 10 ** 6;
                      const { minPrice, maxPrice } = priceSettings;

                      return (
                        (minPrice == 0 && maxPrice == 0) ||
                        (minPrice == undefined && maxPrice == undefined) ||
                        (minPrice <= price && maxPrice >= price)
                      );
                    })
                    .filter((sale, i) => i < (page + 1) * 12 && i >= page * 12)
                    .map((sale, id) => {
                      return (
                        <NftCard
                          classes={{ root: "m-4 cursor-pointer" }}
                          setPage={setPage}
                          icon={
                            isPack(sale.nft)
                              ? packs[sale.nftId]?.properties?.image?.value
                              : cards[sale.nftId]?.properties?.image?.value
                          }
                          name={
                            isPack(sale.nft)
                              ? packs[sale.nftId]?.properties?.name?.value
                              : cards[sale.nftId]?.properties?.name?.value
                          }
                          byId={false}
                          type={sale.type}
                          sale={sale}
                          rent={sale.rent}
                        />
                      );
                    })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4 text-xl">
                    <img src={Icons.logoCard} className="w-40 h-40" alt="" />
                    There aren't sales for this search, try with other.
                  </div>
                )}
                {salesFiltered.length > 12 && (
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
                            (salesFiltered.filter((sale) => {
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
