import React from "react";
import "shared/firebase";
import NFTDetailComponent from "@shared/components/NFTDetail/NFTDetail";
import { useRouter } from "next/router";

const NFTDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  return <NFTDetailComponent id={id} />;
};

export default NFTDetail;
