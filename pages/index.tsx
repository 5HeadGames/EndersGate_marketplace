import { useState } from "react";
import NFTTokenIds from "../shared/components/NFTTokenIds";
import "antd/dist/antd.css";
import * as React from "react";
import { GetServerSideProps } from "next";

const App = () => {
  const [inputValue, setInputValue] = useState("explore");

  return <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  };
};

export default App;
