import React from "react";

export const AddressText = ({text}) => {
  return <>{"(" + (text?.substring(0, 5) || "") + "..." + (text?.substring(36) || "") + ")"}</>;
};

export const TransactionText = ({text}) => {
  return <>{(text?.substring(0, 7) || "") + "..." + text?.substring(40) || ""}</>;
};
