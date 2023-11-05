import React from "react";
import Web3 from "web3";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "redux/store";
import {
  buyERC1155,
  onLoadSales,
  onGetAssets,
  buyERC1155Native,
} from "@redux/actions";
import { Button } from "../../common/button/button";
import { Icons } from "@shared/const/Icons";
import { AddressText } from "../../common/specialFields/SpecialFields";
import { getAddresses, getTokensAllowedMatic, switchChain } from "@shared/web3";
import packs from "../../../packs.json";
import { useModal } from "@shared/hooks/modal";
import { convertArrayCards } from "../../common/convertCards";
import clsx from "clsx";
import Styles from "../styles.module.scss";
import Tilt from "react-parallax-tilt";
import { DropdownActions } from "../../common/dropdownActions/dropdownActions";
import ReactCardFlip from "react-card-flip";
import { CHAINS, CHAIN_IDS_BY_NAME } from "../../../utils/chains";
import { useBlockchain } from "@shared/context/useBlockchain";
import { toast } from "react-hot-toast";
import { formatPrice } from "@shared/utils/formatPrice";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { ModalSale } from "./ModalSale";
import { useUser } from "@shared/context/useUser";

const NFTDetailSaleComponent: React.FC<any> = ({ id }) => {
  const {
    user: { ethAddress: user, provider },
  } = useUser();

  const [sale, setSale] = React.useState<any>();
  const [buyNFTData, setBuyNFTData] = React.useState(0);
  const { Modal, show, hide, isShow } = useModal();
  const [isPack, setIsPack] = React.useState(false);
  const [flippedCard, setFlippedCard] = React.useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentOrder, setCurrentOrder] = React.useState("lowest_price");
  const orderMapper = {
    lowest_price: "Price: Low to High",
    highest_price: "Price: High to Low",
  };

  const cards: any[] = convertArrayCards();

  const [tokenSelected, setTokenSelected] = React.useState({ address: "" });

  const [message, setMessage] = React.useState("");

  const { blockchain, updateBlockchain } = useBlockchain();

  const nfts = useAppSelector((state) => state.nfts);

  React.useEffect(() => {
    if (id && nfts?.allSales?.length) {
      getSale();
    }
  }, [id, nfts.allSales]);

  const getSale = async () => {
    const sale = nfts.allSales.filter((sale) => {
      return sale?.id?.toString() === id;
    })[0];
    const { pack: packAddress } = getAddresses(sale?.blockchain);
    if (sale?.nft === packAddress) {
      setIsPack(true);
    } else {
      setIsPack(false);
    }
    setSale(sale);
  };

  const buyNft = async () => {
    if (!user) {
      router.push("/login?redirect=true&redirectAddress=" + router.pathname);
    }
    try {
      const changed = await switchChain(CHAIN_IDS_BY_NAME[sale.blockchain]);
      if (!changed) {
        throw Error(
          "An error has occurred while switching chain, please try again.",
        );
      }
      updateBlockchain(sale.blockchain);

      setMessage("Buying tokens");
      const { pack, endersGate } = getAddresses(sale.blockchain);
      if (sale.blockchain !== "matic") {
        await dispatch(
          buyERC1155Native({
            seller: sale.seller,
            amount: buyNFTData,
            bid: Web3.utils
              .toBN(sale.price)
              .mul(Web3.utils.toBN(buyNFTData))
              .toString(),
            blockchain,
            tokenId: sale.saleId,
            provider: provider,
            nftContract: isPack ? pack : endersGate,
            user: user,
          }),
        );
      } else {
        await dispatch(
          buyERC1155({
            seller: sale.seller,
            amount: buyNFTData,
            bid: Web3.utils
              .toBN(sale.price)
              .mul(Web3.utils.toBN(buyNFTData))
              .toString(),
            tokenId: sale.saleId,
            token: tokenSelected.address,
            provider: provider,
            nftContract: isPack ? pack : endersGate,
            user: user,
            blockchain,
          }),
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
    setMessage("");
    await getSale();
    hide();
    dispatch(onLoadSales());
    dispatch(onGetAssets({ address: user, blockchain }));
    setBuyNFTData(0);
  };

  const notAvailable =
    sale?.status != 0 ||
    Math.floor(new Date().getTime() / 1000) >=
      parseInt(sale?.duration) + parseInt(sale?.startedAt);

  const tokensAllowed = getTokensAllowedMatic();

  return (
    <>
      <Modal isShow={isShow} withoutX>
        {id !== undefined && sale !== undefined && (
          <ModalSale
            {...{
              message,
              buyNft,
              tokensAllowed,
              hide,
              buyNFTData,
              setBuyNFTData,
              sale,
              isPack,
              setTokenSelected,
              tokenSelected,
            }}
          />
        )}
      </Modal>
      {id !== undefined && sale !== undefined ? (
        <div className="min-h-screen w-full flex flex-col relative xl:px-36 md:px-10 sm:px-6 px-4 pt-20 pb-20">
          <div
            className="w-full text-white font-bold cursor-pointer text-2xl"
            onClick={() => router.back()}
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </div>
          <div className="w-full flex xl:flex-row flex-col  gap-4 justify-center">
            <div className="flex flex-col gap-2">
              <div className="flex relative items-center justify-center xl:min-w-[500px] sm:min-w-[320px] min-w-full sm:min-h-[675px] min-h-[350px] py-10 xl:px-24 rounded-md bg-secondary cursor-pointer overflow-hidden border border-gray-500">
                {!isPack && (
                  <div
                    className="absolute top-2 right-2 z-[2] text-white text-2xl p-1"
                    onClick={() => setFlippedCard((prev) => !prev)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <img
                  src={
                    isPack
                      ? packs[sale?.nftId].properties.image.value
                      : cards[sale?.nftId]?.properties?.image?.value ||
                        Icons.logo
                  }
                  className="absolute xl:top-[-20%] top-[-25%] bottom-0 xl:left-[-55%] left-[-35%] right-0 margin-auto opacity-50 xl:min-w-[1050px] min-w-[175%]"
                  alt=""
                />
                {isPack ? (
                  <Tilt className="flex items-center justify-center">
                    <div className="sm:sticky sm:top-32 h-min w-auto">
                      <img
                        src={
                          isPack
                            ? packs[sale.nftId].properties.image.value
                            : cards[sale.nftId].properties.image?.value ||
                              Icons.logo
                        }
                        className={clsx(
                          Styles.animatedImageMain,
                          {
                            "rounded-full": !isPack
                              ? cards[sale.nftId].typeCard == "avatar"
                              : false,
                          },
                          {
                            "rounded-md": !isPack
                              ? cards[sale.nftId].typeCard != "avatar"
                              : false,
                          },
                        )}
                        alt=""
                      />
                    </div>
                  </Tilt>
                ) : (
                  <ReactCardFlip
                    isFlipped={flippedCard}
                    flipDirection="horizontal"
                  >
                    <Tilt className="flex items-center justify-center">
                      <img
                        src={
                          cards[sale.nftId]?.properties?.image?.value ||
                          Icons.logo
                        }
                        className={clsx(
                          Styles.animatedImageMain,
                          { ["hidden"]: flippedCard },

                          {
                            "rounded-full":
                              cards[sale.nftId]?.typeCard == "avatar",
                          },
                          {
                            "rounded-md":
                              cards[sale.nftId]?.typeCard != "avatar",
                          },
                        )}
                        alt=""
                      />
                    </Tilt>

                    <Tilt className="flex items-center justify-center">
                      <img
                        src={`/images/${cards[
                          sale.nftId
                        ]?.typeCard.toLowerCase()}.png`}
                        className={clsx(
                          Styles.animatedImageMain,
                          { ["hidden"]: !flippedCard },
                          {
                            "rounded-full":
                              cards[sale.nftId]?.typeCard == "avatar",
                          },
                          {
                            "rounded-md":
                              cards[sale.nftId]?.typeCard != "avatar",
                          },
                        )}
                        alt=""
                      />
                    </Tilt>
                  </ReactCardFlip>
                )}
              </div>
              <div className="flex flex-col xl:max-w-[500px] xl:min-h-[450px] xl:max-h-[450px]">
                <div className="flex h-full gap-4 px-6 py-6 border border-overlay-border bg-secondary rounded-xl mt-4 relative">
                  <p className="absolute top-2 right-4 text-overlay-border text-[11px]">
                    CARD INFO
                  </p>
                  <div className="flex flex-col w-full gap-2 h-full justify-between">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col w-full">
                        <h2 className="text-primary uppercase md:text-4xl text-3xl font-bold">
                          {isPack
                            ? packs[sale?.nftId].properties.name.value
                            : cards[sale?.nftId]?.properties?.name?.value}
                        </h2>
                        <div className="flex w-full justify-between">
                          <p className="text-primary-disabled text-lg font-[450]">
                            {isPack
                              ? "Pack #" +
                                packs[sale?.nftId].properties.id.value
                              : "Card #" +
                                cards[sale?.nftId]?.properties?.id?.value}
                          </p>
                          <p className="text-primary-disabled text-xl font-[450]">
                            Sale #{id}
                          </p>
                          <p className="text-primary-disabled text-xl font-[450]">
                            Level: 1
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-white">
                          Description:
                        </h2>
                        <p className="text-primary-disabled text-md">
                          {isPack
                            ? packs[sale?.nftId].properties.description.value
                            : cards[sale?.nftId]?.properties?.description
                                ?.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-bold text-white">
                          Card Type
                        </h2>
                        <p className="text-primary-disabled text-md">
                          {cards[sale?.nftId]?.typeCard[0].toUpperCase() +
                            cards[sale?.nftId]?.typeCard.substr(1)}
                        </p>
                      </div>
                      {!isPack && (
                        <div className="flex flex-col gap-2">
                          <h2 className="text-lg font-bold text-white">
                            {cards[sale?.nftId]?.typeCard[0].toUpperCase() +
                              cards[sale?.nftId]?.typeCard.substr(1)}{" "}
                            Type
                          </h2>
                          <p className="text-primary-disabled text-md">
                            {cards[sale?.nftId]?.properties?.type?.value
                              ? cards[sale?.nftId]?.properties?.type?.value
                              : cards[sale?.nftId]?.properties?.isGuardian
                                  ?.value
                              ? "Guardian"
                              : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col xl:w-max w-full pt-10">
              <div className="flex flex-col w-full md:min-h-[620px] md:max-h-[620px]">
                <div className="flex flex-col">
                  <h1 className="text-primary uppercase md:text-4xl text-3xl font-bold">
                    {isPack
                      ? packs[sale?.nftId].properties.name.value
                      : cards[sale?.nftId]?.properties?.name?.value}
                  </h1>
                  <div className="flex flex-col md:px-6 md:py-4 p-2 border border-overlay-border bg-secondary rounded-xl mt-4 relative">
                    <p className="absolute top-2 right-4 text-overlay-border text-[11px]">
                      BUY PANEL
                    </p>
                    <div className="flex flex-row gap-4 w-full">
                      <h2 className="md:text-2xl text-lg font-[450] text-white">
                        Current price:
                      </h2>
                    </div>
                    <div className="flex flex-row xl:gap-32 gap-16 w-full">
                      <div className="flex flex-col">
                        <h2 className="md:text-3xl text-xl font-[450] text-white whitespace-nowrap">
                          {formatPrice(sale.price, sale.blockchain)}
                          {/* <span className="!text-sm text-overlay-border">
                            ($1.5k)
                          </span> */}
                        </h2>
                        <img
                          src="/icons/POLYGON.svg"
                          className="md:h-10 md:w-10 w-8 h-8"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col gap-4 w-full items-center md:pl-10 md:pr-16 pr-4">
                        <Button
                          decoration="fill"
                          className="md:w-48 w-32 md:text-lg text-md py-[6px] rounded-lg text-overlay !bg-green-button hover:!bg-secondary hover:!text-green-button hover:!border-green-button"
                          onClick={() => {
                            show();
                          }}
                        >
                          Buy Now
                        </Button>
                        {/* <Button
                          decoration="line-white"
                          className="bg-dark md:text-lg text-md md:w-48 w-32 py-[6px] rounded-lg text-white hover:text-overlay border-none"
                        >
                          Make Offer
                        </Button> */}
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 w-full justify-between">
                      <div className="flex flex-col w-1/2 justify-end">
                        <p className="text-primary-disabled md:text-lg text-md">
                          Expires at:{" "}
                          <span className="text-white font-bold md:text-xl text-lg">
                            {new Date(
                              (parseInt(sale?.duration) +
                                parseInt(sale?.startedAt)) *
                                1000,
                            ).toDateString()}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 pb-2">
                        <img
                          src={Icons.logo}
                          className="md:w-12 md:h-12 w-8 h-8"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col pt-2 h-full">
                  <div className="flex flex-col px-6 py-4 border border-overlay-border bg-secondary rounded-xl mt-4 relative min-h-full">
                    <p className="absolute top-2 right-4 text-overlay-border text-[11px]">
                      OFFERS
                    </p>
                    <div className="flex flex-row gap-4 w-full pb-2">
                      <h2 className="md:text-2xl text-lg font-[450] text-white">
                        Offers
                      </h2>
                    </div>
                    <div className="flex flex-row xl:gap-20 gap-16 w-full">
                      <DropdownActions
                        title={orderMapper[currentOrder]}
                        className="!py-2 !bg-dark !rounded-xl !px-4 !text-white"
                        actions={[
                          {
                            label: "Price: Low to High",
                            onClick: () => setCurrentOrder("lowest_price"),
                          },
                          {
                            label: "Price: High to Low",
                            onClick: () => setCurrentOrder("highest_price"),
                          },
                        ]}
                      />
                    </div>
                    <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4">
                      <img src={Icons.logoCard} className="w-24 h-24" alt="" />
                      There aren't offers for this NFT
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between w-full xl:min-h-[474px] xl:max-h-[474px]">
                <div className="flex flex-col pt-6">
                  <div className="flex items-center gap-4 px-4 py-4 border border-overlay-border bg-secondary rounded-xl mt-4 relative">
                    <p className="absolute top-2 right-4 text-overlay-border text-[11px]">
                      OWNER INFO
                    </p>
                    <img src={Icons.logoCard} className="w-16 h-16" alt="" />
                    <div className="flex flex-col">
                      <h2 className="md:text-xl text-lg font-[450] text-white">
                        Owner Name
                      </h2>
                      <p className="text-primary-disabled md:text-xl text-lg font-bold">
                        <AddressText text={sale.seller}></AddressText>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 py-2 border border-overlay-border bg-secondary rounded-xl mt-4 relative">
                    <p className="absolute top-2 right-4 text-overlay-border text-[11px]">
                      TOKEN INFO
                    </p>
                    <div className="flex flex-col w-full">
                      <h2 className="text-white font-bold text-lg border-b border-overlay-border pb-2 px-6">
                        Token Details:
                      </h2>
                      <div className="w-full flex justify-between py-2 border-b border-overlay-border px-6">
                        <p className="text-lg font-[400] text-primary-disabled ">
                          Blockchain:
                        </p>
                        <p className="text-primary-disabled  font-[400] text-lg">
                          {CHAINS[CHAIN_IDS_BY_NAME[blockchain]]?.name}
                        </p>
                      </div>
                      <div className="w-full flex justify-between py-2 border-b border-overlay-border px-6">
                        <p className="text-lg font-[400] text-primary-disabled ">
                          Token ID:
                        </p>
                        <p className="text-primary-disabled  font-[400] text-lg">
                          {sale.nftId}
                        </p>
                      </div>
                      <div className="w-full flex justify-between py-2 border-b border-overlay-border px-6">
                        <p className="text-lg font-[400] text-primary-disabled ">
                          Token Standard:
                        </p>
                        <p className="text-primary-disabled  font-[400] text-lg">
                          ERC1155
                        </p>
                      </div>
                      <div className="w-full flex justify-between py-2 border-b border-overlay-border px-6">
                        <p className="text-lg font-[400] text-primary-disabled ">
                          Contract:
                        </p>
                        <a
                          href={`${
                            CHAINS[CHAIN_IDS_BY_NAME[sale.blockchain]]
                              ?.blockExplorerUrls[0]
                          }/address/${sale.nft}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-primary font-[400] text-lg flex items-center gap-1"
                        >
                          <AddressText text={sale.nft}></AddressText>{" "}
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
                        </a>
                      </div>
                      <div className="w-full flex justify-between py-2 border-b border-overlay-border px-6">
                        <p className="text-lg font-[400] text-primary-disabled ">
                          Partner Royalty:
                        </p>
                        <p className="text-primary-disabled font-[400] text-lg">
                          0%
                        </p>
                      </div>
                      <div className="w-full flex justify-between pt-2 px-6">
                        <p className="text-lg font-[400] text-primary-disabled ">
                          5HG Fee:
                        </p>
                        <p className="text-primary-disabled font-[400] text-lg">
                          4%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-full bg-overlay flex items-center justify-center text-3xl text-primary">
          <LoadingOutlined />
        </div>
      )}
    </>
  );
};

export default NFTDetailSaleComponent;
