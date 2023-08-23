import { authStillValid } from "@shared/components/utils";
import { getAddressesEth, getContractCustom } from "@shared/web3";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import comicDetails from "../../../comics.json";
import Reader from "./ComicsReader";

export const ComicSlider = () => {
  const { name: comicName, issue } = useRouter().query;
  const router = useRouter();
  const { ethAddress: user } = useSelector((state: any) => state.layout.user);

  const { account } = useWeb3React();

  const { providerEth } = useSelector((state: any) => state.layout);

  const { comics: comicsAddress } = getAddressesEth();

  const accountUpdate = async () => {
    if (!Boolean(account) && !Boolean(user) && !authStillValid()) {
      return router.push("/login?redirect=true&redirectAddress=/comics");
    } else if (account) {
      await getComicID();
    }
  };

  const currentComic = comicDetails?.find((comic) => {
    return comic.nameLink === comicName;
  });

  const comicImage = currentComic?.issues[issue as string]?.pages;

  const sliderImage = comicImage?.pages_pannels;

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

    // comic.issue.id corresponds to the ID of the NFT in the smart contract
    if (!balanceCheck.includes(currentComic?.issues[issue as string]?.id)) {
      return router.push("/login?redirect=true&redirectAddress=/comics");
    }
  };

  return (
    <div className="pt-16">
      <Reader images={sliderImage} />
    </div>
  );
};
