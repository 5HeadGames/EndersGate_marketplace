import React from "react";
import cards from "../../../cards.json";

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
      {cards.All[id].properties?.attack?.value
        ? "Guardian"
        : cards.All[id].properties.type?.value}
    </>
  );
};
