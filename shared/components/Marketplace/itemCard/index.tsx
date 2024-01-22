"use client";
import React from "react";
import { RentCard } from "./cardTypes/rentCard";
import { OpenseaCard } from "./cardTypes/openseaCard";
import { InventoryCard } from "./cardTypes/inventoryCard";
import { SaleCard } from "./cardTypes/saleCard";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  classes: Partial<Record<"root", string>>;
  icon: string;
  name: any;
  byId: boolean;
  type?: string;
  sale: any;
  setPage?: any;
  currency?: any;
  isRent?: boolean;
}

const NFTCard: React.FunctionComponent<Props> = (props) => {
  const { classes, sale, icon, name, setPage, isRent } = props;
  return (
    <>
      {props.byId ? (
        <InventoryCard {...props} />
      ) : props.type != "opensea" ? (
        <>
          {isRent ? (
            <RentCard
              rent={sale}
              classes={classes}
              icon={icon}
              name={name}
              setPage={setPage}
            />
          ) : (
            <SaleCard
              sale={sale}
              classes={classes}
              icon={icon}
              name={name}
              setPage={setPage}
            />
          )}
        </>
      ) : (
        <OpenseaCard {...props} />
      )}
    </>
  );
};

export default NFTCard;
