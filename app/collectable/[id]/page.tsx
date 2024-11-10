/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import {useParams, useRouter} from "next/navigation";

const Collectable = (props) => {
  const router = useRouter();
  const params = useParams();
  // const nftId = query.id

  React.useEffect(() => {
    if (params && !params.id) router.push("/marketplace");
  }, []);

  return <div className="flex justify-center align-center p-4"></div>;
};

export default Collectable;
