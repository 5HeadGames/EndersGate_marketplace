/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import NftMainBanner from "./NftMainBanner";
import NftFooter from "./NftFooter";
import ComicButtons from "./ComicSliders/ComicButtons";
import { Flex } from "@chakra-ui/react";
import { ShopOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getAddresses, getContract, getNativeBlockchain } from "@shared/web3";
import { useModalAddressUser } from "./Modals/ModalAdddressUser";
import { Modals } from "./Modals";
import { useCartComicsModal } from "./Modals/ModalCartComics";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAINS, CHAIN_IDS_BY_NAME } from "../../utils/chains";
import { formatPrice } from "@shared/utils/formatPrice";
import { useUser } from "@shared/context/useUser";

function Comics() {
  const { Modal, show, isShow, hide } = useCartComicsModal();

  const [preBuy, setPreBuy] = React.useState(true);
  const [dataAddress, setDataAddress] = React.useState(true);

  const handleSubmitAddressModal = (data: any) => {
    setPreBuy(false);
    setDataAddress(data);
    show();
  };

  const {
    ModalAddress,
    show: showAddress,
    hide: hideAddress,
  } = useModalAddressUser({
    onSubmit: handleSubmitAddressModal,
    onClose: () => {
      hide();
      hideAddress();
      setPreBuy(true);
    },
    noClose: true,
  });

  const {
    user: { ethAddress: account },
  } = useUser();
  const [priceNative, setPriceNative] = React.useState("0");
  const [basePrice, setBasePriceMatic] = React.useState("0");
  const [price, setPrice] = React.useState("0");
  const [balance, setComicsOwned] = React.useState([]);

  const { cartComics } = useSelector((state: any) => state.layout);

  const { blockchain } = useBlockchain();

  const { comics: comicsAddress, MATICUSD: NATIVEUSD } =
    getAddresses(blockchain);

  const getComicsNFTs = async () => {
    const comics = getContract(
      getNativeBlockchain(blockchain) ? "ComicsNative" : "Comics",
      comicsAddress,
      blockchain,
    );
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

  const getPrice = async () => {
    const comics = getContract(
      getNativeBlockchain(blockchain) ? "ComicsNative" : "Comics",
      comicsAddress,
      blockchain,
    );
    const price = await comics.methods
      .comics(await comics.methods.comicIdCounter().call())
      .call();
    if (getNativeBlockchain(blockchain)) {
      setPrice(price.price);
    } else {
      const Aggregator = getContract("Aggregator", NATIVEUSD, blockchain);
      const priceMATIC = await Aggregator.methods.latestAnswer().call();
      setBasePriceMatic(priceMATIC);
      setPrice(price.priceUSD);
    }
  };

  const getPriceNative = async () => {
    try {
      if (!getNativeBlockchain(blockchain)) {
        const Aggregator = getContract("Aggregator", NATIVEUSD, blockchain);
        const priceNative = await Aggregator.methods.latestAnswer().call();
        const price =
          (parseFloat(
            cartComics
              ?.map((item) => {
                return (parseInt(item.price) / 10 ** 6) * item.quantity;
              })
              ?.reduce((item, acc) => {
                return item + acc;
              }),
          ) *
            10 ** 8) /
          Number(priceNative);

        setPriceNative(
          (price + price * (5 / 1000000)).toFixed(5).toString() +
            " " +
            CHAINS[CHAIN_IDS_BY_NAME[blockchain]].nativeCurrency.symbol,
        );
      } else {
        const price = cartComics
          ?.map((item) => {
            return BigInt(item.price) * BigInt(item.quantity);
          })
          ?.reduce((item, acc) => {
            return BigInt(item) + BigInt(acc);
          });

        setPriceNative(formatPrice(price, blockchain));
      }
    } catch (e) {}
  };

  React.useEffect(() => {
    if (comicsAddress) {
      getPrice();
    }
  }, [comicsAddress, blockchain]);

  React.useEffect(() => {
    if (
      account &&
      comicsAddress &&
      getNativeBlockchain(blockchain) !== undefined
    ) {
      getComicsNFTs();
    }
  }, [account, comicsAddress, blockchain]);

  React.useEffect(() => {
    if (cartComics.length > 0) {
      if ((basePrice && price) || getNativeBlockchain(blockchain)) {
        getPriceNative();
      }
    } else {
      setPriceNative("0");
    }
  }, [cartComics, price, blockchain]);

  return (
    <Flex
      transition=".5s all ease"
      zIndex={10}
      overflowX="hidden"
      top={20}
      pt={54}
      bg="#000000"
      minHeight="100vh"
      flexDir="column"
      className="body-bg-color nft-main-container"
    >
      <Modals
        {...{
          price,
          priceNative,
          setComicsOwned,
          ModalAddress,
          getPriceNative,
          Modal,
          hide,
          hideAddress,
          dataAddress,
          preBuy,
          setPreBuy,
          show,
          showAddress,
          isShow,
        }}
      />
      <NftMainBanner />
      <ComicButtons
        getPriceMatic={getPriceNative}
        showCart={show}
        price={price}
        balance={balance}
      />
      {/* <Comic /> */}
      <NftFooter />
      <Flex
        transition=".5s all ease"
        zIndex={124}
        bottom={6}
        right={9}
        flexDir="column"
        className="fixed rounded-xl border border-overlay-border bg-green-button p-4 items-center justify-center cursor-pointer"
        onClick={show}
      >
        {cartComics.length > 0 && (
          <div className="rounded-full px-[8px] py-[2px] absolute flex items-center justify-center top-[-10px] text-[11px] text-overlay bg-white left-[-10px] border border-overlay">
            {cartComics.length}
          </div>
        )}
        <ShopOutlined className="text-2xl flex items-center text-overlay justify-center relative" />
      </Flex>
    </Flex>
  );
}

export default Comics;
