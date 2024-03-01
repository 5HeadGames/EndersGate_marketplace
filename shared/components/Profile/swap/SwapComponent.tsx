"use client";
import { Button } from "@shared/components/common/button";
import React from "react";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { XIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "@shared/hooks/modal";
import {
  getAddressesLinea,
  getAddressesMatic,
  getContract,
  getContractCustom,
} from "@shared/web3";
import Web3 from "web3";
import {
  onApproveERC1155,
  onExchangeEGERC721to1155,
  onExchangePackERC721to1155,
  onGetAssets,
} from "@redux/actions";
import { Icons } from "@shared/const/Icons";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useUser } from "@shared/context/useUser";
import clsx from "clsx";
import { FAQS, hash } from "@shared/utils/utils";
import AccordionFAQ from "../../common/AccordionFAQ";
import { useRouter } from "next/navigation";
import { getExchangeType, menuElements } from "@shared/components/utils";
import { toast } from "react-hot-toast";
import axios from "axios";
import { CHAINS, CHAIN_IDS_BY_NAME } from "@shared/utils/chains";
import { ethers } from "ethers";

const config: any = axios.defaults;

config.baseURL = process.env.NEXT_PUBLIC_API_SBT;
config.headers = {
  ...config.headers,
  "Content-Type": "application/json",
  "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY_SBT,
};
const client = axios.create(config);

