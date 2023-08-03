import { authStillValid } from "@shared/components/utils";
import { getAddressesEth, getContractCustom } from "@shared/web3";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import comicDetails from "../../../comics.json";
import Reader from "./ComicsReader";

export const ComicSlider = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const { name: comicName, issue } = useRouter().query;
  const router = useRouter();
  const { ethAddress: user } = useSelector((state: any) => state.layout.user);

  const { account } = useWeb3React();

  const { providerEth } = useSelector((state: any) => state.layout);

  const { comics: comicsAddress } = getAddressesEth();

  const accountUpdate = async () => {
    if (!account && !user && !authStillValid()) {
      return router.push("/login?redirect=true&redirectAddress=/comics");
    } else if (account) {
      await getComicID();
    }
    setIsLoading(false);
  };

  const currentComic = comicDetails?.find((comic) => {
    return comic.nameLink === comicName;
  });

  const comicImage = currentComic?.issues[issue as string]?.pages;

  const sliderImage = comicImage?.pages_pannels;

  console.log(comicImage, sliderImage);

  React.useEffect(() => {
    if (currentComic) accountUpdate();
  }, [account, currentComic]);

  const getComicID = async () => {
    const comics = getContractCustom("Comics", comicsAddress, providerEth);
    const nftsId = await comics.methods.comicIdCounter().call();
    const balances = await comics.methods
      .balanceOfBatch(
        new Array(parseInt(nftsId)).fill(account),
        new Array(parseInt(nftsId)).fill(1).map((i, id) => id + 1),
      )
      .call();

    const balanceCheck = balances
      .map((i, id) => {
        return { id: id + 1, balance: parseInt(i) };
      })
      .filter((balance) => balance.balance > 0)
      .map((id) => id.id);

    if (!balanceCheck.includes(currentComic?.id)) {
      return router.push("/login?redirect=true&redirectAddress=/comics");
    }
    setIsLoading(false);
  };

  return (
    <div className="pt-16">
      <Reader images={sliderImage} />
    </div>
  );
};
