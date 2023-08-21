import React from "react";
import { useRouter } from "next/router";
import PackDetailComponent from "@shared/components/PackDetail";

const Pack = () => {
  const router = useRouter();
  const { id } = router.query;
  return <PackDetailComponent inventory id={id} />;
};

export default Pack;
