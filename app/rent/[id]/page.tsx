"use client";
import React from "react";
import { useParams } from "next/navigation";
import NFTDetailRentComponent from "@shared/components/NFTDetail/rent";

const Rent = () => {
  const { id } = useParams();
  return <NFTDetailRentComponent id={id} />;
};

export default Rent;
