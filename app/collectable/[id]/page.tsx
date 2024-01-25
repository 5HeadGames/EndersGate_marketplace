/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

interface Props {}

const Collectable: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const { id } = useParams();
  // const nftId = query.id

  React.useEffect(() => {
    if (!id) router.push("/marketplace");
  }, []);

  return <div className="flex justify-center align-center p-4"></div>;
};

export default Collectable;
