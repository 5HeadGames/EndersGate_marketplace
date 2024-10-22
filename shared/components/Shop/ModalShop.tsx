import { XIcon } from "@heroicons/react/solid";
import {
  buyFromShop,
  buyFromShopNative,
  editCartShop,
  onGetAssets,
  removeAllShop,
  removeFromCartShop,
} from "@redux/actions";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useUser } from "@shared/context/useUser";
import { useModal } from "@shared/hooks/modal";
import { CHAIN_IDS_BY_NAME, CHAIN_TRANSAK_BY_NAME } from "@shared/utils/chains";
import { formatPrice, multiply } from "@shared/utils/formatPrice";
import { packsShop, updateSales } from "@shared/utils/utils";
import {
  getAddresses,
  getContract,
  getContractCustom,
  getNativeBlockchain,
  getTokensAllowed,
  getWeb3,
  hasAggregatorFeed,
  sendFirebaseTx,
  switchChain,
} from "@shared/web3";
import clsx from "clsx";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import Web3 from "web3";
import { AddFundsModal } from "../common/addFunds";
import { findSum } from "../common/specialFields/SpecialFields";

const ModalShop = ({ Modal, isShow, hide, setSales }) => {
  const {
    user: { ethAddress: account, provider, providerName },
  } = useUser();
  const [isValidCode, setValidCode] = useState(false);
  const [tokenSelected, setTokenSelected] = React.useState({
    address: "",
    name: "",
    transak: false,
    main: false,
  });
  const {
    Modal: ModalFunds,
    show: showFunds,
    hide: hideFunds,
    isShow: isShowFunds,
  } = useModal();
  const [messageBuy, setMessageBuy] = React.useState("");

  const [balance, setBalance] = React.useState(0);
  const [priceNative, setPriceNative] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(undefined);

  const { blockchain, updateBlockchain } = useBlockchain();

  const tokensAllowed = getTokensAllowed(blockchain);

  const { cartShop } = useSelector((state: any) => state.layout);

  const { shop: shopAddress, NATIVEUSD } = getAddresses(blockchain);

  React.useEffect(() => {
    if (cartShop.length > 0 && hasAggregatorFeed(blockchain)) {
      getPriceNative(
        cartShop
          ?.map((item: any, i) =>
            ((parseInt(item.price) / 10 ** 6) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }),
      );
    } else {
      setPriceNative(0);
    }
  }, [cartShop]);

  const {
    // register,
    handleSubmit,
    formState: { errors },
    // setError,
    // getValues,
    setValue,
    // clearErrors,
  } = useForm();

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (tokensAllowed) {
      setTokenSelected(tokensAllowed[0]);
    }
  }, [tokensAllowed]);

  React.useEffect(() => {
    if (blockchain) {
      try {
        switchChain(CHAIN_IDS_BY_NAME[blockchain]);
        updateSales({
          blockchain,
          shopAddress,
          setSales,
        });
        dispatch(removeAllShop());
      } catch (err) {
        toast.error(
          "An error occurred while changing the network, please try again.",
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain]);

  const getPriceNative = async (price: any) => {
    const Aggregator = getContractCustom("Aggregator", NATIVEUSD, provider);
    const priceMATIC = await Aggregator.methods.latestAnswer().call();
    const priceNative = (BigInt(price) * BigInt(10 ** 8)) / BigInt(priceMATIC);

    const returnedPrice = parseFloat(
      (
        parseFloat(
          Web3.utils.fromWei(
            (priceNative * BigInt(10 ** 18)).toString(),
            "ether",
          ),
        ) +
        parseFloat(
          Web3.utils.fromWei(
            (priceNative * BigInt(10 ** 18)).toString(),
            "ether",
          ),
        ) *
          0.0005
      ).toFixed(6),
    );
    console.log(returnedPrice, "PRICE");
    setPriceNative(returnedPrice);
    return returnedPrice;
  };

  const hasBalanceNative = async (price) => {
    const web3 = await getWeb3(provider);
    var balance = await web3.eth.getBalance(account);

    if (hasAggregatorFeed(blockchain)) {
      console.log("agg");
      const priceNative = await getPriceNative(price);
      setBalance(parseFloat(Web3.utils.fromWei(balance, "ether")));
      if (priceNative < parseFloat(Web3.utils.fromWei(balance, "ether"))) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log("no agg");
      if (price < balance) {
        return true;
      } else {
        return false;
      }
    }
  };

  const hasBalanceToken = async (price, token) => {
    console.log("token");
    const ERC20 = await getContract("ERC20", token, blockchain);
    var balance = await ERC20.methods.balanceOf(account).call();
    var decimals = await ERC20.methods.decimals().call();
    setBalance(balance / 10 ** decimals);
    if (parseInt(balance) >= parseInt(price)) {
      return true;
    } else {
      return false;
    }
  };

  const hasBalance = async () => {
    console.log("has balance join");
    console.log("has balance", data, blockchain, getAddresses(blockchain));

    const addresses = getTokensAllowed(blockchain);
    if (
      tokenSelected.address ===
      addresses.filter((item) => item.main)[0]?.address
    ) {
      console.log("native");
      return await hasBalanceNative(
        cartShop
          ?.map((item: any, i) =>
            (parseInt(item.price) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }),
      );
    } else {
      console.log("token");

      return await hasBalanceToken(
        cartShop
          ?.map((item: any, i) =>
            (parseInt(item.price) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }),
        tokenSelected.address,
      );
    }
  };

  const buyPacks = async (data) => {
    try {
      setLoading(true);
      if (!(await hasBalance())) {
        showFunds();
        setData(data);
      } else {
        await buyPacksProcess(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const buyPacksProcess = async (data) => {
    const { influencer_code } = data;

    try {
      const changed = await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
      if (!changed) return;
      if (influencer_code && !isValidCode) return;
      updateBlockchain(blockchain);

      if (tokenSelected.address === "") {
        toast.error("Please Select a Payment Method");
        return;
      }

      console.log(tokenSelected);

      let tx: any = "";
      if (!getNativeBlockchain(blockchain)) {
        tx = await dispatch(
          buyFromShop({
            blockchain,
            account,
            tokenSelected: tokenSelected.address,
            provider,
            setMessageBuy,
            cartShop,
          }),
        );
      } else {
        tx = await dispatch(
          buyFromShopNative({
            blockchain,
            account,
            tokenSelected: tokenSelected.address,
            provider,
            setMessageBuy,
            cartShop,
          }),
        );
      }
      if (tx.payload.err) throw Error(tx.payload.err.message);
      if (influencer_code) {
        sendFirebaseTx({ tx: tx.payload, influencer_code });
        setValue("influencer_code", "");
      }
      dispatch(onGetAssets({ address: account, blockchain }));
      updateSales({
        blockchain,
        shopAddress,
        setSales,
      });
      hide();
      dispatch(removeAllShop());
    } catch (error) {
      console.log(error);
    }
    setMessageBuy(``);
  };

  return (
    <>
      <ModalFunds isShow={isShowFunds} withoutX>
        <AddFundsModal
          amount={
            tokenSelected.address ==
            getTokensAllowed(blockchain)?.filter((item) => item.main)[0]
              ?.address
              ? priceNative
              : cartShop.length > 0
              ? cartShop
                  ?.map((item: any, i) =>
                    (
                      (parseInt(item.price) / 10 ** 6) *
                      item.quantity
                    ).toString(),
                  )
                  .reduce((item: any, acc: any) => {
                    return findSum(item, acc) as any;
                  }) || "0"
              : "0"
          }
          reload={hasBalance}
          token={tokenSelected.name}
          tokenSelected={tokenSelected}
          network={CHAIN_TRANSAK_BY_NAME[blockchain]}
          wallet={account}
          balance={balance}
          loading={false}
          onClick={async () => {
            try {
              if (!(await hasBalance())) {
                toast.error("You don't have enough balance to buy.");
              } else {
                console.log("has balance");
                await buyPacksProcess(data);
              }
            } catch (err) {
              console.log(err);
            }
          }}
          hide={hideFunds}
        />
      </ModalFunds>
      <Modal
        blockchain={blockchain}
        isShow={isShow}
        cart={cartShop}
        removeAll={removeAllShop}
        messageBuy={messageBuy}
        withoutX
        tokensAllowed={tokensAllowed}
        setTokenSelected={setTokenSelected}
        tokenSelected={tokenSelected}
        priceMatic={priceNative}
        buy={buyPacks}
        providerName={providerName}
        handleSubmit={handleSubmit}
        errors={errors}
        user={account}
        isValidCode={isValidCode}
        loading={loading}
        itemsCart={cartShop.map((item: any, index) => {
          return (
            <div
              key={"pack-shop-" + item.nftId}
              className={clsx(
                "py-2 flex items-center justify-between sm:gap-8 gap-2 text-white cursor-pointer w-full px-2 border border-transparent-color-gray-200 rounded-xl",
              )}
            >
              <div className="flex items-center justify-start gap-2 w-full">
                <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 sm:h-20 sm:w-20 w-16 h-16">
                  <img
                    src={packsShop[item.nftId]?.imagePack}
                    className={`absolute top-[-40%] left-[-40%] right-0 m-auto min-w-[175%]`}
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3
                    className={clsx("sm:text-md text-sm font-[700] uppercase")}
                  >
                    {packsShop[item.nftId]?.name}
                  </h3>

                  <div className="flex gap-2 items-end">
                    <img
                      src={"icons/logo.png"}
                      className="sm:w-8 sm:h-8 w-7 h-7"
                      alt=""
                    />
                    <img
                      src={`/images/${blockchain}.png`}
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
                      "text-sm font-[700] whitespace-nowrap sm:w-24 w-16",
                    )}
                  >
                    Price:
                  </h3>
                  <h3
                    className={clsx(
                      "text-sm font-[700] uppercase whitespace-nowrap sm:w-24 w-16",
                    )}
                  >
                    {formatPrice(item.price, blockchain)}
                  </h3>
                </div>
                <input
                  defaultValue={item.quantity}
                  type="number"
                  min={1}
                  className="text-lg px-2 text-white w-12 bg-transparent rounded-xl border border-overlay-overlay"
                  onChange={(e) => {
                    dispatch(
                      editCartShop({
                        id: index,
                        item: { ...item, quantity: e.target.value },
                      }),
                    );
                  }}
                ></input>
                <div
                  className="rounded-full p-1 w-8 h-8 border border-transparent-color-gray-200 hover:bg-red-primary text-white shrink-0 cursor-pointer"
                  onClick={() => {
                    dispatch(removeFromCartShop({ id: item.id }));
                  }}
                >
                  <XIcon />
                </div>
              </div>
            </div>
          );
        })}
      />
    </>
  );
};

export default ModalShop;
