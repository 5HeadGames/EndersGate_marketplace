import React from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  editCartComics,
  removeAllComics,
  removeFromCartComics,
} from "@redux/actions";
import Web3 from "web3";
import clsx from "clsx";
import comic from "../../../comics.json";

import { XIcon } from "@heroicons/react/solid";
import {
  getAddressesEth,
  getContractCustom,
  getTokensAllowed,
  getTokensAllowedEth,
  switchChain,
} from "@shared/web3";
import { nFormatter } from "../../common/specialFields/SpecialFields";
import { getDatabase, ref, set } from "firebase/database";

export const Modals = ({
  priceUSD,
  priceMatic,
  setComicsOwned,
  ModalAddress,
  getPriceMatic,
  Modal,
  hide,
  preBuy,
  setPreBuy,
  dataAddress,
  showAddress,
  isShow,
}) => {
  const { ethAddress: account } = useSelector(
    (state: any) => state.layout.user,
  );

  const [tokenSelected, setTokenSelected] = React.useState("");
  const [messageBuy, setMessageBuy] = React.useState("");

  const tokensAllowed = getTokensAllowedEth();

  const { networkEth, providerEth, provider, cartComics } = useSelector(
    (state: any) => state.layout,
  );

  const { comics: comicsAddress, MATICUSD } = getAddressesEth();

  const db = getDatabase();

  const dispatch = useDispatch();

  const getComicsNFTs = async () => {
    const comics = getContractCustom("Comics", comicsAddress, providerEth);
    const nftsId = await comics.methods.comicIdCounter().call();
    const balances = await comics.methods
      .balanceOfBatch(
        new Array(parseInt(nftsId)).fill(account),
        new Array(parseInt(nftsId)).fill(1).map((i, id) => id + 1),
      )
      .call();

    setComicsOwned(
      balances.map((i, id) => {
        return { id: id + 1, balance: parseInt(i) };
      }),
    );
  };

  const buyComics = async () => {
    await switchChain(networkEth);
    const comics = getContractCustom("Comics", comicsAddress, provider);
    if (tokenSelected === "") {
      return;
    }
    try {
      setMessageBuy(`Processing your purchase...`);
      const { ids, amounts, token } = {
        ids: cartComics.map((item) => item.id),
        amounts: cartComics.map((item) => item.quantity.toString()),
        token: tokenSelected,
      };
      let price = "0";
      const ERC20 = getContractCustom("ERC20", token, providerEth);
      const addressesAllowed = getTokensAllowed();
      if (
        tokenSelected ===
        addressesAllowed.filter((item) => item.name == "MATIC")[0].address
      ) {
        const Aggregator = getContractCustom(
          "Aggregator",
          MATICUSD,
          providerEth,
        );

        const priceMATIC = await Aggregator.methods.latestAnswer().call();
        const preprice =
          (parseFloat(
            cartComics
              ?.map((item, i) => {
                return (parseInt(item.priceUSD) / 10 ** 6) * item.quantity;
              })
              .reduce((item, acc) => {
                return item + acc;
              }),
          ) *
            10 ** 8) /
          priceMATIC;

        const priceContract = await comics.methods
          .getPrice(tokenSelected, cartComics[0].id, cartComics[0].quantity)
          .call();

        console.log(priceMATIC, preprice, priceContract);

        price = Web3.utils.toWei(
          (preprice + preprice * 0.00005).toFixed(10).toString(),
          "ether",
        );

        await comics.methods
          .buyBatch(account, ids, amounts, token)
          .send({ from: account, value: price });
      } else {
        const allowance = await ERC20.methods
          .allowance(account, comicsAddress)
          .call();

        if (allowance < 1000000000000) {
          setMessageBuy(
            `Increasing the allowance of ${
              tokensAllowed.filter((item) => item.address == tokenSelected)[0]
                .name
            } 1/2`,
          );
          await ERC20.methods
            .increaseAllowance(
              comicsAddress,
              "1000000000000000000000000000000000000000000000000",
            )
            .send({
              from: account,
            });
          setMessageBuy("Buying your NFT(s) 2/2");
          await comics.methods
            .buyBatch(account, ids, amounts, token)

            .send({ from: account });
        } else {
          setMessageBuy("Buying your NFT(s)");
          await comics.methods
            .buyBatch(account, ids, amounts, token)

            .send({ from: account });
        }
      }
      set(ref(db, "comics/" + account), dataAddress);
    } catch (error) {
      console.log(error);
    }
    setMessageBuy(``);
    setPreBuy(true);
    await getComicsNFTs();
    hide();
    dispatch(removeAllComics());
  };

  React.useEffect(() => {
    setTokenSelected(tokensAllowed[0].address);
  }, [tokensAllowed]);

  return (
    <>
      {ModalAddress}
      <Modal
        cart={cartComics}
        removeAll={removeAllComics}
        messageBuy={messageBuy}
        tokensAllowed={tokensAllowed}
        withoutX
        tokenSelected={tokenSelected}
        setTokenSelected={setTokenSelected}
        isShow={isShow}
        onClose={() => {
          setPreBuy(true);
        }}
        buy={
          preBuy
            ? () => {
                showAddress();
                hide();
              }
            : buyComics
        }
        priceMatic={priceMatic}
        isMatic={false}
        itemsCart={cartComics.map((item, index) => {
          return (
            <div
              className={
                "py-2 flex items-center justify-between gap-8 text-white cursor-pointer w-full px-2 border border-transparent-color-gray-200 rounded-xl"
              }
              onClick={item.onClick}
            >
              <div className="flex items-center justify-start gap-2 w-full">
                <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-20 w-20">
                  <img
                    src={comic[item.id - 1]?.comic_banner}
                    className={`absolute bottom-0 top-0 left-[-40%] right-0 m-auto min-w-[175%]`}
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className={"text-md font-[700] uppercase"}>
                    {comic[item.id - 1]?.name}
                  </h3>

                  <div className="flex gap-2 items-end">
                    <img src={"icons/logo.png"} className="w-8 h-8" alt="" />
                    <img src="icons/POLYGON.svg" className="w-6 h-6" alt="" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <div className="flex flex-col !shrink-0">
                  <h3 className={"text-sm font-[700] whitespace-nowrap w-24"}>
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
                  className="text-lg px-2 text-white w-12 bg-transparent rounded-xl border border-overlay-overlay"
                  onChange={(e) => {
                    dispatch(
                      editCartComics({
                        id: index,
                        item: {
                          ...item,
                          quantity: e.target.value,
                          priceUSD: priceUSD,
                        },
                      }),
                    );
                    getPriceMatic();
                  }}
                ></input>
                <div
                  className="rounded-full p-1 w-8 h-8 border border-transparent-color-gray-200 hover:bg-red-primary text-white shrink-0 cursor-pointer"
                  onClick={() => {
                    dispatch(removeFromCartComics({ id: item.id }));
                  }}
                >
                  <XIcon></XIcon>
                </div>
              </div>
            </div>
          );
        })}
      />
    </>
  );
};
