import React from "react";
import { Flex, Text, Image, useMediaQuery } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import comicDetails from "utils/comicsData.json";
import Link from "next/link";

function MyComics({ balance }) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const [isAtLeast1078px] = useMediaQuery("(min-width: 840px)");

  return (
    <div className="sliders-container">
      {isAtLeast1078px ? (
        <>
          <Flex mt={20} mb={20} justifyContent={"center"}>
            <Text
              fontSize={["30px", "50px", "65px", "4xl"]}
              ml={3}
              color="#FFFFFF"
              fontWeight="500"
            >
              MY COMICS
            </Text>
          </Flex>
          {comicDetails.filter((comic) => {
            let valid = false;
            balance.forEach((balance) => {
              if (balance.balance > 0 && balance.id === comic.id) {
                valid = true;
              }
            });
            return valid;
          }).length > 0 ? (
            <Slider {...settings} className="comic-slides">
              {comicDetails
                .filter((comic) => {
                  let valid = false;
                  balance.forEach((balance) => {
                    if (balance.balance > 0 && balance.id === comic.id) {
                      valid = true;
                    }
                  });
                  return valid;
                })
                .map((item) => (
                  <Flex key={Math.random().toString()}>
                    <Link href={`/comics/${item.name}`}>
                      <Image
                        className="images-width-comic-series"
                        src={item.comic_banner}
                        ml={2}
                        mr={2}
                        mt={2}
                      ></Image>
                    </Link>
                    <Text
                      className="human-vs-orges-text"
                      position={"absolute"}
                      bottom={[15, 5, 5, 5]}
                      ml={5}
                      color="#FFFFFF"
                      fontSize={["12px", "12px", "16px", "18px"]}
                    >
                      {item.name}
                    </Text>
                  </Flex>
                ))}

              <Flex>
                <Image
                  className="images-width-comic-series"
                  src={"/images/comicSeriesOtherCards.png"}
                  ml={2}
                  mr={2}
                  mt={2}
                ></Image>
              </Flex>
              <Flex>
                <Image
                  className="images-width-comic-series"
                  src={"/images/comicSeriesOtherCards.png"}
                  ml={2}
                  mr={2}
                  mt={2}
                ></Image>
              </Flex>
              <Flex>
                <Image
                  className="images-width-comic-series"
                  src={"/images/comicSeriesOtherCards.png"}
                  ml={2}
                  mr={2}
                  mt={2}
                ></Image>
              </Flex>
              <Flex>
                <Image
                  className="images-width-comic-series"
                  src={"/images/comicSeriesOtherCards.png"}
                  ml={2}
                  mr={2}
                  mt={2}
                ></Image>
              </Flex>
              <Flex>
                <Image
                  className="images-width-comic-series"
                  src={"/images/comicSeriesOtherCards.png"}
                  ml={2}
                  mr={2}
                  mt={2}
                ></Image>
              </Flex>
            </Slider>
          ) : (
            <div className="w-full py-24 flex items-center justify-center">
              <div className="h-full flex text-2xl flex-col items-center justify-center text-white font-bold gap-8 text-md text-center w-1/2 p-4">
                <img src={"icons/logo.png"} className="w-32 h-32" alt="" />
                There aren't comics in your inventory.
              </div>
            </div>
          )}
        </>
      ) : (
        <MobileView />
      )}
    </div>
  );
}

export default MyComics;

function MobileView() {
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="sliders-container">
      <Flex mt={10} mb={10} justifyContent={"center"}>
        <Text
          fontSize={["lg", "xl", "3xl", "4xl"]}
          ml={3}
          color="#FFFFFF"
          fontWeight="500"
          className="recently-heading"
        >
          MY COMICS
        </Text>
      </Flex>

      <div className="added-comic-slider">
        <Slider {...settings}>
          {comicDetails.map((item) => (
            <Flex key={Math.random().toString()}>
              <Link href={`/comics/${item.name}`}>
                <Image
                  className="images-width-comic-series"
                  src={item.comic_banner}
                  ml={2}
                  mr={2}
                  mt={2}
                ></Image>
              </Link>
              <Text
                className="human-vs-orges-text"
                position={"absolute"}
                bottom={[15, 5, 5, 5]}
                ml={5}
                color="#FFFFFF"
                fontSize={["16px", "16px", "12px", "12px"]}
              >
                {item.name}
              </Text>
            </Flex>
          ))}
          <Flex>
            <Image
              className="images-width-comic-series"
              src={"/images/comicSeriesOtherCards.png"}
              ml={2}
              mr={2}
              mt={2}
            ></Image>
          </Flex>
          <Flex>
            <Image
              className="images-width-comic-series"
              src={"/images/comicSeriesOtherCards.png"}
              ml={2}
              mr={2}
              mt={2}
            ></Image>
          </Flex>
          <Flex>
            <Image
              className="images-width-comic-series"
              src={"/images/comicSeriesOtherCards.png"}
              ml={2}
              mr={2}
              mt={2}
            ></Image>
          </Flex>
          <Flex>
            <Image
              className="images-width-comic-series"
              src={"/images/comicSeriesOtherCards.png"}
              ml={2}
              mr={2}
              mt={2}
            ></Image>
          </Flex>
          <Flex>
            <Image
              className="images-width-comic-series"
              src={"/images/comicSeriesOtherCards.png"}
              ml={2}
              mr={2}
              mt={2}
            ></Image>
          </Flex>
          <Flex>
            <Image
              className="images-width-comic-series"
              src={"/images/comicSeriesOtherCards.png"}
              ml={2}
              mr={2}
              mt={2}
            ></Image>
          </Flex>
          <Flex>
            <Image
              className="images-width-comic-series"
              src={"/images/comicSeriesOtherCards.png"}
              ml={2}
              mr={2}
              mt={2}
            ></Image>
          </Flex>
        </Slider>
      </div>
    </div>
  );
}
