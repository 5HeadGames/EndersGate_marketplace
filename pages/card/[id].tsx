import React from "react";
import CardDetailComponent from "@shared/components/NFTDetail/CardDetail";
import { useRouter } from "next/router";

const Card = () => {
  const router = useRouter();
  const { id } = router.query;
  return <CardDetailComponent inventory id={id} />;
};

export default Card;
