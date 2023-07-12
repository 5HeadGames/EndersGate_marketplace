import React from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import RecentlyAddedComic from "./RecentlyAddedComic";

const ComicButtons = ({ priceUSD, getPriceMatic, balance, showCart }) => {
  const [element, setElement] = React.useState("recentlyAddedComic");

  const map = {
    recentlyAddedComic: (
      <RecentlyAddedComic
        getPriceMatic={getPriceMatic}
        showCart={showCart}
        priceUSD={priceUSD}
        balance={balance}
      />
    ),
  };

  const renderElements = (value) => {
    return map[value];
  };

  return (
    <Flex
      flexDir="column"
      bgImage={"/images/ComicSeriesBgColor.png"}
      justifyContent="center"
      alignItems="center"
    >
      {renderElements(element)}
    </Flex>
  );
};

export default ComicButtons;
