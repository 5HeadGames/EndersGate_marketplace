import React from "react";
import NFTDetailSaleComponent from "@shared/components/NFTDetail/NFTDetailSale";
import {useRouter} from "next/router";

const NFTDetailSale = () => {
  const router = useRouter();
  const {id} = router.query;
  return <NFTDetailSaleComponent id={id} />;
};

export default NFTDetailSale;
