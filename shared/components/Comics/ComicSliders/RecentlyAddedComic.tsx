/* eslint-disable eqeqeq */
import React from "react";
import { Flex, Text, Image, useMediaQuery } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ComicSeriesSlider from "./ComicSeriesSlider";
import MyComics from "./MyComicsSlider";
import clsx from "clsx";
import { CheckIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import { Button } from "@shared/components/common/button";
import { addCartComics, removeFromCartComics } from "@redux/actions";
import { Input } from "@shared/components/common/form/input";
import { useModal } from "@shared/hooks/modal";
import { useForm } from "react-hook-form";

function RecentlyAddedComic({ priceUSD, getPriceMatic, balance, showCart }) {
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [issues, setIssues] = React.useState([
    { name: "", photo: "" },
    {
      id: 1,
      name: "AvS ISSUE #1",
      nameComic: "Ascended vs Sentinels",
      photo: "/images/AscendedVsSentinels1.webp",
      quantity: 0,
    },
    {
      id: 2,
      name: "HvO ISSUE #1",
      nameComic: "Humans vs Ogres",
      photo: "/images/HumansVsOgres1.webp",
      quantity: 0,
    },
    { name: "", photo: "" },
  ]);

  const { addToast } = useToasts();

  const [hoverBuy, setHoverBuy] = React.useState([false, false, false, false]);
  const [nftModal, setNftModal] = React.useState({
    id: 0,
    balance: 0,
    nameComic: "",
  });

  const { register } = useForm();

  const router = useRouter();

  const dispatch = useDispatch();

  const { Modal, isShow, show, hide } = useModal();

  const { ethAddress: account } = useSelector(
    (state: any) => state.layout.user,
  );

  const { cartComics } = useSelector((state: any) => state.layout);

  const [isAtLeast1078px] = useMediaQuery("(min-width: 840px)");
  return (
    <div className="sliders-container">
      <Modal isShow={isShow}>
        <div
          style={{ width: "90vw", maxWidth: "800px" }}
          className="relative bg-gray-900 flex flex-col items-center gap-4 jusify-center rounded-2xl py-16 px-8 border border-white text-white overflow-auto"
        >
          <div className="absolute top-2 right-4 flex justify-end w-full py-2">
            {" "}
            <XIcon
              className="text-white w-6 cursor-poointer"
              onClick={() => {
                hide();
              }}
            />{" "}
          </div>
          <h2 className="text-white text-center font-bold text-xl text-red-alert">
            Read Now by Minting and Receive a Printed Copy{" "}
          </h2>{" "}
          <p className="text-center text-white text-lg">
            To proceed and access the comic book, you will need to mint it as an
            NFT. By minting the comic book NFT, you can obtain exclusive
            ownership of the digital version and unlock additional benefits.
            Additionally, as a special offer (available for shipping within the
            USA only), you will have the opportunity to receive a physical
            printed copy delivered directly to your doorstep.
          </p>
          {nftModal.balance > 0 ? (
            <Button
              decoration="greenLine"
              className="px-8 py-2 mb-2 rounded-md text-green-button border border-green-button hover:border-none hover:text-overlay hover:bg-green-button"
              onClick={() => {
                router.push("/comics/" + nftModal.nameComic);
              }}
            >
              Read Now!
            </Button>
          ) : (
            <Button
              decoration="greenLine"
              className="px-8 py-2 mb-2 rounded-md text-green-button border border-green-button hover:border-none hover:text-overlay hover:bg-green-button"
              onClick={() => {
                dispatch(addCartComics({ ...nftModal, quantity: 1 }));
                getPriceMatic();
                showCart();
              }}
            >
              Buy
            </Button>
          )}
        </div>
      </Modal>
      {isAtLeast1078px ? (
        <>
          {/* <ComicSeriesSlider /> */}

          <Flex mt={20} mb={20} justifyContent={"center"}>
            <Text
              fontSize={["30px", "50px", "65px", "4xl"]}
              ml={3}
              color="#FFFFFF"
              fontWeight="500"
            >
              RECENTLY ADDED
            </Text>
          </Flex>
          <Slider {...settings}>
            {issues.map((i: any, id) => {
              return i.name ? (
                <Flex className="relative">
                  <Flex className="box-shadow relative w-auto">
                    <div
                      onMouseOver={() =>
                        setHoverBuy((prev) => {
                          const array = [];
                          prev.forEach((i, idPrev) => {
                            if (id == idPrev) {
                              array.push(true);
                            } else {
                              array.push(i);
                            }
                          });
                          return array;
                        })
                      }
                      onMouseLeave={() =>
                        setHoverBuy((prev) => {
                          const array = [];
                          prev.forEach((i, idPrev) => {
                            if (id == idPrev) {
                              array.push(false);
                            } else {
                              array.push(i);
                            }
                          });
                          return array;
                        })
                      }
                      style={{ zIndex: 1000 }}
                      className={clsx(
                        "rounded-full p-2 flex w-10 h-10 items-center justify-center border-overlay-border border cursor-pointer absolute top-4 right-10",
                        {
                          ["gap-1 w-20 px-3 text-center"]: hoverBuy[id],
                        },
                        {
                          "hover:bg-red-500 bg-green-button hover:transition-all transition-all duration-500 hover:duration-500":
                            cartComics.filter((e) => e.name == i.name).length >
                            0,
                        },
                        {
                          "bg-overlay hover:bg-overlay-2 hover:transition-all transition-all duration-500 hover:duration-500":
                            cartComics.filter((e) => e.name == i.name).length ==
                            0,
                        },
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {cartComics.filter((e) => e.name == i.name).length > 0 ? (
                        hoverBuy[id] ? (
                          <XIcon
                            className="!w-6 text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                cartComics.filter((e) => e.name == i.name)
                                  .length > 0
                              ) {
                                dispatch(
                                  removeFromCartComics({
                                    id: i.id,
                                  }),
                                );
                              } else {
                                dispatch(
                                  addCartComics({
                                    ...i,
                                    priceUSD: priceUSD,
                                    quantity: issues[id].quantity,
                                  }),
                                );
                              }
                            }}
                          />
                        ) : (
                          <CheckIcon
                            className="!w-6 text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                cartComics.filter((e) => e.name == i.name)
                                  .length > 0
                              ) {
                                dispatch(
                                  removeFromCartComics({
                                    id: i.transactionId,
                                  }),
                                );
                              } else {
                                dispatch(
                                  addCartComics({
                                    ...i,
                                    priceUSD: priceUSD,
                                    quantity: issues[id].quantity,
                                  }),
                                );
                              }
                            }}
                          />
                        )
                      ) : (
                        <>
                          <PlusIcon
                            className="shrink-0 w-6 text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              console.log(account, i);
                              if (account) {
                                dispatch(
                                  addCartComics({
                                    ...i,
                                    priceUSD: priceUSD,
                                    quantity: issues[id].quantity,
                                  }),
                                );
                              } else {
                                router.push(
                                  "/login?redirect=true&redirectAddress=/comics",
                                );
                              }
                            }}
                          />

                          <Input
                            type="number"
                            name="quantity"
                            register={register}
                            classNameContainer={clsx(
                              "border-none outline-none bg-transparent text-white w-10 text-sm p-0",
                            )}
                            className={clsx(
                              {
                                hidden:
                                  !hoverBuy[id] || parseInt(i.amount) <= 1,
                              },
                              "p-0 bg-transparent",
                            )}
                            withoutX
                            onClick={(e) => e.preventDefault()}
                            min={1}
                            defaultValue={issues[id].quantity}
                            value={issues[id].quantity}
                            onChange={(e) => {
                              if (
                                parseInt(e.target.value) > parseInt(i.amount)
                              ) {
                                addToast(
                                  "Your amount exceeds the amount of NFTs of the sale",
                                  { appearance: "error" },
                                );
                              } else {
                                setIssues((prev) => {
                                  const array = [];
                                  prev.forEach((a, idPrev) => {
                                    array.push({
                                      ...a,
                                      quantity:
                                        id == idPrev
                                          ? parseInt(e.target.value)
                                          : a.quantity,
                                    });
                                  });
                                  return array;
                                });
                              }
                            }}
                          ></Input>
                        </>
                      )}
                    </div>
                    <Image
                      className="images-width cursor-pointer shade-on-hover relative"
                      fontWeight="500"
                      ml={2}
                      mt={2}
                      mr={2}
                      src={i.photo}
                      onClick={() => {
                        let valid = false;
                        balance.forEach(
                          (balance: { balance: number; id: any }) => {
                            if (balance.balance > 0 && balance.id == i.id) {
                              valid = true;
                            }
                          },
                        );
                        if (valid) {
                          setNftModal({
                            ...i,
                            priceUSD: priceUSD,
                            quantity: 1,
                            balance: 1,
                          });
                        } else {
                          setNftModal({
                            ...i,
                            priceUSD: priceUSD,
                            quantity: issues[id].quantity,
                            balance: 0,
                          });
                        }
                        show();
                      }}
                    ></Image>
                  </Flex>
                  <Text className="endersgate-issues-text" color="#FFFFFF">
                    {i.name}
                  </Text>
                </Flex>
              ) : (
                <Flex></Flex>
              );
            })}
          </Slider>
          <MyComics balance={balance} />
        </>
      ) : (
        <MobileView />
      )}
    </div>
  );
}
export default RecentlyAddedComic;

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

  const issues = [
    { name: "AvS ISSUE #1", photo: "assets/AscendedVsSentinels1.webp" },
    { name: "HvO ISSUE #1", photo: "assets/HumansVsOgres1.webp" },
    // { name: "COMING SOON", photo: RecentlyAddedCards },
    // { name: "COMING SOON", photo: RecentlyAddedCards },
  ];

  return (
    <div className="">
      <Flex mt={10} mb={10} justifyContent={"center"}>
        <Text
          fontSize={["lg", "xl", "3xl", "4xl"]}
          ml={3}
          color="#FFFFFF"
          fontWeight="500"
          className="recently-heading"
        >
          RECENTLY ADDED
        </Text>
      </Flex>
      <div className="added-comic-slider">
        <Slider {...settings}>
          {issues.map((i, a) => (
            <Flex flexDir={"column"}>
              <Image
                className="recently-slider-image"
                src={i.photo}
                ml={2}
                mt={2}
                mr={2}
              ></Image>
              <Text className="endersgate-issues-text" color="#FFFFFF">
                {i.name}
              </Text>
            </Flex>
          ))}
        </Slider>
      </div>
      <ComicSeriesSlider />
    </div>
  );
}
