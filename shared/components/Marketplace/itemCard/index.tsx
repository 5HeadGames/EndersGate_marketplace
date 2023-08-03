import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import Link from "next/link";
import Styles from "./styles.module.scss";
import Web3 from "web3";

import { MarketplaceCard } from "./marketplaceCard";
import { OpenseaCard } from "./openseaCard";
import { InventoryCard } from "./inventoryCard";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  classes: Partial<Record<"root", string>>;
  icon: string;
  name: any;
  byId: boolean;
  type: string;
  sale: any;
  setPage: any;
  currency?: any;
}

const NFTCard: React.FunctionComponent<Props> = (props) => {
  return (
    <>
      {props.byId ? (
        <InventoryCard {...props} />
      ) : props.type != "opensea" ? (
        <MarketplaceCard {...props} />
      ) : (
        <OpenseaCard {...props} />
      )}
    </>
  );
};

export default NFTCard;
