import React from "react";
import { Flex, Text, Image, useMediaQuery } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import comicsByID from "@shared/comicsByNFTId.json";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Zoom } from "swiper";

function MyComics({ balance }) {
  const settings = {
    loop: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  return (
    <>
      <Flex mt={20} mb={10} justifyContent={"center"} id="my_comics">
        <Text
          fontSize={["30px", "50px", "65px", "4xl"]}
          ml={3}
          color="#FFFFFF"
          fontWeight="500"
        >
          MY COMICS
        </Text>
      </Flex>
      {comicsByID.filter((comic) => {
        let valid = false;
        balance.forEach((balance) => {
          if (balance.balance > 0 && balance.id === comic.id) {
            valid = true;
          }
        });
        return valid;
      }).length > 0 ? (
        <div className="inline-block">
          <Swiper
            slidesPerView={2}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            zoom={true}
            initialSlide={0}
            modules={[Zoom]}
            className="mySwiper w-full"
            spaceBetween={10}
            breakpoints={{
              700: {
                slidesPerView: 2,
                centeredSlides: false,
              },
              100: {
                slidesPerView: 1,
                centeredSlides: true,
              },
            }}
          >
            {comicsByID
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
                <SwiperSlide className="w-full sm:min-w-[450px] min-w-[300px]">
                  <Flex key={Math.random().toString()} className="w-full">
                    <Link href={`/comics/${item.nameLink}/${item.issue}`}>
                      <Image
                        className="images-width-comic-series cursor-pointer w-full"
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
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      ) : (
        <div className="w-full py-24 flex items-center justify-center">
          <div className="h-full flex text-2xl flex-col items-center justify-center text-white font-bold gap-8 text-md text-center w-1/2 p-4">
            <img src={"icons/logo.png"} className="w-32 h-32" alt="" />
            There aren't comics in your inventory.
          </div>
        </div>
      )}
    </>
  );
}

export default MyComics;
//  slidesPerView={2}
//                   onSlideChange={() => console.log("slide change")}
//                   onSwiper={(swiper) => console.log(swiper)}
//                   zoom={true}
//                   navigation={{
//                     enabled: true,
//                     nextEl: ".swiper-button-next",
//                     prevEl: ".swiper-button-prev",
//                   }}
//                   initialSlide={0}
//                   modules={[Zoom, Navigation]}
//                   className="mySwiper w-full"
//                   spaceBetween={10}
//                   breakpoints={{
//                     700: {
//                       slidesPerView: 2,
//                       centeredSlides: false,
//                     },
//                     100: {
//                       slidesPerView: 1,
//                       centeredSlides: true,
//                     },
//                   }}
