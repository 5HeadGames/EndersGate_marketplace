import React from "react";
import { useRouter } from "next/router";
import NFTDetailRentComponent from "@shared/components/NFTDetail/rent";

const Rent = () => {
  const router = useRouter();
  const { id } = router.query;
  return <NFTDetailRentComponent id={id} />;
};

export default Rent;
