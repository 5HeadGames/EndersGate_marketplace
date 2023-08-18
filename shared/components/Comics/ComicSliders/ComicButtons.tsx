import React from "react";
import { Flex } from "@chakra-ui/react";
import RecentlyAddedComic from "./RecentlyAddedComic";

const ComicButtons = ({ priceUSD, getPriceMatic, balance, showCart }) => {
  const [element] = React.useState("recentlyAddedComic");

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
      mb={32}
    >
      {renderElements(element)}
    </Flex>
  );
};

export default ComicButtons;
