import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import { useAppSelector } from "redux/store";
import { SearchOutlined } from "@ant-design/icons";
import Styles from "./styles.module.scss";
import comics from "@shared/comicsByNFTId.json";
import { Images } from "@shared/const/Images";
import { convertArrayCards } from "@shared/components/common/convertCards";
import { Dropdown } from "@shared/components/common/dropdowns/dropdown/dropdown";
import { XIcon } from "@heroicons/react/solid";
import { CardInventory } from "@shared/components/Profile/inventory/cards/itemCard/index";
import { useBlockchain } from "@shared/context/useBlockchain";
import { onGetAssets } from "@redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@shared/context/useUser";

const navItems = [
  { title: "Trading Cards", value: "Trading Cards" },
  { title: "Packs", value: "Packs" },
  { title: "Comics", value: "Comics" },
  { title: "Rented Cards", value: "Rented Cards" },
];

const Inventory = () => {
  const nfts = useAppSelector((state) => state.nfts);
  const inventoryCards = nfts.balanceCards;
  const inventoryRented = nfts.balanceWrapped;
  const inventoryComics = nfts.balanceComics;
  const [inventoryPacks, setInventoryPacks] = React.useState([]);
  const [columnSelected, setColumnSelected] = React.useState("Trading Cards");
  const [search, setSearch] = React.useState("");
  const dispatch = useDispatch();
  const {
    user: { ethAddress },
  } = useUser();
  const { blockchain } = useBlockchain();

  const cards = convertArrayCards();

  React.useEffect(() => {
    dispatch(onGetAssets({ address: ethAddress, blockchain }));
  }, []);

  React.useEffect(() => {
    const arrayPacks = [];
    nfts.balancePacks.forEach((pack, index) => {
      arrayPacks.push({
        id: pack.id,
        quantity: pack.balance,
        image:
          index === 0
            ? Images.pack1
            : index === 1
            ? Images.pack2
            : index === 2
            ? Images.pack3
            : Images.pack4,
        name:
          index === 0
            ? "Common Pack"
            : index === 1
            ? "Rare Pack"
            : index === 2
            ? "Epic Pack"
            : "Legendary Pack",
      });
    });
    setInventoryPacks(arrayPacks);
  }, [nfts]);

  return (
    <div className="flex flex-col w-full sm:px-24 px-4">
      <h2 className="text-white font-bold text-4xl mb-8 xs:text-left text-center">
        My Enders Gate NFTs
      </h2>
      <div className="flex md:flex-row flex-col gap-4 items-center mb-4">
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
        <div className="flex items-center justify-center py-4 text-xl">
          <Dropdown
            classTitle={
              "text-red-primary hover:text-orange-500 whitespace-nowrap w-60"
            }
            title={columnSelected}
          >
            <div className="flex flex-col rounded-md border border-overlay-border">
              {navItems.map((item) => (
                <div
                  className="p-4 text-center font-bold hover:text-orange-500 text-primary whitespace-nowrap cursor-pointer"
                  onClick={() => setColumnSelected(item.value)}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>
      <div
        className={clsx(
          "flex mb-10 justify-center",
          {
            [`${Styles.gray} flex-col items-center gap-6 h-72`]:
              (inventoryCards.length === 0 &&
                (columnSelected === "Trading Cards" ||
                  columnSelected === "Rented Cards")) ||
              (inventoryPacks.length === 0 && columnSelected === "Packs"),
          },
          {
            "flex-wrap gap-6":
              (inventoryCards.length > 0 &&
                (columnSelected === "Trading Cards" ||
                  columnSelected === "Rented Cards")) ||
              (inventoryPacks.length > 0 && columnSelected === "Packs"),
          },
        )}
      >
        {columnSelected === "Trading Cards" ? (
          inventoryCards.filter(
            (card) =>
              cards[card.id]?.properties?.name?.value
                .toLowerCase()
                .includes(search.toLowerCase()) && card.balance > 0,
          ).length > 0 ? (
            inventoryCards
              .filter(
                (card) =>
                  cards[card.id]?.properties?.name?.value
                    .toLowerCase()
                    .includes(search.toLowerCase()) && card.balance > 0,
              )
              .map((card) => {
                return (
                  <CardInventory
                    key={card.id}
                    id={card.id}
                    icon={cards[card.id]?.image}
                    name={cards[card.id]?.properties?.name?.value}
                    balance={card.balance}
                    type={cards[card.id].typeCard}
                    back={cards[card.id]?.properties?.back?.value}
                    typeNFT={"card"}
                    byId
                  />
                );
              })
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-white font-bold gap-4 relative">
              <img src={Icons.logoCard} className="w-24 h-24" alt="" />
              You don't own EG NFTs Cards yet
            </div>
          )
        ) : columnSelected === "Packs" ? (
          inventoryPacks.filter((pack) => parseInt(pack.quantity) > 0).length >
          0 ? (
            inventoryPacks
              .filter((pack) => parseInt(pack.quantity) > 0)
              .map((pack, index) => {
                return (
                  <CardInventory
                    key={pack.id}
                    id={pack.id}
                    icon={pack.image}
                    name={pack.name}
                    balance={nfts.balancePacks[pack.id].balance}
                    typeNFT={"pack"}
                    byId
                  />
                );
              })
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-white font-bold gap-4 relative">
              <img src={Icons.logoCard} className="w-24 h-24" alt="" />
              You don't own EG NFTs Packs yet
            </div>
          )
        ) : columnSelected === "Rented Cards" ? (
          inventoryRented.filter(
            (card) =>
              cards[card.id]?.properties?.name?.value
                .toLowerCase()
                .includes(search.toLowerCase()) && card.balance > 0,
          ).length > 0 ? (
            inventoryRented
              .filter(
                (card) =>
                  cards[card.id]?.properties?.name?.value
                    .toLowerCase()
                    .includes(search.toLowerCase()) && card.balance > 0,
              )
              .map((card) => {
                return (
                  <CardInventory
                    key={card.id}
                    id={card.id}
                    icon={cards[card.id]?.image}
                    name={cards[card.id]?.properties?.name?.value}
                    balance={card.balance}
                    type={cards[card.id].typeCard}
                    back={cards[card.id]?.properties?.back?.value}
                    typeNFT={"card"}
                    rented
                    byId
                  />
                );
              })
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-white font-bold gap-4 relative">
              <img src={Icons.logoCard} className="w-24 h-24" alt="" />
              You don't own Rented EG NFTs Cards
            </div>
          )
        ) : columnSelected === "Comics" ? (
          inventoryComics.filter(
            (comic) =>
              comics[comic.id]?.name
                .toLowerCase()
                .includes(search.toLowerCase()) && comic.balance > 0,
          ).length > 0 ? (
            inventoryComics
              .filter(
                (comic) =>
                  comics[comic.id]?.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) && comic.balance > 0,
              )
              .map((comic) => {
                return (
                  <CardInventory
                    key={comic.id}
                    id={comic.id}
                    icon={comics.find(({ id }) => id == comic.id)?.image}
                    name={comics.find(({ id }) => id == comic.id)?.name}
                    balance={comic.balance}
                    typeNFT={"comic"}
                    rented
                    byId
                  />
                );
              })
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-white font-bold gap-4 relative">
              <img src={Icons.logoCard} className="w-24 h-24" alt="" />
              You don't own EG Comics
            </div>
          )
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
      ;
    </div>
  );
};

export default Inventory;
