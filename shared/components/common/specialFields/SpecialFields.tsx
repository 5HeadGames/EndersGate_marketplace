import React from "react";
import { convertArrayCards } from "../convertCards";

const cards = convertArrayCards();

export const AddressText = ({ text }) => {
  return (
    <>{(text?.substring(0, 5) || "") + "..." + (text?.substring(38) || "")}</>
  );
};

export const TransactionText = ({ text }) => {
  return (
    <>{(text?.substring(0, 7) || "") + "..." + text?.substring(40) || ""}</>
  );
};

export const Type = ({ id }) => {
  return (
    <>
      {cards[id]?.properties?.attack?.value
        ? "Guardian"
        : cards[id].typeCard[0].toUpperCase() +
          cards[id].typeCard.substring(1, cards[id].typeCard.length)}
    </>
  );
};

export const nFormatter = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};
