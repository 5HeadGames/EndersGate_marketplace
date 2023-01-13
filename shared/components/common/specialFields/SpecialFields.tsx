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

export function findSum(str1, str2) {
  // Before proceeding further, make
  // sure length of str2 is larger.
  console.log(str1, str2, "sum");
  if (str1.length > str2.length) {
    let t = str1;
    str1 = str2;
    str2 = t;
  }

  // Take an empty String for storing result
  let str = "";

  // Calculate length of both String
  let n1 = str1.length,
    n2 = str2.length;

  // Reverse both of Strings
  str1 = str1?.split("").reverse().join("");
  str2 = str2?.split("").reverse().join("");

  let carry = 0;
  for (let i = 0; i < n1; i++) {
    // Do school mathematics, compute sum of
    // current digits and carry
    let sum =
      str1[i].charCodeAt(0) -
      "0".charCodeAt(0) +
      (str2[i].charCodeAt(0) - "0".charCodeAt(0)) +
      carry;
    str += String.fromCharCode((sum % 10) + "0".charCodeAt(0));

    // Calculate carry for next step
    carry = Math.floor(sum / 10);
  }

  // Add remaining digits of larger number
  for (let i = n1; i < n2; i++) {
    let sum = str2[i].charCodeAt(0) - "0".charCodeAt(0) + carry;
    str += String.fromCharCode((sum % 10) + "0".charCodeAt(0));
    carry = Math.floor(sum / 10);
  }

  // Add remaining carry
  if (carry > 0) str += String.fromCharCode(carry + "0".charCodeAt(0));

  // reverse resultant String
  str = str.split("").reverse().join("");

  return str;
}
