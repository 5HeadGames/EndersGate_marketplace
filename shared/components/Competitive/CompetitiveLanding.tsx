"use client";

import { Box, Flex, Image, Text, Link } from "@chakra-ui/react";

export const CompetitiveLanding = () => {
  return (
    <>
      <Flex
        bgImage={"./images/competitiveBackground.png"}
        bgPos="center"
        bgSize="cover"
        display={"flex"}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        w="100%"
        minH={["auto", "auto", "100vh"]}
        pos="relative"
        overflow="hidden"
        py={20}
        px={8}
      >
        <Box
          top={["50px", "100px"]}
          textAlign="center"
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          flexDirection="column"
          w={"100%"}
          zIndex="10"
        >
          <Image
            src={"./icons/endersGateLogo.svg"}
            alt="Ender's Gate logo"
            w={["85%", "75%", "55%", "40%"]}
            mb="8"
          />
        </Box>
        <Box
          bg="linear-gradient(180deg, rgba(0, 0, 0, 0.8) 50%, rgba(255, 231, 213, 0.5) 100%)"
          pos="absolute"
          h="auto"
          top="0"
          bottom="0"
          left="0"
          right="0"
        />

        <Flex
          w={["100%", "60%"]}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          m={[4, 8]}
          mb="20px"
          zIndex="1"
          pos="relative"
          bottom="0"
        >
          <Box
            w={["100%", "90%"]}
            zIndex="2"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mb="5px"
          >
            <Text
              fontSize={["16px", "24px", "28px"]}
              fontFamily="Inter"
              fontWeight="bold"
              textAlign="center"
              color="#B8B8B8"
              textShadow="0px 4px 10px #000000"
              mb="20px"
            >
              WEEKLY TOURNAMENT OF HONOR HAS BEGUN!
            </Text>
          </Box>

          <Box
            display="flex"
            flexDirection={["row"]}
            justifyContent="center"
            alignItems={["center", "center", "flex-start"]}
            w={["80%", "90%"]}
            mt="5px"
            flexWrap="nowrap"
            zIndex="2"
            gap={"8px"}
          >
            <Box>
              <Image
                src={"./images/competitiveSteps/Group 562.png"}
                alt="Step 1"
                w={["140px", "250px"]}
                h="auto"
              />
            </Box>
            <Box>
              <Image
                src={"./images/competitiveSteps/Group 566.png"}
                alt="Step 2"
                w={["140px", "250px"]}
                h="auto"
              />
            </Box>
            <Box>
              <Image
                src={"./images/competitiveSteps/Group 567.png"}
                alt="Step 3"
                w={["140px", "250px"]}
                h="auto"
              />
            </Box>
          </Box>
        </Flex>
        <Flex
          w={["100%", "80%", "70%", "60%"]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mb="20px"
          zIndex="1"
          bottom="0"
        >
          <Box
            w={["100%", "80%", "70%", "60%"]}
            zIndex="2"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mb="5px"
            px={16}
          >
            <Text
              fontSize={["16px", "24px", "28px"]}
              fontFamily="Inter"
              fontWeight="bold"
              textAlign="center"
              color="#B8B8B8"
              textShadow="0px 4px 10px #000000"
              mb="20px"
            >
              PARTICIPATE CROSS PLATFORM
            </Text>
          </Box>
        </Flex>
        <Box
          display="flex"
          flexDirection={["row"]}
          justifyContent="center"
          alignItems={["center", "center", "flex-start"]}
          w={["100%", "90%"]}
          mt="5px"
          flexWrap="nowrap"
          zIndex="2"
          gap={8}
        >
          <Link
            target={"_blank"}
            href="https://endersgate.app"
            display="flex"
            flexDirection={["row"]}
            justifyContent="center"
          >
            <Box>
              <Image
                src={"./images/storeLogos/pc.svg"}
                alt="PC Logo"
                w={["140px", "250px"]}
                h="auto"
                cursor="pointer"
              />
            </Box>
          </Link>
          <Link target={"_blank"} href=" https://forms.gle/N6fh6FjKPw82j9EW9">
            <Box>
              <Image
                src={"./images/storeLogos/apple.svg"}
                alt="Apple Store Logo"
                w={["140px", "250px"]}
                h="auto"
                cursor="pointer"
              />
            </Box>
          </Link>
          <Link
            target={"_blank"}
            href="https://play.google.com/store/apps/details?id=com.FiveHeadGames.EndersGateTCG"
          >
            <Box>
              <Image
                src={"./images/storeLogos/android.svg"}
                alt="Android Store Logo"
                w={["140px", "250px"]}
                h="auto"
                cursor="pointer"
              />
            </Box>
          </Link>
        </Box>
      </Flex>
    </>
  );
};