const SwapComponent = () => {
  const {
    user: { ethAddress: user, provider },
  } = useUser();

  const router = useRouter();

  const dispatch = useDispatch();
  const { Modal, show, hide, isShow } = useModal();
  const {
    Modal: ModalAchievements,
    show: showAchievements,
    hide: hideAchievements,
    isShow: isShowAchievements,
  } = useModal();

  const { common_pack, ultraman, bemular, exchange, exchangeEG } =
    getAddressesMatic();

  const { SBT, verifier } = getAddressesLinea();

  const { blockchain, updateBlockchain } = useBlockchain();

  const [showSection, setShowSection] = React.useState("cards");

  const passPacks = [
    {
      name: "Gen 0 Common Pass",
      nameResult: "Gen 0 Common Pack",
      nameKey: "Common Pack",
      image: "/images/CommonPass.png",
      result: "/images/0.png",
      address: common_pack,
    },
  ];

  const passEG = [
    {
      name: "Ultraman MINT PASS",
      nameResult: "Ultraman Avatar Card",
      nameKey: "Ultraman",
      image: "/images/swap/ultraman_pass.webp",
      imageBonus: "/images/swap/BonusPack.png",
      result: "/images/swap/Ultraman.svg",
      address: ultraman,
    },
    {
      name: "Bemular MINT PASS",
      nameResult: "Bemular Avatar Card",
      nameKey: "Bemular",
      imageBonus: "/images/swap/BonusPack.png",
      image: "/images/swap/bemular_pass.webp",
      result: "/images/swap/Bemular.svg",
      address: bemular,
    },
  ];

  const achievementsEG = [
    {
      name: "My First Duel",
      nameResult: "My First Duel",
      nameKey: "My First Duel",
      description: "Obtained by completing a match in the Arena Game Mode.",
      image: "/images/swap/achieve_first_duel.png",
      id: 1,
      hash: hash("game.duel.first"),
    },
    {
      name: "Linea Park Keeper",
      nameResult: "Linea Park Event",
      nameKey: "Linea Park Event",
      description:
        "Obtained by playing the Enders Gate Arena Game Mode during the Linea Park Voyage Event and Earning XP from Consensys.",
      image: "/images/swap/achieve_linea.png",
      id: 2,
      hash: hash("game.level.three"),
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

  const [balanceAchievements, setBalanceAchievements] = React.useState({
    "Linea Park Event": { balance: 0 },
    "My First Duel": { balance: 0 },
  });

  const [balanceAchievementsClaimed, setBalanceAchievementsClaimed] =
    React.useState({
      "Linea Park Event": 1,
      "My First Duel": 1,
    });

  const [search, setSearch] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [congrats, setCongrats] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [exchangeType, setExchangeType] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      if (showSection === "cards") {
        handleSetBalanceEG();
      } else if (showSection === "packs") {
        handleSetBalancePacks();
      } else {
        handleSetBalanceAchievements();
        handleSetBalanceAchievementsClaimed();
      }
    }
  }, [user, showSection, client]);

  const handleSetBalanceAchievements = async () => {
    client
      .get(`/signatures?address=${user}`)
      .then(async (response: any) => {
        console.log(response, "response");
        const data = response.data.records;
        const balance = {
          "Linea Park Event": { balance: 0 },
          "My First Duel": { balance: 0 },
        };
        for (let i = 0; i < data.length; i++) {
          const itemData = data[i];
          console.log(
            itemData,
            ethers.utils.hexDataSlice(itemData.calldata, 4),
          );
          const decoded = await ethers.utils.defaultAbiCoder.decode(
            ["address", "uint256", "uint256"],
            ethers.utils.hexDataSlice(itemData.calldata, 4),
          );
          achievementsEG.forEach((item) => {
            console.log(item.hash == decoded[1].toHexString());
            balance[item.nameKey] = {
              ...itemData,
              balance:
                item.hash == decoded[1].toHexString()
                  ? balance[item.nameKey].balance + 1
                  : balance[item.nameKey].balance + 0,
            };
          });
        }
        console.log(balance, "balance");
        setBalanceAchievements(balance as any);
        return balance;
      })
      .catch((error) => {
        console.error(error, "ERROR API");
      });
  };

  const handleSetBalanceAchievementsClaimed = async () => {
    try {
      const balance = {
        "Linea Park Event": 0,
        "My First Duel": 0,
      };
      const web3 = new Web3(CHAINS[CHAIN_IDS_BY_NAME["linea"]].rpcUrls[0]);

      const sbtContract = await getContractCustom(
        "SBT",
        SBT,
        web3.currentProvider,
      );

      for (let i = 0; i < achievementsEG.length; i++) {
        const item = achievementsEG[i];
        const balancePass = await sbtContract.methods
          .balanceOf(user, item.id)
          .call();
        balance[item.nameKey] = balancePass;
      }

      setBalanceAchievementsClaimed(balance), "CLAIMED";
      console.log(balance);
    } catch (e) {
      console.log(e, "achieve claimed");
    }
  };

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
    setLoading(true);
    try {
      const packsToExchange = passPacks.filter(
        (item) => balance[item.nameKey] > 0,
      );

      for (const element of packsToExchange) {
        const item = element;
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
      toast.success("Your NFTs have been exchanged succesfully!");
      handleSetBalancePacks();
      setTimeout(() => {
        hide();
        setLoading(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error("Ups! Error exchanging your tokens, please try again");
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

      if (cardsToExchange.length == 0) {
        return toast.error("You don't have cards to exchange.");
      }

      for (const element of cardsToExchange) {
        const item = element;
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
      console.log(balanceEG, getExchangeType(balanceEG));
      setExchangeType(getExchangeType(balanceEG));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 1500);
      dispatch(onGetAssets({ address: user, blockchain }));
      toast.success("Your NFTs have been exchanged succesfully!");
      handleSetBalanceEG();
      setCongrats(true);
    } catch (error) {
      console.log(error);
      toast.error("Ups! Error exchanging your tokens, please try again");
      hide();
      setLoading(false);
      setSuccess(false);
    }
  };

  const claimAllAchievements = async () => {
    setLoading(true);
    try {
      await updateBlockchain("linea");
      const cardsToExchange = achievementsEG
        .filter((item) => balanceAchievements[item.nameKey].balance > 0)
        .map((item) => balanceAchievements[item.nameKey]);
      const verifierContract = await getContractCustom(
        "SigVerifier",
        verifier,
        provider,
      );
      const data = await handleSetBalanceAchievements();
      console.log(data, "data");
      for (const element of cardsToExchange) {
        const item = element;
        console.log(JSON.parse(item.signedData), item.signature);
        const res = await verifierContract.methods
          .verify(JSON.parse(item.signedData), item.signature)
          .call();

        // const res = await verifierContract.methods
        //   .execute(JSON.parse(item.signedData), item.signature)
        //   .send({ from: user });
        console.log(res, "res");
        if (res?.payload?.err) {
          throw new Error(res?.payload.err.message);
        }
      }
      await handleSetBalanceAchievementsClaimed();
      toast.success("Your NFTs have been exchanged succesfully!");
      handleSetBalanceEG();
      setCongrats(true);
    } catch (error) {
      console.log(error);
      toast.error("Ups! Error exchanging your tokens, please try again");
      hide();
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col w-full 2xl:px-36 md:px-24 px-4 gap-2">
      <div className="flex flex-col gap-1 sm:w-60 w-full sm:pt-36">
        {menuElements(showSection, setShowSection).map(
          ({ name, link, image, active, className, onClick }) => {
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
                <img className={className} src={image} alt="" />
                <p className="text-primary-disabled font-bold">{name}</p>
              </a>
            ) : (
              <div
                onClick={onClick}
                className={clsx(
                  { "bg-gray-800 !border-primary-disabled": active },
                  "flex border border-transparent gap-2 rounded-md p-2 bg-black cursor-pointer items-center",
                )}
              >
                <img className={className} src={image} alt="" />
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
          {congrats && showSection == "cards" ? (
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
                  src="/images/swap/View_Collectibles.png"
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
                  {showSection ? (
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
                  {showSection == "cards" ? (
                    <>
                      {passEG.map((item) => {
                        return (
                          balanceEG[item.nameKey] > 0 && (
                            <div className="flex sm:flex-row flex-col items-center justify-center w-full gap-2 px-2">
                              <div className="flex flex-col sm:w-1/2 w-full bg-[#232323] gap-2 rounded-xl p-4">
                                <h2 className="text-white text-lg text-center">
                                  {item.name}
                                </h2>
                                <div className="flex flex-row-reverse gap-2 w-full">
                                  <img
                                    src={item.image}
                                    className="h-28 flex"
                                    alt=""
                                  />{" "}
                                  <div className="flex flex-col gap-2 w-[110px] justify-center items-center">
                                    <div className="flex flex-col items-center text-[#B8B8B8] px-2 py-1 bg-[#3F3F3F] rounded-xl w-full">
                                      <h3 className="text-[10px] font-[400]">
                                        QUANTITY:
                                      </h3>{" "}
                                      <p className="text-[18px] flex items-center justify-center h-5 font-bold">
                                        {balanceEG[item.nameKey]}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-center text-[#B8B8B8] px-2 py-1 bg-[#3F3F3F] rounded-xl w-full">
                                      <h3 className="text-[10px] font-[400]">
                                        Token Type:
                                      </h3>{" "}
                                      <p className="text-[14px] items-center justify-center flex h-5 font-bold">
                                        ERC-721
                                      </p>
                                    </div>{" "}
                                    <div className="flex flex-col items-center text-[#B8B8B8] px-2 py-1 bg-[#3F3F3F] rounded-xl w-full">
                                      <h3 className="text-[10px] font-[400]">
                                        Blockchain:
                                      </h3>{" "}
                                      <p className="text-[18px] flex h-5 items-center justify-center font-bold">
                                        Matic
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ArrowRightOutlined className="text-xl text-white sm:flex hidden" />
                              <ArrowDownOutlined className="text-xl text-white sm:hidden" />
                              <div className="flex flex-col sm:w-1/2 w-full bg-[#232323] gap-2 rounded-xl p-4">
                                <h2 className="text-white text-lg text-center">
                                  {item.nameResult}
                                </h2>
                                <div className="flex flex-row-reverse gap-2 w-full">
                                  <div className="flex gap-2 justify-center items-center">
                                    <img
                                      src={item.result}
                                      className="h-36 flex"
                                      alt=""
                                    />{" "}
                                    <img
                                      src={item.imageBonus}
                                      className="h-32 flex"
                                      alt=""
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2 px-2 w-[110px] justify-center items-center">
                                    <div className="flex flex-col items-center text-[#B8B8B8] px-2 py-1 bg-[#3F3F3F] rounded-xl w-full">
                                      <h3 className="text-[10px] font-[400]">
                                        QUANTITY:
                                      </h3>{" "}
                                      <p className="text-[18px] flex items-center justify-center h-5 font-bold">
                                        {balanceEG[item.nameKey]}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-center text-[#B8B8B8] px-2 py-1 bg-[#3F3F3F] rounded-xl w-full">
                                      <h3 className="text-[10px] font-[400]">
                                        Token Type:
                                      </h3>{" "}
                                      <p className="text-[14px] items-center justify-center flex h-5 font-bold">
                                        ERC-1155
                                      </p>
                                    </div>{" "}
                                    <div className="flex flex-col items-center text-[#B8B8B8] px-2 py-1 bg-[#3F3F3F] rounded-xl w-full">
                                      <h3 className="text-[10px] font-[400]">
                                        Blockchain:
                                      </h3>{" "}
                                      <p className="text-[18px] flex h-5 items-center justify-center font-bold">
                                        Matic
                                      </p>
                                    </div>
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
                    if (!showSection) {
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
        <ModalAchievements
          onClose={() => {
            setCongrats(false);
          }}
          isShow={isShow}
          withoutX
        >
          {congrats && showSection == "cards" ? (
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
                  src="/images/swap/View_Collectibles.png"
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
                  Achievement Claim
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
                  Claim your Achievements
                </h3>
                <p className="text-sm text-primary-disabled text-justify">
                  <span className="text-white"> Note:</span> To claim your
                  achievements, you will need to complete{" "}
                  {
                    Object.keys(balanceAchievements)
                      ?.map((item) => balanceAchievements[item].balance)
                      ?.filter((item) => item > 0).length
                  }{" "}
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
                <div className="flex flex-wrap gap-6 items-center justify-center w-full py-4">
                  <>
                    {achievementsEG
                      .filter((item) => {
                        return balanceAchievements[item.nameKey].balance > 0;
                      })
                      .map((item) => {
                        return (
                          <div className="flex items-center justify-start flex-col w-48 h-72 border-2 border-[#626262] relative">
                            <div className="h-12 flex w-full border-b-2 border-[#626262]">
                              <div className="w-2/5 flex flex-col border-r-2 border-[#626262]">
                                <p className="font-[500] text-md text-[#B8B8B8] text-center Raleway h-5">
                                  Points
                                </p>
                                <h2 className="text-white flex items-center justify-center text-lg font-bold text-center Raleway h-5">
                                  1000
                                </h2>
                              </div>
                              <div className="w-3/5 flex flex-col">
                                <p className="font-[500] text-md text-[#B8B8B8] text-center Raleway h-5">
                                  Status
                                </p>

                                <h2 className="text-white flex items-center justify-center text-md font-bold text-center Raleway h-5">
                                  COMPLETE!
                                </h2>
                              </div>
                            </div>
                            <div className="flex flex-col h-60 items-center p-2 relative">
                              <img
                                src="/images/swap/bg_achieve.png"
                                className="absolute w-full h-full top-0 left-0 opacity-70"
                                alt=""
                              />
                              <img src={item.image} className="w-20" alt="" />
                              <h2 className="text-white text-xl font-bold text-center Raleway mt-1">
                                {item.name}
                              </h2>
                              <p className="text-white text-xs text-primary-disabled text-center Raleway mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </>
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-4 w-full justify-center items-center py-4">
                <Button
                  className="px-2 py-1 border !border-green-button bg-gradient-to-b from-overlay to-[#233408] rounded-md font-[500]"
                  onClick={() => {
                    claimAllAchievements();
                  }}
                  disabled={loading}
                >
                  Confirm Mint
                </Button>
              </div>
            </div>
          )}
        </ModalAchievements>
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
            {showSection === "packs" ? (
              <>
                {Object.keys(balance)
                  ?.map((item) => {
                    return parseInt(balance[item]);
                  })
                  ?.reduce((acc, num) => {
                    return acc + num;
                  })}
              </>
            ) : showSection === "cards" ? (
              <>
                {Object.keys(balanceEG)
                  ?.map((item) => {
                    return parseInt(balanceEG[item]);
                  })
                  ?.reduce((acc, num) => {
                    return acc + num;
                  })}
              </>
            ) : (
              <>
                {Object.keys(balanceAchievements)
                  ?.map((item) => {
                    return parseInt(balanceAchievements[item].balance);
                  })
                  ?.reduce((acc, num) => {
                    return acc + num;
                  })}
              </>
            )}{" "}
            ERC721 Items
          </div>
          {(showSection === "cards"
            ? Object.keys(balanceEG)
                ?.map((item) => {
                  return parseInt(balanceEG[item]);
                })
                ?.reduce((acc, num) => {
                  return acc + num;
                }) > 0
            : showSection === "packs"
            ? Object.keys(balance)
                ?.map((item) => {
                  return parseInt(balance[item]);
                })
                ?.reduce((acc, num) => {
                  return acc + num;
                }) > 0
            : Object.keys(balanceAchievements)
                ?.map((item) => {
                  return parseInt(balanceAchievements[item].balance);
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
              {showSection !== "achievements" ? (
                <>
                  Swap {showSection == "cards" ? "Cards" : "Packs"} All to
                  ERC1155
                </>
              ) : (
                "Mint All Achievements!"
              )}
            </Button>
          )}
        </div>
        <div className="flex w-full gap-1">
          <div className="flex flex-col items-center justify-start gap-4 min-h-[calc(75vh)] border border-overlay-border bg-overlay rounded-xl p-4 overflow-auto w-full">
            <div className="flex flex-col md:items-start md:justify-start justify-center items-center gap-6 w-full pt-6 pl-6">
              <h2 className="sm:text-5xl text-3xl font-bold text-white">
                {showSection == "cards"
                  ? "Card Pass Swap"
                  : showSection == "packs"
                  ? "Pack Pass Swap"
                  : "Unlocked Achievements"}
              </h2>
              <p className="text-primary-disabled md:w-[60%] w-full md:text-xl sm:text-lg text-sm">
                {showSection !== "achievements"
                  ? `Swap your official Enders Gate Card Pass (721) tokens to
                official Enders Gate Trading Card (1155) tokens by selecting the
                desired quantity and completing the swap process.`
                  : `Claim Enders Gate Soul Bound tokens.`}
              </p>
            </div>
            <div className="flex sm:flex-wrap sm:justify-start items-start justify-center w-full min-h-[calc(60vh)] px-10">
              {Object.keys(
                showSection == "cards"
                  ? balanceEG
                  : showSection == "packs"
                  ? balance
                  : balanceAchievements,
              )
                ?.map((item) =>
                  showSection == "cards"
                    ? balanceEG[item]
                    : showSection == "packs"
                    ? balance[item]
                    : balanceAchievements[item].balance,
                )
                ?.reduce((acc, num) => parseInt(acc) + parseInt(num)) > 0 ? (
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center justify-center gap-4">
                  <>
                    {showSection == "packs" ? (
                      <>
                        {passPacks
                          .filter((item) => {
                            return balance[item.nameKey] > 0;
                          })
                          .map((item) => {
                            return (
                              <div className="flex items-center flex-col md:w-96 sm:w-72 w-60">
                                <img
                                  src={item.image}
                                  className="w-full"
                                  alt=""
                                />
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
                    ) : showSection == "cards" ? (
                      <>
                        {passEG
                          .filter((item) => {
                            return balanceEG[item.nameKey] > 0;
                          })
                          .map((item) => {
                            return (
                              <div className="flex items-center flex-col md:w-96 sm:w-72 w-60">
                                <img
                                  src={item.image}
                                  className="w-full"
                                  alt=""
                                />
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
                    ) : (
                      <>
                        {achievementsEG
                          .filter((item) => {
                            return (
                              balanceAchievements[item.nameKey].balance > 0
                            );
                          })
                          .map((item) => {
                            return (
                              <div className="flex items-center flex-col md:w-96 sm:w-72 w-60 md:px-10">
                                <img
                                  src={item.image}
                                  className="w-[250px]"
                                  alt=""
                                />
                                <h2 className="text-white text-xl font-bold text-center Raleway mt-1">
                                  {item.name}
                                </h2>
                                <p className="text-sm text-primary-disabled Raleway text-center pb-2">
                                  {item.description}
                                </p>
                                <p className="text-md text-primary-disabled Raleway">
                                  QUANTITY:{" "}
                                  {balanceAchievements[item.nameKey].balance}
                                </p>
                                <p className="text-md text-primary-disabled Raleway">
                                  Token: ERC1155
                                </p>
                                <p className="text-md text-primary-disabled Raleway">
                                  Blockchain: Linea{" "}
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
                  <h2 className="text-xl font-[500] text-primary-disabled text-center">
                    You don't have any{" "}
                    {showSection !== "achievements"
                      ? "Pass NFT"
                      : "Achievement to claim"}
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
        {showSection == "achievements" && (
          <div className="flex w-full gap-1 pt-4">
            <div className="flex flex-col items-center justify-start gap-4 min-h-[calc(75vh)] border border-overlay-border bg-overlay rounded-xl p-6 overflow-auto w-full">
              <div className="flex flex-col md:items-start md:justify-start justify-center items-center w-full">
                <h2 className="text-xl font-bold text-white">
                  Earned Achievements
                </h2>
                <p className="text-primary-disabled md:w-[60%] w-full md:text-xl sm:text-lg text-sm">
                  Your recent achievements you’ve earned.
                </p>
              </div>
              <div className="flex flex-wrap w-[95%] min-h-[calc(60vh)] border-2 border-[#5B5243] p-4 gap-2">
                {Object.keys(balanceAchievementsClaimed)
                  ?.map((item) => balanceAchievementsClaimed[item])
                  ?.reduce((acc, num) => parseInt(acc) + parseInt(num)) > 0 ? (
                  <>
                    {
                      <>
                        {achievementsEG
                          .filter((item) => {
                            return balanceAchievementsClaimed[item.nameKey] > 0;
                          })
                          .map((item) => {
                            return (
                              <div className="flex items-center justify-start flex-col w-48 h-72 border-2 border-[#626262] relative">
                                <div className="h-12 flex w-full border-b-2 border-[#626262]">
                                  <div className="w-2/5 flex flex-col border-r-2 border-[#626262]">
                                    <p className="font-[500] text-md text-[#B8B8B8] text-center Raleway h-5">
                                      Points
                                    </p>
                                    <h2 className="text-white flex items-center justify-center text-lg font-bold text-center Raleway h-5">
                                      1000
                                    </h2>
                                  </div>
                                  <div className="w-3/5 flex flex-col">
                                    <p className="font-[500] text-md text-[#B8B8B8] text-center Raleway h-5">
                                      Status
                                    </p>

                                    <h2 className="text-white flex items-center justify-center text-md font-bold text-center Raleway h-5">
                                      COMPLETE!
                                    </h2>
                                  </div>
                                </div>
                                <div className="flex flex-col h-60 items-center p-2 relative">
                                  <img
                                    src="/images/swap/bg_achieve.png"
                                    className="absolute w-full h-full top-0 left-0 opacity-70"
                                    alt=""
                                  />
                                  <img
                                    src={item.image}
                                    className="w-20"
                                    alt=""
                                  />
                                  <h2 className="text-white text-xl font-bold text-center Raleway mt-1">
                                    {item.name}
                                  </h2>
                                  <p className="text-white text-xs text-primary-disabled text-center Raleway mt-1">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </>
                    }
                  </>
                ) : (
                  <div className="flex flex-col gap-2 h-full w-full items-center justify-center">
                    <img src={Icons.logoCard} className="w-20" alt="" />
                    <h2 className="text-xl font-[500] text-primary-disabled text-center">
                      You don't have any achievement SBT yet!
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
