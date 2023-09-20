import React from "react";
import { useRouter } from "next/router";
import ComicDetailIDComponent from "@shared/components/NFTDetail/comicsDetail";

const Card = () => {
  const router = useRouter();
  const { id } = router.query;
  return <ComicDetailIDComponent inventory id={id} />;
};

export default Card;
