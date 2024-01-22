"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import PackDetailComponent from "@shared/components/PackDetail";

const Pack = () => {
  const router = useRouter();
  const { id } = useParams();
  return <PackDetailComponent inventory id={id} />;
};

export default Pack;
