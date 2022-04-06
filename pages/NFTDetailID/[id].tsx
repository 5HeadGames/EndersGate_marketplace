import React from "react";
import "shared/firebase";
import NFTDetailIDComponent from "@shared/components/NFTDetail/NFTDetailID";
import { useRouter } from "next/router";

const NFTDetailID = () => {
  const router = useRouter();
  const { id } = router.query;
  return <NFTDetailIDComponent inventory id={id} />;
};

export default NFTDetailID;
