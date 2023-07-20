import React from "react";
import NftMainBanner from "./NftMainBanner";
import NftFooter from "./NftFooter";
import ComicButtons from "./ComicSliders/ComicButtons";
import { Flex } from "@chakra-ui/react";
import { ShopOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getAddressesEth, getContractCustom } from "@shared/web3";
import { useModalAddressUser } from "./Modals/ModalAdddressUser";
import { Modals } from "./Modals";
import { useCartComicsModal } from "./Modals/ModalCartComics";

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
  });

  const { ethAddress: account } = useSelector(
    (state: any) => state.layout.user,
  );

  const [priceMatic, setPriceMatic] = React.useState("0");
  const [basePriceMATIC, setBasePriceMatic] = React.useState("0");
  const [priceUSD, setPriceUSD] = React.useState("0");
  const [balance, setComicsOwned] = React.useState([]);

  const { providerEth, cartComics } = useSelector((state: any) => state.layout);

  const { comics: comicsAddress, MATICUSD } = getAddressesEth();

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

  const getPriceUSD = async () => {
    const comics = getContractCustom("Comics", comicsAddress, providerEth);
    const priceUSD = await comics.methods
      .comics(await comics.methods.comicIdCounter().call())
      .call();
    const Aggregator = getContractCustom("Aggregator", MATICUSD, providerEth);
    const priceMATIC = await Aggregator.methods.latestAnswer().call();
    setBasePriceMatic(priceMATIC);
    setPriceUSD(priceUSD.priceUSD);
  };

  const getPriceMatic = async () => {
    try {
      const price =
        (parseFloat(
          cartComics
            ?.map((item, i) => {
              return (parseInt(priceUSD) / 10 ** 6) * item.quantity;
            })
            ?.reduce((item, acc) => {
              return item + acc;
            }),
        ) *
          10 ** 8) /
        parseInt(basePriceMATIC);
      setPriceMatic((price + price * 0.000005).toFixed(8).toString());
    } catch (e) {}
  };

  React.useEffect(() => {
    getPriceUSD();
  }, [comicsAddress, providerEth]);

  React.useEffect(() => {
    if (account) {
      getComicsNFTs();
    }
  }, [account]);

  React.useEffect(() => {
    if (cartComics.length > 0) {
      if (basePriceMATIC && priceUSD) {
        getPriceMatic();
      }
    } else {
      setPriceMatic("0");
    }
  }, [cartComics, priceUSD]);

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
          priceUSD,
          priceMatic,
          setComicsOwned,
          ModalAddress,
          getPriceMatic,
          Modal,
          hide,
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
        getPriceMatic={getPriceMatic}
        showCart={show}
        priceUSD={priceUSD}
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
