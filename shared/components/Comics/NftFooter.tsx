import { Flex, Text, Image, Box } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear().toString();

  return (
    <>
      <Flex justifyContent={"space-between"} className="main-container-lg">
        <Flex className="main-container-md" position="relative">
          {/* <Flex w={'30%'}> */}
          <Image
            src={"/images/footerBgImage1.png"}
            position="absolute"
            bottom="0"
            left="0"
            zIndex="10"
            className="footer-character sm:flex hidden"
          ></Image>
          {/* </Flex> */}

          <Flex
            w={"100%"}
            flexDir={"column"}
            alignItems="center"
            paddingY={["40px", "40px", "80px", "80px"]}
          >
            <Flex flexDir="row" gap={2} alignItems={"center"}>
              <Image
                mt={15}
                src={"/images/worldLogo.png"}
                boxSize={["12px", "14px", "18px", "18px"]}
                zIndex="10"
              ></Image>
              <Text
                mt={15}
                fontSize={["xs", "sm", "md", "md"]}
                color="#B8B8B8"
                fontWeight="semibold"
                ml={["1", "1", "2", "2"]}
                zIndex="10"
              >
                English (US)
              </Text>
            </Flex>

            <Image
              mt={["0", "0", "0", "0"]}
              width={["5rem", "7rem", "10rem", "10rem"]}
              src={"/images/5HEADGAMES.png"}
              zIndex="10"
            />

            <Flex
              mt={["0", "5", "5", "5"]}
              flexDir={["column", "column", "row", "row"]}
              className="align-item-center"
            >
              <Text
                cursor="pointer"
                fontSize={["sm", "md", "md", "md"]}
                color="#B8B8B8"
                fontWeight="semibold"
                zIndex="10"
              >
                JOB APPLICATIONS
              </Text>
              <Box
                display={["none", "none", "block", "block"]}
                width="3px"
                h="2rem"
                mx={6}
                bg="gray.300"
              />
              <Text
                cursor="pointer"
                fontSize={["sm", "md", "md", "md"]}
                color="#B8B8B8"
                fontWeight="semibold"
                zIndex="10"
              >
                ABOUT
              </Text>
              <Box
                display={["none", "none", "block", "block"]}
                width="3px"
                h="2rem"
                mx={6}
                bg="gray.300"
              />
              <Text
                cursor="pointer"
                fontSize={["sm", "md", "md", "md"]}
                fontWeight="semibold"
                color="#B8B8B8"
                zIndex="10"
              >
                CONTACT US
              </Text>
              <Box
                display={["none", "none", "block", "block"]}
                width="3px"
                h="2rem"
                mx={6}
                bg="gray.300"
              />
              <Text
                cursor="pointer"
                fontWeight="semibold"
                fontSize={["sm", "md", "md", "md"]}
                color="#B8B8B8"
                zIndex="10"
              >
                WHITEPAPER
              </Text>
              <Box
                display={["none", "none", "block", "block"]}
                width="3px"
                h="2rem"
                mx={6}
                bg="gray.300"
              />
              <Text
                cursor="pointer"
                fontWeight="semibold"
                fontSize={["sm", "md", "md", "md"]}
                color="#B8B8B8"
                zIndex="10"
              >
                5HG LEGAL
              </Text>
            </Flex>

            <Text
              fontSize={["8px", "sm", "lg", "lg"]}
              mt={5}
              fontWeight="semibold"
              color="#B8B8B8"
              zIndex="10"
            >
              QUALITY BLOCKCHAIN GAMES FOR ALL
            </Text>
            <Text
              fontSize={["8px", "sm", "lg", "lg"]}
              color="#B8B8B8"
              fontWeight="semibold"
              zIndex="10"
            >
              5headgames.com
            </Text>

            <Flex mt={3} className="align-item-center">
              <Text
                fontSize={["8px", "xs", "sm", "sm"]}
                fontWeight="semibold"
                textAlign="center"
                color={["#B8B8B8", "#B8B8B8", "#393939", "#393939"]}
                zIndex="10"
              >
                {year} 5HEADGAMES, INC. ALL RIGHTS RESERVED
              </Text>
            </Flex>

            <Text
              fontSize={["8px", "xs", "sm", "sm"]}
              className="align-item-center"
              textAlign="center"
              fontWeight="semibold"
              color={["#B8B8B8", "#B8B8B8", "#393939", "#393939"]}
              zIndex="10"
            >
              All trademarks referenced herein are the properties of their
              respective owners.
            </Text>
          </Flex>
          <Image
            src={"/images/footerBgImage2.png"}
            position="absolute"
            bottom="0"
            right="0"
            className="footer-character sm:flex hidden"
            zIndex="10"
          ></Image>
        </Flex>
      </Flex>
    </>
  );
};

export default Footer;
