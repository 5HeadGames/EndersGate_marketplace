"use client";
import React from "react";
import CardDetailComponent from "@shared/components/NFTDetail/CardDetail";
import { useParams } from "next/navigation";

const Card = () => {
  const { id } = useParams();
  return <CardDetailComponent inventory id={id} />;
};

export default Card;
