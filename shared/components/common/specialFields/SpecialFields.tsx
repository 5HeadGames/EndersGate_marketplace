import React from "react";
import { convertArrayCards } from "../convertCards";

const cards = convertArrayCards();

export const AddressText = ({ text }) => {
  return (
    <>
      {"(" +
        (text?.substring(0, 5) || "") +
        "..." +
        (text?.substring(36) || "") +
        ")"}
    </>
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
