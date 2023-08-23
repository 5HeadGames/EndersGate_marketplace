import React from "react";
import NFTDetailSaleComponent from "@shared/components/NFTDetail/sale";
import { useRouter } from "next/router";

const Sale = () => {
  const router = useRouter();
  const { id } = router.query;
  return <NFTDetailSaleComponent id={id} />;
};

export default Sale;
