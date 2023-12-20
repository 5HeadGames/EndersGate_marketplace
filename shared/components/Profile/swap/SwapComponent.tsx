import { Button } from "@shared/components/common/button";

import React from "react";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useWeb3React } from "@web3-react/core";
import { XIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "@shared/hooks/modal";
import { getAddressesMatic, getContractCustom } from "@shared/web3";
import Web3 from "web3";
import {
  onApproveERC1155,
  onExchangeEGERC721to1155,
  onExchangePackERC721to1155,
  onGetAssets,
} from "@redux/actions";
import { useToasts } from "react-toast-notifications";
import { Icons } from "@shared/const/Icons";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useUser } from "@shared/context/useUser";
import clsx from "clsx";
import { FAQS } from "@shared/utils/utils";
import AccordionFAQ from "../../common/AccordionFAQ";
import { useRouter } from "next/router";
import { getExchangeType, menuElements } from "@shared/components/utils";

const SwapComponent = () => {
  const {
    user: { ethAddress: user, provider },
  } = useUser();

  const router = useRouter();

  const dispatch = useDispatch();
  const { Modal, show, hide, isShow } = useModal();

  const { common_pack, ultraman, bemular, exchange, exchangeEG } =
    getAddressesMatic();

  const { addToast } = useToasts();

  const { blockchain } = useBlockchain();

  const [showEG, setShowEG] = React.useState(true);

  const passPacks = [
    {
      name: "Gen 0 Common Pass",
      nameResult: "Gen 0 Common Pack",
      nameKey: "Common Pack",
      image: "/images/CommonPass.png",
      result: "/images/0.png",
      address: common_pack,
    },
    // {
    //   name: "Gen 0 Rare Pass",
    //   nameKey: "Rare Pack",
    //   image: "/images/RarePass.png",
    //   address: rare_pack,
    // },
    // {
    //   name: "Gen 0 Epic Pass",
    //   nameKey: "Epic Pack",
    //   image: "/images/EpicPass.png",
    //   address: epic_pack,
    // },
    // {
    //   name: "Gen 0 Legendary Pass",
    //   nameKey: "Legendary Pack",
    //   image: "/images/LegendaryPass.png",
    //   address: legendary_pack,
    // },
  ];

  const passEG = [
    {
      name: "Ultraman MINT PASS",
      nameResult: "Ultraman Avatar Card",
      nameKey: "Ultraman",
      image: "/images/swap/Common pass.svg",
      imageBonus: "/images/swap/BonusPack.png",
      result: "/images/swap/Ultraman.svg",
      address: ultraman,
    },
    {
      name: "Bemular MINT PASS",
      nameResult: "Bemular Avatar Card",
      nameKey: "Bemular",
      imageBonus: "/images/swap/BonusPack.png",
      image: "/images/swap/Bemular_pass.svg",
      result: "/images/swap/Bemular.svg",
      address: bemular,
    },
  ];

  const [balanceEG, setBalanceEG] = React.useState({
    Ultraman: 0,
    Bemular: 0,
  });

  const [balance, setBalance] = React.useState({
    "Common Pack": 0,
    "Rare Pack": 0,
    "Epic Pack": 0,
    "Legendary Pack": 0,
  });

  const [search, setSearch] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [congrats, setCongrats] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [exchangeType, setExchangeType] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      if (showEG) {
        handleSetBalanceEG();
      } else {
        handleSetBalancePacks();
      }
    }
  }, [user, showEG]);

  const handleSetBalancePacks = async () => {
    const balance = {
      "Common Pack": 0,
      "Rare Pack": 0,
      "Epic Pack": 0,
      "Legendary Pack": 0,
    };
    const web3 = new Web3(
      process.env["NEXT_PUBLIC_POLYGON_RPC"]
        ? process.env["NEXT_PUBLIC_POLYGON_RPC"]
        : "http://localhost:8585",
    );

    for (let i = 0; i < passPacks.length; i++) {
      const item = passPacks[i];
      const pack = await getContractCustom(
        "ERC721Seadrop",
        item.address,
        web3.currentProvider,
      );

      const balancePass = await pack.methods.balanceOf(user).call();
      balance[item.nameKey] = balancePass;
    }

    setBalance(balance);
  };

  const handleSetBalanceEG = async () => {
    const balance = {
      Ultraman: 0,
      Bemular: 0,
    };
    const web3 = new Web3(
      process.env["NEXT_PUBLIC_POLYGON_RPC"]
        ? process.env["NEXT_PUBLIC_POLYGON_RPC"]
        : "http://localhost:8585",
    );

    for (let i = 0; i < passPacks.length; i++) {
      const item = passPacks[i];
      const pack = await getContractCustom(
        "ERC721Seadrop",
        item.address,
        web3.currentProvider,
      );

      const balancePass = await pack.methods.balanceOf(user).call();
      balance[item.nameKey] = balancePass;
    }
    for (let i = 0; i < passEG.length; i++) {
      const item = passEG[i];
      const eg = await getContractCustom(
        "ERC721Seadrop",
        item.address,
        web3.currentProvider,
      );

      const balancePass = await eg.methods.balanceOf(user).call();
      balance[item.nameKey] = balancePass;
    }
    setBalanceEG(balance);
  };

  const exchangeAllPacks = async () => {
    console.log("a?");
    setLoading(true);
    try {
      const packsToExchange = passPacks.filter(
        (item) => balance[item.nameKey] > 0,
      );

      for (const element of packsToExchange) {
        const item = element;
        const pack = getContractCustom("ERC721Seadrop", item.address, provider);
        const isApproved = await pack.methods
          .isApprovedForAll(user, exchange)
          .call();

        if (isApproved == false) {
          const res: any = dispatch(
            onApproveERC1155({
              from: user,
              pack: item.address,
              provider: provider,
              exchange,
            }),
          );
          if (res?.payload?.err) {
            throw new Error(res?.payload.err.message);
          }
        }
      }

      const res: any = await dispatch(
        onExchangePackERC721to1155({
          from: user,
          nfts: passPacks
            .filter((item) => balance[item.nameKey] > 0)
            .map((item) => item.address),
          provider: provider,
          blockchain: blockchain,
        }),
      );
      if (res?.payload?.err) {
        throw new Error(res?.payload.err.message);
      }

      setSuccess(true);
      dispatch(onGetAssets({ address: user, blockchain }));
      addToast("Your NFTs have been exchanged succesfully!", {
        appearance: "success",
      });
      handleSetBalancePacks();
      setTimeout(() => {
        hide();
        setLoading(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.log(error);
      addToast("Ups! Error exchanging your tokens, please try again", {
        appearance: "error",
      });
      hide();
      setLoading(false);
      setSuccess(false);
    }
  };

  const exchangeAllEG = async () => {
    setLoading(true);
    try {
      const cardsToExchange = passEG.filter(
        (item) => balanceEG[item.nameKey] > 0,
      );

      for (const element of cardsToExchange) {
        const item = element;
        const eg = getContractCustom("ERC721Seadrop", item.address, provider);
        const isApproved = await eg.methods
          .isApprovedForAll(user, exchangeEG)
          .call();
        console.log(isApproved, user, exchangeEG, "approved?");
        if (isApproved == false) {
          const res: any = dispatch(
            onApproveERC1155({
              from: user,
              pack: item.address,
              provider: provider,
              exchange: exchangeEG,
            }),
          );
          if (res?.payload?.err) {
            throw new Error(res?.payload.err.message);
          }
        }
      }

      const res: any = await dispatch(
        onExchangeEGERC721to1155({
          from: user,
          nfts: passEG
            .filter((item) => balanceEG[item.nameKey] > 0)
            .map((item) => item.address),
          provider: provider,
          blockchain: blockchain,
        }),
      );
      if (res?.payload?.err) {
        throw new Error(res?.payload.err.message);
      }
      console.log(balanceEG);
      setExchangeType(getExchangeType(balanceEG));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 1500);
      dispatch(onGetAssets({ address: user, blockchain }));
      addToast("Your NFTs have been exchanged succesfully!", {
        appearance: "success",
      });
      handleSetBalanceEG();
      setCongrats(true);
    } catch (error) {
      console.log(error);
      addToast("Ups! Error exchanging your tokens, please try again", {
        appearance: "error",
      });
      hide();
      setLoading(false);
      setSuccess(false);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col w-full 2xl:px-36 md:px-24 px-4 gap-2">
      <div className="flex flex-col gap-1 sm:w-60 w-full sm:pt-36">
        {menuElements(showEG, setShowEG).map(
          ({ name, link, image, active, onClick }) => {
            return link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className={clsx(
                  { "bg-gray-800 !border-primary-disabled": active },
                  "flex items-center border border-transparent gap-2 rounded-md p-2 bg-black cursor-pointer",
                )}
              >
                <img className="w-7 max-h-[25px]" src={image} alt="" />
                <p className="text-primary-disabled font-bold">{name}</p>
              </a>
            ) : (
              <div
                onClick={onClick}
                className={clsx(
                  { "bg-gray-800 !border-primary-disabled": active },
                  "flex border border-transparent gap-2 rounded-md p-2 bg-black cursor-pointer",
                )}
              >
                <img className="w-10" src={image} alt="" />
                <p className="text-primary-disabled font-bold">{name}</p>
              </div>
            );
          },
        )}
      </div>
      <div className="flex flex-col w-full">
        <Modal
          onClose={() => {
            setCongrats(false);
          }}
          isShow={isShow}
          withoutX
        >
          {congrats && showEG ? (
            <div
              style={{ width: "90vw", maxWidth: "375px" }}
              className="relative bg-overlay flex flex-col items-center gap-4 jusify-center shadow-2xl rounded-2xl mt-36"
            >
              <img
                src="/images/swap/congrats_bg.png"
                className="w-full opacity-[0.40] absolute top-0"
                alt=""
              />
              <img
                src={
                  exchangeType === 1
                    ? "/images/swap/ultraman_bemular_pack.png"
                    : exchangeType === 2
                    ? "/images/swap/ultraman_plus_pack.png"
                    : exchangeType === 3
                    ? "/images/swap/bemular_plus_pack.png"
                    : ""
                }
                className="absolute top-[-175px]"
                width={"275px"}
                alt=""
              />
              <div className="absolute h-full w-full rounded-2xl bg-gradient-to-b from-transparent to-overlay px-2 from-0% to-30% "></div>
              <div className="absolute top-2 right-2 flex justify-end w-full py-2">
                <XIcon
                  className="text-white w-5 cursor-pointer p-[2px] rounded-full bg-overlay border border-white"
                  onClick={() => {
                    setCongrats(false);
                    hide();
                  }}
                />
              </div>
              <div className="flex flex-col items-center justify-center relative rounded-full px-6 pt-16 pb-8 gap-2">
                <h2 className="text-white text-center font-bold text-5xl text-red-alert">
                  Success!
                </h2>{" "}
                <p className="text-center text-white text-lg py-4">
                  Ultraman X Enders Gate collab bundle Obtained! Check your
                  inventory for your new collectibles.
                </p>
                <p className="text-center text-white text-lg py-2">
                  Share this with your friends and inform them about the Drop!
                </p>
                <a
                  href={`https://twitter.com/intent/tweet?text=I'm so excited to announce that I just have obtained my Ultraman X Enders Gate collab bundle from Enders Gate! Get yours on: https://marketplace.endersgate.gg/profile/swap`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/share.png"
                    className="h-12 cursor-pointer"
                    alt=""
                  />
                </a>
                <img
                  src="/images/view_comics.png"
                  className="h-12 cursor-pointer"
                  alt=""
                  onClick={() => {
                    router.push("/profile");
                    setCongrats(false);
                    hide();
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center bg-secondary rounded-xl border border-overlay-border w-full relative md:max-w-[700px] md:min-w-[700px] sm:min-w-[550px] max-w-[350px] min-w-[350px]">
              <div className="flex items-center justify-center border-b border-overlay-border w-full py-4 px-4 relative">
                <h2 className="font-bold text-primary text-center text-3xl">
                  Pass Swap
                </h2>
                {!loading && (
                  <XIcon
                    onClick={() => hide()}
                    className="absolute right-4 top-0 bottom-0 my-auto text-primary-disabled text-xl w-6 cursor-pointer"
                  ></XIcon>
                )}
              </div>
              <div className="flex flex-col gap-4 px-4 w-full items-center justify-center pb-4 pt-2 ">
                <h3 className="text-lg text-white text-center w-full font-bold Raleway">
                  Swap your ERC721 NFTs for ERC1155
                </h3>
                <p className="text-sm text-primary-disabled text-justify">
                  <span className="text-white"> Note:</span> To swap your tokens
                  on the 5HG marketplace, you will need to complete{" "}
                  {showEG ? (
                    <>
                      {Object.keys(balanceEG)
                        ?.map((item) => balanceEG[item])
                        ?.filter((item) => item > 0).length + 1}
                    </>
                  ) : (
                    <>
                      {Object.keys(balance)
                        ?.map((item) => balance[item])
                        ?.filter((item) => item > 0).length + 1}
                    </>
                  )}{" "}
                  transactions. The firsts transaction grants us permission to
                  swap your tokens, and the last transaction executes the swap.
                  Granting permission only occurs once per session.
                </p>
              </div>

              <div className="flex gap-2 items-center justify-center py-2 border-y border-overlay-border relative w-full px-2">
                {loading && (
                  <div className="flex flex-col items-center justify-center absolute top-0 bottom-0 left-0 right-0 m-auto w-full bg-[#00000088]">
                    <div className="flex flex-col  items-center justify-center h-auto bg-overlay border border-overlay-border p-4 rounded-xl">
                      <h2 className="text-white text-xl text-center font-bold ">
                        Swap {success ? "completed" : "in progress..."}
                      </h2>
                      <div className="w-full flex items-center justify-center py-2">
                        {!success ? (
                          <LoadingOutlined className="text-4xl text-white" />
                        ) : (
                          <CheckOutlined className="text-4xl text-green-button" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-6 items-center justify-center w-full py-4">
                  {showEG ? (
                    <>
                      {passEG.map((item) => {
                        return (
                          balanceEG[item.nameKey] > 0 && (
                            <div className="flex sm:flex-row flex-col items-center justify-center w-full gap-2 px-2">
                              <div className="flex flex-col sm:w-1/2 w-full bg-[#232323] gap-2 rounded-xl p-4">
                                <h2 className="text-white text-lg text-center">
                                  {item.name}
                                </h2>
                                <img
                                  src={item.image}
                                  className="h-32 flex"
                                  alt=""
                                />{" "}
                                <div className="flex gap-2 px-2 w-full justify-center items-center">
                                  <div className="flex flex-col items-center text-[#B8B8B8] p-2 bg-[#3F3F3F] rounded-xl w-1/3">
                                    <h3 className="text-[10px] font-[400]">
                                      Quantity:
                                    </h3>{" "}
                                    <p className="text-[18px] flex h-5 font-bold">
                                      {balanceEG[item.nameKey]}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center text-[#B8B8B8] p-2 bg-[#3F3F3F] rounded-xl w-1/3">
                                    <h3 className="text-[10px] font-[400]">
                                      Token Type:
                                    </h3>{" "}
                                    <p className="text-[18px] flex h-5 font-bold">
                                      721
                                    </p>
                                  </div>{" "}
                                  <div className="flex flex-col items-center text-[#B8B8B8] p-2 bg-[#3F3F3F] rounded-xl w-1/3">
                                    <h3 className="text-[10px] font-[400]">
                                      Blockchain:
                                    </h3>{" "}
                                    <p className="text-[18px] flex h-5 font-bold">
                                      Matic
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <ArrowRightOutlined className="text-xl text-white sm:flex hidden" />
                              <ArrowDownOutlined className="text-xl text-white sm:hidden" />
                              <div className="flex flex-col sm:w-1/2 w-full bg-[#232323] gap-2 rounded-xl p-4">
                                <h2 className="text-white text-lg text-center">
                                  {item.nameResult}
                                </h2>

                                <div className="flex gap-2 justify-center items-center">
                                  <img
                                    src={item.result}
                                    className="h-32 flex"
                                    alt=""
                                  />{" "}
                                  <img
                                    src={item.imageBonus}
                                    className="h-32 flex"
                                    alt=""
                                  />
                                </div>
                                <div className="flex gap-2 px-2 w-full justify-center items-center">
                                  <div className="flex flex-col items-center text-[#B8B8B8] p-2 bg-[#3F3F3F] rounded-xl w-1/3">
                                    <h3 className="text-[10px] font-[400]">
                                      Quantity:
                                    </h3>{" "}
                                    <p className="text-[18px] flex h-5 font-bold">
                                      {balanceEG[item.nameKey]}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center text-[#B8B8B8] p-2 bg-[#3F3F3F] rounded-xl w-1/3">
                                    <h3 className="text-[10px] font-[400]">
                                      Token Type:
                                    </h3>{" "}
                                    <p className="text-[18px] flex h-5 font-bold">
                                      1155
                                    </p>
                                  </div>{" "}
                                  <div className="flex flex-col items-center text-[#B8B8B8] p-2 bg-[#3F3F3F] rounded-xl w-1/3">
                                    <h3 className="text-[10px] font-[400]">
                                      Blockchain:
                                    </h3>{" "}
                                    <p className="text-[18px] flex h-5 font-bold">
                                      Matic
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        );
                      })}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-4 w-full justify-center items-center py-4">
                <Button
                  className="px-2 py-1 border !border-green-button bg-gradient-to-b from-overlay to-[#233408] rounded-md font-[500]"
                  onClick={() => {
                    if (!showEG) {
                      exchangeAllPacks();
                    } else {
                      exchangeAllEG();
                    }
                  }}
                  disabled={loading}
                >
                  Confirm Swap
                </Button>
              </div>
            </div>
          )}
        </Modal>
        <div className="flex gap-4 items-center mb-4">
          <div className="border flex items-center text-lg justify-center border-overlay-border bg-overlay-2 rounded-xl w-full">
            <div className="text-white flex items-center w-full py-1 px-4 rounded-xl bg-overlay border-r border-overlay-border">
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
        </div>
        <div className="flex md:flex-row flex-col md:items-end md:justify-start justify-center gap-4 mb-2 pl-4">
          <div className="text-primary-disabled font-bold Raleway">
            {!showEG ? (
              <>
                {Object.keys(balance)
                  ?.map((item) => {
                    console.log(balance, item);
                    return parseInt(balance[item]);
                  })
                  ?.reduce((acc, num) => {
                    return acc + num;
                  })}
              </>
            ) : (
              <>
                {Object.keys(balanceEG)
                  ?.map((item) => {
                    return parseInt(balanceEG[item]);
                  })
                  ?.reduce((acc, num) => {
                    return acc + num;
                  })}
              </>
            )}{" "}
            ERC721 Items
          </div>
          {(showEG
            ? Object.keys(balanceEG)
                ?.map((item) => {
                  return parseInt(balanceEG[item]);
                })
                ?.reduce((acc, num) => {
                  return acc + num;
                }) > 0
            : Object.keys(balance)
                ?.map((item) => {
                  return parseInt(balance[item]);
                })
                ?.reduce((acc, num) => {
                  return acc + num;
                }) > 0) && (
            <Button
              className="px-2 py-1 border !border-green-button bg-gradient-to-b from-overlay to-[#233408] rounded-md"
              onClick={() => {
                show();
              }}
            >
              Swap {showEG ? "Cards" : "Packs"} All to ERC1155
            </Button>
          )}
        </div>
        <div className="flex w-full gap-1">
          <div className="flex flex-col items-center justify-start gap-4 min-h-[calc(75vh)] border border-overlay-border bg-overlay rounded-xl p-4 overflow-auto w-full">
            <div className="flex flex-col md:items-start md:justify-start justify-center items-center gap-6 w-full pt-6 pl-6">
              <h2 className="sm:text-5xl text-3xl font-bold text-white">
                {showEG ? "Card" : "Pack"} Pass Swap
              </h2>
              <p className="text-primary-disabled md:w-[60%] w-full md:text-xl sm:text-lg text-sm">
                Swap your official Enders Gate Card Pass (721) tokens to
                official Enders Gate Trading Card (1155) tokens by selecting the
                desired quantity and completing the swap process.
              </p>
            </div>
            <div className="flex sm:flex-wrap sm:justify-start items-center justify-center w-full min-h-[calc(60vh)] px-10">
              {Object.keys(showEG ? balanceEG : balance)
                ?.map((item) => (showEG ? balanceEG[item] : balance[item]))
                ?.reduce((acc, num) => parseInt(acc) + parseInt(num)) > 0 ? (
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center justify-center gap-4">
                  <>
                    {!showEG ? (
                      <>
                        {passPacks.map((item) => {
                          return (
                            <div className="flex items-center flex-col md:w-96 sm:w-72 w-60">
                              <img src={item.image} className="w-full" alt="" />
                              <h2 className="text-white text-xl font-bold text-center Raleway mt-1">
                                {item.name}
                              </h2>
                              <p className="text-md text-primary-disabled Raleway">
                                QUANTITY: {balance[item.nameKey]}
                              </p>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {passEG.map((item) => {
                          return (
                            <div className="flex items-center flex-col md:w-96 sm:w-72 w-60">
                              <img src={item.image} className="w-full" alt="" />
                              <h2 className="text-white text-xl font-bold text-center Raleway mt-1">
                                {item.name}
                              </h2>
                              <p className="text-md text-primary-disabled Raleway">
                                QUANTITY: {balanceEG[item.nameKey]}
                              </p>
                              <p className="text-md text-primary-disabled Raleway">
                                Token: ERC721
                              </p>
                              <p className="text-md text-primary-disabled Raleway">
                                Blockchain: Matic{" "}
                              </p>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </>
                </div>
              ) : (
                <div className="flex flex-col gap-2 h-full w-full items-center justify-center">
                  <img src={Icons.logoCard} className="w-20" alt="" />
                  <h2 className="text-xl text-primary-disabled text-center">
                    You don't have any Pass NFT
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-4" id="FAQ">
          {FAQS.map((faq) => {
            return <AccordionFAQ title={faq.title}>{faq.content}</AccordionFAQ>;
          })}
        </div>
      </div>
    </div>
  );
};

export default SwapComponent;
