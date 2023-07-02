import React from "react";
import { Flex, Input, Text, Button } from "@chakra-ui/react";

function Comic() {
  return (
    <>
      <Flex
        flexDir="column"
        pt={10}
        justifyContent="center"
        className="main-container-md"
        alignItems="center"
        w="full"
        bg="footer"
        zIndex={1}
        bgImage={"/images/Backgroundcomic.png"}
        bgPosition="center"
        bgSize="cover"
      >
        <Text
          mt={75}
          fontSize={["2xl", "3xl", "4xl", "5xl"]}
          className="text-shadow-comic-comics-heading"
          color="white"
          w={["250px", "300px", "300px", "510px"]}
          fontWeight="semibold"
          textAlign="center"
          zIndex="10"
        >
          NEVER MISS A COMICS!
        </Text>

        <Text
          cursor="pointer"
          color="white"
          fontWeight="semibold"
          fontSize={["sm", "sm", "md", "md"]}
          textAlign="center"
          className="text-shadow-comic-comics-text"
          zIndex="10"
        >
          Want to stay updated with our latest comic releases?
        </Text>

        <Text
          cursor="pointer"
          mt={["2", "29"]}
          fontWeight="semibold"
          color="white"
          bgColor="black"
          fontSize={["xs", "xs", "md", "md"]}
          zIndex="10"
        >
          ENTER YOUR EMAIL ADDRESS
        </Text>

        <Flex bgColor="black" mt={["2", "17"]} paddingX={2} paddingBottom={2}>
          <Input
            className="email-input-comics"
            borderRadius={0}
            width="auto"
            zIndex="10"
          />
        </Flex>
        {/* htmlSize={['20', '20', '29', '49px']} */}
        <Button
          mb={100}
          mt={5}
          h="8"
          bgColor={"black"}
          borderRadius="0px"
          fontSize="md"
          w="32"
          p={0}
          color="white"
          zIndex="10"
        >
          Subscribe
        </Button>
      </Flex>
    </>
  );
}

export default Comic;
