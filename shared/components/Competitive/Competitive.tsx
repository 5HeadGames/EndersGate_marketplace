import React from "react";

import clsx from "clsx";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";

import { XIcon } from "@heroicons/react/solid";
import { useToasts } from "react-toast-notifications";
import { CompetitiveLanding } from "./CompetitiveLanding";
import { WeeklyTournament } from "./WeeklyTournament";
import { Leaderboard } from "./Leaderboard";
import { useUser } from "@shared/context/useUser";
import { getContractCustom, getTokensAllowed } from "@shared/web3";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useModal } from "@shared/hooks/modal";
import useMagicLink from "@shared/hooks/useMagicLink";

const CompetitiveComponent = () => {
  // const {
  //   user: { ethAddress: account, provider, providerName },
  // } = useUser();

  // const [priceMatic, setPriceMatic] = React.useState("0");
  // const [priceUSD, setPriceUSD] = React.useState("0");
  // const [tokenSelected, setTokenSelected] = React.useState("");
  // const [messageBuy, setMessageBuy] = React.useState("");
  const [lastWinners, setLastWinners] = React.useState([]);
  // const { addToast } = useToasts();

  // const { blockchain } = useBlockchain();

  // const tokensAllowed = getTokensAllowed(blockchain);

  // const { Modal, show, isShow, hide } = useModal();

  // const { showWallet } = useMagicLink();

  // const {
  //   network,
  //   addresses: { battlePass: battlePassAddress, MATICUSD },
  //   cartPass,
  // } = useSelector((state: any) => state.blockchain);

  // const dispatch = useDispatch();

  // React.useEffect(() => {
  //   if (cartPass.length > 0) {
  //     getPriceMatic();
  //   } else {
  //     setPriceMatic("0");
  //   }
  // }, [cartPass]);

  // React.useEffect(() => {
  //   setTokenSelected(tokensAllowed[0].address);
  // }, [tokensAllowed]);

  // const getPriceMatic = async () => {
  //   const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
  //   const priceMATIC: any = await Aggregator.methods.latestAnswer().call();
  //   const price =
  //     BigInt(
  //       parseFloat(
  //         cartPass
  //           ?.map((item: any, i: any) => {
  //             return (parseInt(item.priceUSD) / 10 ** 6) * item.quantity;
  //           })
  //           .reduce((item: any, acc: any) => {
  //             return item + acc;
  //           }),
  //       ) *
  //         10 ** 8,
  //     ) / priceMATIC;
  //   const battlePass = getContractCustom(
  //     "BattlePass",
  //     battlePassAddress,
  //     provider,
  //   );
  //   const priceUSD: any = await (battlePass as any).methods
  //     .seasons(await battlePass.methods.currentSeason().call())
  //     .call();

  //   setPriceUSD(priceUSD.priceUSD);
  //   setPriceMatic(
  //     Number(price + (price * BigInt(5)) / BigInt(100))
  //       .toFixed(2)
  //       .toString(),
  //   );
  // };

  // const buyPass = async () => {
  //   switchChain(network);
  //   const battlePass: any = getContractCustom(
  //     "BattlePass",
  //     battlePassAddress,
  //     provider,
  //   );
  //   if (tokenSelected == "") {
  //     addToast("Please Select a Payment Method", { appearance: "error" });
  //     return;
  //   }
  //   try {
  //     setMessageBuy(`Processing your purchase...`);

  //     const { amounts, token } = {
  //       amounts: cartPass.map((item: any) => item.quantity)[0],
  //       token: tokenSelected,
  //     };

  //     let price: any = 0;
  //     const ERC20: any = getContractCustom("ERC20", token, provider);
  //     const addressesAllowed = getTokensAllowed();
  //     if (
  //       tokenSelected ==
  //       addressesAllowed.filter((item) => item.name == "MATIC")[0].address
  //     ) {
  //       const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
  //       const priceMATIC: any = await Aggregator.methods.latestAnswer().call();
  //       const preprice =
  //         (parseFloat(
  //           cartPass
  //             ?.map((item: any) => {
  //               return (parseInt(item.priceUSD) / 10 ** 6) * item.quantity;
  //             })
  //             .reduce((item: any, acc: any) => {
  //               return item + acc;
  //             }),
  //         ) *
  //           10 ** 8) /
  //         priceMATIC;
  //       price = Web3.utils.toWei(
  //         (preprice + preprice * 0.05).toString(),
  //         "ether",
  //       );
  //       await battlePass.methods
  //         .buyRewards(token, amounts)
  //         .send({ from: account, value: price });
  //     } else {
  //       console.log("in", account, battlePass);
  //       const allowance = await ERC20.methods
  //         .allowance(account, battlePass)
  //         .call();
  //       console.log("in", allowance);

  //       if (allowance < 1000000000000) {
  //         setMessageBuy(
  //           `Increasing the allowance of ${
  //             tokensAllowed.filter((item) => item.address == tokenSelected)[0]
  //               .name
  //           } 1/2`,
  //         );
  //         await ERC20.methods
  //           .increaseAllowance(
  //             battlePass,
  //             "1000000000000000000000000000000000000000000000000",
  //           )
  //           .send({
  //             from: account,
  //           });
  //         setMessageBuy("Buying your NFT(s) 2/2");
  //         await battlePass.methods
  //           .buyRewards(tokenSelected, amounts)
  //           .send({ from: account });
  //       } else {
  //         setMessageBuy("Buying your NFT(s)");
  //         await battlePass.methods
  //           .buyRewards(tokenSelected, amounts)
  //           .send({ from: account });
  //       }

  //       // }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setMessageBuy(``);
  //   hide();
  //   dispatch(removePassAll());
  // };

  return (
    <>
      {/* <Modal isShow={isShow} withoutX>
        <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-xl border border-transparent-color-gray-200 relative shadow-inner mt-24">
          <div className="text-white absolute top-2 right-2">
            <XIcon onClick={hide} className="w-6 h-6 cursor-pointer"></XIcon>
          </div>
          <div className="text-center text-xl font-bold text-white">
            Complete checkout
          </div>
          {cartPass.length ? (
            <div className="flex flex-col items-center border border-transparent-color-gray-200 rounded-xl md:min-w-[500px] md:w-max py-2">
              <div className="flex justify-between gap-4 w-full">
                <h2 className="text-lg font-bold text-white opacity-[0.5] py-4 px-4">
                  {cartPass
                    .map((item: any) => item.quantity)
                    .reduce((acc: any, red: any) => acc + red)}{" "}
                  Item
                  {cartPass
                    .map((item: any) => item.quantity)
                    .reduce((acc: any, red: any) => acc + red) > 1
                    ? "s"
                    : ""}
                </h2>{" "}
                <h2
                  className="text-sm font-bold text-white py-4 px-4 cursor-pointer"
                  onClick={() => {
                    dispatch(removePassAll());
                  }}
                >
                  Clear all
                </h2>
              </div>
              <div className="px-4 py-2 pb-4 gap-2 flex flex-col items-center w-full">
                {cartPass.map((item: any, index: any) => {
                  return (
                    <div
                      key={`${item.name}-${index}`}
                      className={clsx(
                        "gap-2 py-2 flex items-center justify-between text-white cursor-pointer w-full px-2 border border-transparent-color-gray-200 rounded-xl",
                      )}
                    >
                      <div className="flex items-center justify-start gap-2 w-full">
                        <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-20 w-20">
                          <img
                            src={"/assets/eg_battlepass_logo.png"}
                            className={`absolute bottom-0 top-0 right-0 m-auto`}
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className={clsx("text-md font-[700] uppercase")}>
                            {item.name}
                          </h3>
                          <div className="flex gap-2 items-end">
                            <img
                              src={"icons/logo.png"}
                              className="w-8 h-8"
                              alt=""
                            />
                            <img
                              src="icons/POLYGON.svg"
                              className="w-6 h-6"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <div className="flex flex-col !shrink-0">
                          <h3
                            className={clsx(
                              "text-sm font-[700] whitespace-nowrap w-24",
                            )}
                          >
                            Price:
                          </h3>
                          <h3
                            className={clsx(
                              "text-sm font-[700] uppercase whitespace-nowrap w-24",
                            )}
                          >
                            {nFormatter(parseInt(item.priceUSD) / 10 ** 6)} USD{" "}
                          </h3>
                        </div>
                        <input
                          defaultValue={item.quantity}
                          type="number"
                          min={1}
                          className="text-lg px-2 text-white w-12 bg-transparent rounded-xl border border-[#14151a]-[#14151a]"
                          onChange={(e) => {
                            console.log(e.target.value);
                            dispatch(
                              editPassCart({
                                id: index,
                                item: { ...item, quantity: e.target.value },
                              }),
                            );
                            getPriceMatic();
                          }}
                        ></input>
                        <div
                          className="rounded-full p-1 w-8 h-8 border border-transparent-color-gray-200 hover:bg-red-primary text-white shrink-0 cursor-pointer"
                          onClick={() => {
                            dispatch(removePassFromCart({ id: item.id }));
                          }}
                        >
                          <XIcon></XIcon>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-md text-white font-bold w-full text-center">
                Chose currency
              </div>
              <div className="flex  gap-4 pb-4 w-full flex-wrap items-center justify-center shadow-inner">
                {tokensAllowed
                  .filter((tokenAllowed) => {
                    let intersection = true;
                    cartPass.forEach((item: any) => {
                      if (
                        !item.tokens
                          .map((item: any) => item?.toLowerCase())
                          .includes(tokenAllowed.address.toLowerCase())
                      ) {
                        intersection = false;
                      }
                    });
                    return intersection;
                  })
                  .map((item, index) => {
                    return (
                      <div
                        key={`${item.address}-${index}`}
                        className={clsx(
                          "w-24 flex items-center justify-center gap-1 rounded-xl cursor-pointer py-1 border border-white",

                          {
                            "bg-transparent-color-gray-200 border-none":
                              tokenSelected !== item.address,
                          },
                          {
                            "bg-[#14151a] border-[#47e439] shadow-[0_0px_10px] shadow-[#47e439]":
                              tokenSelected == item.address,
                          },
                        )}
                        onClick={() => {
                          setTokenSelected(item.address);
                        }}
                      >
                        <img src={item.logo} className="w-6 h-6" alt="" />
                        <h2 className="text-white text-sm font-bold">
                          {item.name}
                        </h2>
                      </div>
                    );
                  })}
              </div>
              <div className="flex gap-6 justify-between w-full text-md text-xl py-2 px-8 border-y border-transparent-color-gray-200 bg-transparent md:w-3/4">
                <div className="flex gap-1 items-center">
                  <h3 className="text-sm  text-white font-[700]">
                    Total price:
                  </h3>
                </div>
                <div className="flex flex-col gap items-end">
                  {tokensAllowed
                    .filter((item) => item.name == "MATIC")
                    .filter((tokenAllowed) => {
                      let intersection = true;
                      cartPass.forEach((item: any) => {
                        if (
                          !item.tokens
                            .map((item: any) => item?.toLowerCase())
                            .includes(tokenAllowed.address.toLowerCase())
                        ) {
                          intersection = false;
                        }
                      });
                      return intersection;
                    }).length > 0 && (
                    <h3
                      className="text-sm font-[700] text-white flex gap-1 items-center justify-center"
                      style={{ fontSize: "14px" }}
                    >
                      {priceMatic} MATIC{" "}
                      <img
                        src="icons/polygon-matic-logo.png"
                        className="w-3 h-3"
                        alt=""
                      />
                    </h3>
                  )}
                  <h3
                    className="text-sm font-[700] text-white opacity-50"
                    style={{ fontSize: "14px" }}
                  >
                    ($
                    {parseInt(
                      cartPass
                        ?.map((item: any) =>
                          (parseInt(item.priceUSD) * item.quantity).toString(),
                        )
                        .reduce((item: any, acc: any) => {
                          return findSum(item, acc);
                        }),
                    ) /
                      10 ** 6}
                    )
                  </h3>
                </div>
              </div>

              {messageBuy !== "" ? (
                <div className="py-2 text-lg text-white font-bold text-center w-full">
                  {messageBuy}
                </div>
              ) : (
                ""
              )}
              <div className="w-full flex items-center justify-center py-2">
                <div
                  onClick={() => {
                    buyPass();
                  }}
                  className="w-auto px-6 py-2 flex justify-center items-center rounded-xl hover:border-[#47e439] hover:bg-[#14151a] hover:text-[#47e439] border border-transparent-color-gray-200 cursor-pointer bg-[#47e439] font-bold text-[#14151a] transition-all duration-500"
                >
                  Checkout
                </div>
              </div>
              {providerName == "magic" && (
                <div
                  className="text-[12px] text-[#47e439] pt-4 font-bold flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => {
                    showWallet();
                  }}
                >
                  <img src="icons/wallet.png" className="w-8 pb-2" alt="" /> Add
                  funds to your wallet
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4 text-md text-center w-64 p-4 border border-transparent-color-gray-200 rounded-xl">
              <img src={"icons/logo.png"} className="w-20 h-20" alt="" />
              {"There aren't items in your cart."}
            </div>
          )}
        </div>
      </Modal> */}
      <div className="bg-[#000000] min-h-screen pt-28 pb-16 flex flex-col gap-16 sm:px-0 px-4 items-center justify-center w-full">
        <CompetitiveLanding />
        {/* <BattlePassProgress show={show} priceUSD={priceUSD} /> */}
        <WeeklyTournament lastWinners={lastWinners} />
        <Leaderboard setLastWinners={setLastWinners} />
      </div>
    </>
  );
};

export default CompetitiveComponent;
