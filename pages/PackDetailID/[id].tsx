import React from "react";
import { useRouter } from "next/router";
import PackDetailIDComponent from "@shared/components/PackDetail/PackDetailID";

const NFTDetailID = () => {
  const router = useRouter();
  const { id } = router.query;
  return <PackDetailIDComponent inventory id={id} />;
};

export default NFTDetailID;
