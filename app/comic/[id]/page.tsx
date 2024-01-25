"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import ComicDetailIDComponent from "@shared/components/NFTDetail/comicsDetail";

const Card = () => {
  const router = useRouter();
  const { id } = useParams();
  return <ComicDetailIDComponent inventory id={id} />;
};

export default Card;
