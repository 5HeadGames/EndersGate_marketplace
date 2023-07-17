/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useRouter } from "next/router";

interface Props {}

const Collectable: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const { query } = router;
  // const nftId = query.id

  React.useEffect(() => {
    if (!query.id) router.push("/marketplace");
  }, []);

  return <div className="flex justify-center align-center p-4"></div>;
};

export default Collectable;
