"use client";
import React from "react";
import NFTDetailSaleComponent from "@shared/components/NFTDetail/sale";
import { useParams } from "next/navigation";

const Sale = () => {
  const { id } = useParams();
  return <NFTDetailSaleComponent id={id} />;
};

export default Sale;
