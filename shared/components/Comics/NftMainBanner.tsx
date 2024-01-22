"use client";
import React from "react";
import { Flex, Text } from "@chakra-ui/react";

function NftMainBanner() {
  return (
    <Flex
      borderBottom="2px solid #5A5A5A"
      className="content-background main-container-md"
      flexDir="column"
      w="100%"
      textAlign="center"
      py={[5, 5, 10, 10]}
      h={["11.5rem"]}
      justifyContent="center"
      bgImage={`url(${"/images/Banner1.jpg"})`}
      bgPosition="center"
      bgSize="cover"
    >
      <Flex justifyContent={"center"}>
        <Text
          my="50px"
          fontSize={["30px", "50px", "65px", "65px"]}
          ml={3}
          color="#FFFFFF"
          fontWeight="800"
          className="text-shadow"
          top="-8097px"
        >
          COMICS
        </Text>
      </Flex>
    </Flex>
  );
}

export default NftMainBanner;
